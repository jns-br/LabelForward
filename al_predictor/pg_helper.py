import psycopg2
import keys
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


def load_data(conn):
    print('Loading untaught data', flush=True)
    statement = """
        SELECT text_id, text_data FROM text_data
    """
    df = pd.read_sql_query(statement, con=conn)
    return df


def load_last_model(conn):
    print('Loading last model', flush=True)
    statement = """
        SELECT clf FROM classifiers ORDER BY clf_id DESC LIMIT 1
    """
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]


def insert_uncertainties(data, conn):
    cur = conn.cursor()
    statement = """
        UPDATE text_data SET uncertainty = %s WHERE text_id = %s
    """
    for index, row in data.iterrows():
        cur.execute(statement, (row['uncertainty'], row['text_id']))
    conn.commit()


def load_count_vec(conn):
    print('Loading count vec')
    statement = """
        SELECT countvec FROM countvecs ORDER BY countvec_id DESC LIMIT 1
    """
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]
