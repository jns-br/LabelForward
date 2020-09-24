import keys
import psycopg2
import pandas as pd


def connect():
    conn = None
    try:
        conn = psycopg2.connect(
            host=keys.pg_host,
            dbname=keys.pg_dbname,
            user=keys.pg_user,
            password=keys.pg_password,
            port=keys.pg_port)

    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)

    return conn


def load_model_by_id(conn, clf_id):
    cur = conn.cursor()
    statement = """
        SELECT clf FROM classifiers WHERE clf_id = %s
    """
    cur.execute(statement, (clf_id, ))
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]


def load_unlabeled_data(conn):
    statement = """
        SELECT * FROM text_data WHERE major_label IS NULL
    """
    df = pd.read_sql_query(statement, con=conn)
    return df


def load_human_labeled_data(conn):
    statement = """
        SELECT * FROM text_data WHERE major_label IS NOT NULL
    """
    df = pd.read_sql_query(statement, con=conn)
    return df


def load_count_vec(conn):
    cur = conn.cursor()
    statement = """
        SELECT countvec FROM countvecs ORDER BY countvec_id DESC LIMIT 1
    """
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]


def update_download_status(conn, clf_id, status):
    cur = conn.cursor()
    statement = """
        UPDATE classifiers SET download = %s WHERE clf_id = %s
    """
    cur.execute(statement, (status, clf_id))
    conn.commit()
