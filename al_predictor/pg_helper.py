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


def read_all_unlabeled_text():
    print('Reading all text data', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT tweet_id, headline, description FROM tweets WHERE labeled = false
        """
        df = pd.read_sql_query(statement, con=conn)
        df['tweet'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)
        count_vec = load_count_vec()
        vect_data = count_vec.transform(df['tweet'].to_numpy())
        df['vect'] = pd.DataFrame(vect_data)

    return df


def save_queries(selection):
    selection = selection.sort_values(by=['uncertainty'], ascending=False)
    selection = selection.head(keys.set_size)
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
            SELECT tweet_id, headline, description FROM tweets ORDER BY tweet_id ASC LIMIT %(set_size)s
        """
        df = pd.read_sql_query(select_statement, con=conn, params={"set_size": int(keys.set_size)})
        df['tweet'] = df['headline'] + " " + df['description']
        insert_statement = """
            INSERT INTO queries(tweet_id, tweet, labels, users) VALUES (%s, %s, %s, %s)
        """
        for index, row in df.iterrows():
            cur.execute(insert_statement, (row['tweet_id'], row['tweet'], [], []))
        conn.commit()
        cur.close()


def load_count_vec():
    print('Loading count vec')
    conn = connect()
    if conn is not None:
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
