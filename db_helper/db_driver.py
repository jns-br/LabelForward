import psycopg2
import keys
import pandas as pd
import redis
import sys
import logging
import logging.config
import yaml

logger = logging.getLogger('logger')

def connect():
    logger.info('Initializing Postgres connection')
    conn = None
    try:
        
        conn = psycopg2.connect(host=keys.host, dbname=keys.dbname, user=keys.user, password=keys.password, port=keys.port)
        cur = conn.cursor()
        cur.close()
    except (Exception, psycopg2.DatabaseError):
        logger.exception('Postgres connection failed')
        sys.exit(1)
    logger.info('Postgres connection initialized')
    return conn


def create_table(conn):
    logger.info('Creating tables')
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
            uncertainty FLOAT,
            predicted_label TEXT
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
        CREATE TABLE IF NOT EXISTS sample_timestamps(
            stamp_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            text_id INTEGER NOT NULL,
            start_time TIMESTAMP,
            end_time TIMESTAMP
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS downloads(
            download_id SERIAL PRIMARY KEY,
            clf_id INTEGER NOT NULL,
            file BYTEA NOT NULL
        )
    """,
    """
        CREATE TABLE IF NOT EXISTS init_data(
            init_id SERIAL PRIMARY KEY,
            text_data TEXT NOT NULL,
            label TEXT NOT NULL
        )
    """
    )
    try:
        cur = conn.cursor()
        for statement in statements:
            cur.execute(statement)
        cur.close()
        conn.commit()
        logger.info('Table creation successful')
    except (Exception, psycopg2.DatabaseError):
        logger.exception('Table creation failed')


def read_text_data(conn):
    logger.info('Inserting text data')
    text_data = pd.read_json(keys.data_path)
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
        except psycopg2.DatabaseError:
            logger.exception('Text data insertion failed')

    conn.commit()
    cur.close()
    logger.info('Inserted text datapoints: ' + str(doc_counter))


def read_labels(conn):
    logger.info('Inserting labels')
    label_data = pd.read_json(keys.label_path)
    cur = conn.cursor()
    statement = """
        INSERT INTO labels(label) VALUES (%s) ON CONFLICT DO NOTHING
    """

    for index, row in label_data.iterrows():
        try:
            cur.execute(statement, (row['labels'], ))
        except psycopg2.DatabaseError:
            logger.exception('Label insertion failed')

    conn.commit()
    cur.close()
    logger.info('Label insertion successful')

def read_accessors(conn):
    logger.info('Inserting accessors')
    accessor_data = pd.read_json(keys.accessor_path)
    cur = conn.cursor()
    statement = "INSERT INTO accessors(email) VALUES (%s) ON CONFLICT DO NOTHING"

    for index, row in accessor_data.iterrows():
        try:
            cur.execute(statement, (row['accessor'], ))
        except psycopg2.DatabaseError:
            logger.info('Accessor insertion failed')
    
    conn.commit()
    cur.close()
    logger.info('Accessor inerstion successful')


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


def read_init_data(conn):
    logger.info('Insertion init data')
    try:
        init_data = pd.read_json(keys.init_data_path)
        cur = conn.cursor()    
        statement = "INSERT INTO init_data(text_data, label) VALUES (%s, %s) ON CONFLICT DO NOTHING"

        for index, row in init_data.iterrows():
            try:
                cur.execute(statement, (row['data'], row['label']))
            except psycopg2.DatabaseError:
                logger.exception('Init data insertion failed')
        
        conn.commit()
        cur.close()
        logger.info('Init data insertion successful')
    except (ValueError, FileNotFoundError):
        logger.warn('No init data found')


if __name__ == '__main__':
    with open('logger-config.yaml', 'r') as f:
        config = yaml.safe_load(f.read())
        logging.config.dictConfig(config)

    conn = connect()
    create_table(conn)
    read_init_data(conn)
    read_accessors(conn)
    read_text_data(conn)
    read_labels(conn)
    data_exists = check_for_existing_data(conn)
    if not data_exists:
        r = redis.Redis(host=keys.redis_host, port=keys.redis_port, decode_responses=True)
        r.publish('learner', 'init')
