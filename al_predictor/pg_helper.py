import psycopg2
import keys
import constants
import pandas as pd
import sys
import logging

logger = logging.getLogger('logger')

def connect():
    logger.info('Initializing Postgres connection')
    conn = None
    try:
        conn = psycopg2.connect(
            host=keys.pg_host,
            dbname=keys.pg_dbname,
            user=keys.pg_user,
            password=keys.pg_password,
            port=keys.pg_port)

    except (Exception, psycopg2.DatabaseError):
        logger.exception('Postgres connection failed')
        sys.exit(1)
    logger.info('Postgres connection initialized')
    return conn


def load_data(conn):
    logger.info('Loading text data from DB')
    statement = constants.sql_select_data
    df = pd.read_sql_query(statement, con=conn)
    logger.info('Text data loaded from DB')
    return df


def load_last_model(conn):
    logger.info('Loading most recent model from DB')
    statement = constants.sql_select_last_model
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        logger.error('No model available')
        cur.close()
        return None
    else:
        logger.info('Most recent model loaded from DB')
        cur.close()
        return data[0]


def insert_uncertainties(data, conn):
    logger.info('Saving propabilities to DB')
    cur = conn.cursor()
    statement = constants.sql_update_uncertainty
    for index, row in data.iterrows():
        cur.execute(statement, (row[constants.key_uncertainty], row[constants.key_predicted_label], row[constants.key_text_id]))
    conn.commit()
    logger.info('Propabilities saved to DB')

def load_count_vec(conn):
    logger.info('Loading count vectorizer from DB')
    statement = constants.sql_select_last_countvec
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        logger.error('No count vectorizer available')
        cur.close()
        return None
    else:
        logger.info('Count vectorizer loaded from DB')
        cur.close()
        return data[0]
