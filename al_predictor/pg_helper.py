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
            SELECT tweet_id, headline, description FROM tweets
        """
        df = pd.read_sql_query(statement, con=conn)
        df['tweet'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)

    return df


def save_queries(selection):
    print('Inserting new queries', flush=True)
    conn = connect()
    if conn is not None:
        truncate_statement = """
            TRUNCATE TABLE queries
        """
        cur = conn.cursor()
        cur.execute(truncate_statement)
        conn.commit()
        insert_statement = """
            INSERT INTO queries(tweet_id, tweet, uncertainty) VALUES (%s, %s, %s)
        """
        for index, row in selection.iterrows():
            cur.execute(insert_statement, (row['tweet_id'], row['tweet'], row['uncertainty']))
        conn.commit()


def get_initial_batch():
    print('Creating initial queries', flush=True)
    conn = connect()
    if conn is not None:
        truncate_statement = """
                    TRUNCATE TABLE queries
                """
        cur = conn.cursor()
        cur.execute(truncate_statement)
        conn.commit()
        select_statement = """
            SELECT tweet_id, headline, description FROM tweets ORDER BY tweet_id LIMIT %(set_size)s ASC 
        """
        df = pd.read_sql_query(select_statement, con=conn, params={"set_size": keys.set_size})
        df['tweet'] = df['headline'] + " " + df['description']
        insert_statement = """
            INSERT INTO queries(tweet_id, tweet) VALUES (%s, %s)
        """
        for index, row in df.iterrows():
            cur.execute(insert_statement, (row['tweet_id'], row['tweet']))
        conn.commit()
        cur.close()