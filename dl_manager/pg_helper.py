import keys
import psycopg2
import pandas as pd
import sys
import logging

logger = logging.getLogger('logger')

def connect():
    logger.info('Intializing Postgres connection')
    conn = None
    try:
        conn = psycopg2.connect(
            host=keys.pg_host,
            dbname=keys.pg_dbname,
            user=keys.pg_user,
            password=keys.pg_password,
            port=keys.pg_port)

    except (Exception, psycopg2.DatabaseError) as error:
        logger.exception('Postgres connection failed')
        sys.exit(1)
    logger.info('Postgres connection initialized')
    return conn


def load_model_by_id(conn, clf_id):
    logger.info('Loading model by ID')
    cur = conn.cursor()
    statement = """
        SELECT clf FROM classifiers WHERE clf_id = %s
    """
    cur.execute(statement, (clf_id, ))
    data = cur.fetchone()
    if data is None:
        logger.info('No model available')
        cur.close()
        return None
    else:
        logger.info('Model loaded from DB')
        cur.close()
        return data[0]


def load_unlabeled_data(conn):
    logger.info('Loading unlabeled data from DB')
    statement = """
        SELECT * FROM text_data WHERE major_label IS NULL
    """
    df = pd.read_sql_query(statement, con=conn)
    logger.info('Unlabeled data loaded from DB')
    return df


def load_human_labeled_data(conn):
    logger.info('Loading human labeled data from DB')
    statement = """
        SELECT * FROM text_data WHERE major_label IS NOT NULL
    """
    df = pd.read_sql_query(statement, con=conn)
    logger.info('Human labeled data loaded from DB')
    return df


def load_timestamps(conn):
    logger.info('Loading timestamps from DB')
    statement = """
        SELECT * FROM sample_timestamps
    """
    df = pd.read_sql_query(statement, con=conn)
    logger.info('Timestamps loaded from DB')
    return df
    

def load_count_vec(conn):
    logger.info('Loading count vectorizer from DB')
    cur = conn.cursor()
    statement = """
        SELECT countvec FROM countvecs ORDER BY countvec_id DESC LIMIT 1
    """
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        logger.info('No count vectorizer available')
        cur.close()
        return None
    else:
        logger.info('Count vectorizer loaded from DB')
        cur.close()
        return data[0]


def update_download_status(conn, clf_id, status):
    logger.info('Updating DL status in DB')
    cur = conn.cursor()
    statement = """
        UPDATE classifiers SET download = %s WHERE clf_id = %s
    """
    cur.execute(statement, (status, clf_id))
    conn.commit()
    logger.info('DL status update in DB')


def persist_download(conn, clf_id, filename):
    logger.info('Saving DL to DB')
    cur = conn.cursor()
    statement = """
        INSERT INTO downloads(clf_id, file) VALUES(%s, %s)
    """
    with open(filename, 'rb') as zip_archive:
        cur.execute(statement, (clf_id, zip_archive.read()))
    logger.info('DL saved to DB')


def save_labeled_data(conn, df, clf_id):
    logger.info('Saving labeled data to DB')
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
    logger.info('Labeled data saved to DB')

