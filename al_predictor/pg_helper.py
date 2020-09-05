import psycopg2
import keys
import pandas as pd


def connect():
    conn = None
    try:
        print('Connecting to Postgres database', flush=True)
        conn = psycopg2.connect(
            host=keys.pg_host,
            dbname=keys.pg_dbname,
            user=keys.pg_user,
            password=keys.pg_password,
            port=keys.pg_port)

    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)

    return conn


def load_last_model():
    conn = connect()
    if conn is not None:
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


def read_all_text():
    print('Reading all text data', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT headline, description FROM news
        """
        df = pd.read_sql_query(statement, con=conn)
        df['text'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)

    return df