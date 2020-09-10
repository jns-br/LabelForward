import psycopg2, keys
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


# legacy, maybe useful if online learning is implemented
def read_labeled_data_partial():
    print('Reading labeled data partial', flush=True)
    conn = connect()
    if conn is not None:
        cur = conn.cursor()
        indices_statement = """
            SELECT start_index, end_index FROM result_indices ORDER BY ri_id DESC LIMIT 1
        """
        cur.execute(indices_statement)
        indices_data = cur.fetchone()
        start_index = indices_data[0]
        end_index = indices_data[1]

        data_statement = """
            SELECT * FROM results WHERE  result_id >= %(start_index)s AND result_id <= %(end_index)s
        """
        df = pd.read_sql_query(data_statement, con=conn, params={"start_index": start_index, "end_index": end_index})

    return df


def read_labeled_data_full():
    print('Reading labeled data full', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT * FROM queries WHERE labeled = true AND 
        """
        df = pd.read_sql_query(statement, con=conn)
        df['text'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)
    return df


def read_new_labeled_data():
    print('Reading new labeled data', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT * FROM queries WHERE NOT (0 = array_length(labels, 1)) AND labeled != true
        """
        df = pd.read_sql_query(statement, con=conn)
        df['text'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)
        return df


def read_all_text():
    print('Reading all text data', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT query_id, headline, description FROM queries
        """
        df = pd.read_sql_query(statement, con=conn)
        df['text'] = df['headline'] + " " + df['description']
        df = df.drop(['headline', 'description'], axis=1)
        df = df[df.major_label != 'ignored']

    return df


def save_countvec(data):
    print('Saving count vectorizer', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            INSERT INTO countvecs(countvec) VALUES (%s)
        """
        cur = conn.cursor()
        cur.execute(statement, (data,))
        cur.close()
        conn.commit()


def load_last_countvec():
    print('Loading last countvec', flush=True)
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


def save_model(data):
    print('Saving model', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            INSERT INTO classifiers(clf) VALUES (%s) RETURNING clf_id
        """
        cur = conn.cursor()
        cur.execute(statement, (data,))
        conn.commit()
        id = cur.fetchone()[0]
        cur.close()
        return id


def update_label(index, label):
    conn = connect()
    if conn is not None:
        statement = """"
            UPDATE queries SET label = %s, labeled = %s WHERE query_id = %s
        """
        cur = conn.cursor()
        cur.execute(statement, (label, True, index))
        conn.commit()
        cur.close()