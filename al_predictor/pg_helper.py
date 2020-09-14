import psycopg2
import keys
import pandas as pd
import pickle


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


def load_last_model():
    print('Loading last model', flush=True)
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
    print('Reading all unlabeled text data', flush=True)
    conn = connect()
    if conn is not None:
        statement = """
            SELECT text_id, text_data FROM text_data WHERE labeled = false
        """
        df = pd.read_sql_query(statement, con=conn)

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
            INSERT INTO queries(text_id, text_data, uncertainty, labels, users) VALUES (%s, %s, %s, %s, %s)
        """
        update_selected = """
             UPDATE text_data SET selected = true WHERE text_id = %s
        """
        for index, row in selection.iterrows():
            cur.execute(insert_statement, (row['text_id'], row['text_data'], row['uncertainty'], [], []))
            cur.execute(update_selected, (row['text_id'], ))
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
            SELECT text_id, text_data FROM text_data WHERE selected = false ORDER BY text_id ASC LIMIT %(set_size)s
        """
        df = pd.read_sql_query(select_statement, con=conn, params={"set_size": int(keys.set_size)})
        insert_statement = """
            INSERT INTO queries(text_id, text_data, labels, users) VALUES (%s, %s, %s, %s)
        """
        update_selected = """
            UPDATE text_data SET selected = true WHERE text_id = %s
        """
        for index, row in df.iterrows():
            cur.execute(insert_statement, (row['text_id'], row['text_data'], [], []))
            cur.execute(update_selected, (row['text_id'], ))
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
