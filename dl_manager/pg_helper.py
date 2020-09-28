import keys
import psycopg2
import pandas as pd
import sys


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
        sys.exit(1)

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


def persist_download(conn, clf_id, filename):
    cur = conn.cursor()
    statement = """
        INSERT INTO downloads(clf_id, file) VALUES(%s, %s)
    """
    with open(filename, 'rb') as zip_archive:
        cur.execute(statement, (clf_id, zip_archive.read()))


def save_labeled_data(conn, df, clf_id):
    table_name = 'data-' + clf_id
    cur = conn.cursor()
    create_statement = """
        CREATE TABLE IF NOT EXISTS {0}(
            text_id INTEGER PRIMARY KEY,
            text_data TEXT NOT NULL,
            label VARCHAR(50) NOT NULL
        )
    """.format(table_name)
    cur.execute(create_statement)
    insert_statement = """
        INSERT INTO {0} (text_id, text_data, label) VALUES (%s, %s, %s)
    """.format(table_name)
    for index, row in df.iterrows():
        cur.execute(insert_statement, (row['text_id'], row['text_data'], row['major_label']))
    conn.commit()

