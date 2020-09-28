import psycopg2
import keys
import pandas as pd
import redis
import sys

def connect():
    conn = None
    try:
        print('Connecting to Postgres database')
        conn = psycopg2.connect(host=keys.host, dbname=keys.dbname, user=keys.user, password=keys.password, port=keys.port)

        cur = conn.cursor()

        # execute a statement
        print('PostgreSQL database version:')
        cur.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cur.fetchone()
        print(db_version)

        # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)

    return conn


def create_table(conn):
    statements = ("""
        CREATE TABLE IF NOT EXISTS text_data(
            text_id SERIAL PRIMARY KEY,
            text_data TEXT NOT NULL,
            labeled BOOL NOT NULL,
            selected BOOL NOT NULL,
            taught BOOL NOT NULL,
            labels TEXT [],
            users TEXT [],
            major_label VARCHAR(50),
            uncertainty FLOAT
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS users(
            user_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR (255) NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS accessors(
            acc_id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS labels(
            label_id SERIAL PRIMARY KEY,
            label TEXT NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS classifiers(
            clf_id SERIAL PRIMARY KEY,
            clf BYTEA NOT NULL,
            precision_score FLOAT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            download INTEGER NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS countvecs(
            countvec_id SERIAL PRIMARY KEY,
            countvec BYTEA NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS downloads(
            download_id SERIAL PRIMARY KEY,
            clf_id INTEGER NOT NULL,
            file BYTEA NOT NULL
        )
    """
    )
    try:
        cur = conn.cursor()
        for statement in statements:
            cur.execute(statement)
        cur.close()
        conn.commit()
        print('Created tables!', flush=True)
    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)


def read_text_data(conn):
    text_data = pd.read_csv(keys.data_path)
    cur = conn.cursor()
    statement = """
        INSERT INTO text_data(text_data, labels, users, labeled, selected, taught) VALUES(%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING
    """
    doc_counter = 0
    for index, row in text_data.iterrows():
        try:
            cur.execute(statement, (row['data'], [], [], False, False, False))
            doc_counter += 1
            if doc_counter % 10000 == 0:
                conn.commit()
                print('Inserted text docs: ', doc_counter, flush=True)
        except psycopg2.DatabaseError as error:
            print('error: ', error, flush=True)

    conn.commit()
    print('Inserted text docs: ', doc_counter, flush=True)
    cur.close()


def read_labels(conn):
    label_data = pd.read_csv(keys.label_path)
    cur = conn.cursor()
    statement = """
        INSERT INTO labels(label) VALUES (%s) ON CONFLICT DO NOTHING
    """

    for index, row in label_data.iterrows():
        try:
            cur.execute(statement, (row['labels'], ))
        except psycopg2.DatabaseError as error:
            print('error: ', error)

    conn.commit()
    print('Inserted labels', flush=True)
    cur.close()

def read_accessors(conn):
    accessor_data = pd.read_csv(keys.accessor_path)
    cur = conn.cursor()
    statement = "INSERT INTO accessors(email) VALUES (%s) ON CONFLICT DO NOTHING"

    for index, row in accessor_data.iterrows():
        try:
            cur.execute(statement, (row['accessor'], ))
        except psycopg2.DatabaseError as error:
            print('error: ', error)
    
    conn.commit()
    print('Inserted accessors', flush=True)
    cur.close()


def check_for_existing_data(conn):
    cur = conn.cursor()
    statement = """
        SELECT COUNT(*) AS cnt FROM text_data WHERE uncertainty IS NOT NULL
    """
    cur.execute(statement)
    result = cur.fetchone()
    if result[0] == 0:
        return False
    else:
        return True


if __name__ == '__main__':
    conn = connect()
    create_table(conn)
    read_accessors(conn)
    read_text_data(conn)
    read_labels(conn)
    data_exists = check_for_existing_data(conn)
    if not data_exists:
        r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
        r.publish('learner', 'init')
