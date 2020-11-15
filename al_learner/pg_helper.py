import psycopg2, keys
import pandas as pd
from collections import Counter
import sys
import constants
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


def load_labels(conn):
    logger.info('Loading labels from DB')
    print('Loading labels', flush=True)
    label_statement = constants.sql_select_labels
    df = pd.read_sql_query(label_statement, con=conn)
    logger.info('Labels loaded from DB')
    return df['label'].to_numpy()


def is_new_batch_ready(conn):
    logger.info('Checking batch size')
    cur = conn.cursor()
    update_counter = 0
    select_all_statement = constants.sql_select_all_min_label_count
    df = pd.read_sql_query(select_all_statement, con=conn, params={constants.key_min_label_count: int(keys.min_label_count)})
    update_statement = constants.sql_update_major_label

    for index, row in df.iterrows():
        majority_label = find_max_occurences(row[constants.key_labels])
        if majority_label != row[constants.key_major_label]:
            text_id = int(row[constants.key_text_id])
            cur.execute(update_statement, (majority_label, text_id))
            update_counter += 1
    conn.commit()
    if update_counter >= int(keys.batch_size):
        logger.info('New batch is ready')
        return True
    else:
        logger.info('New datapoints below batch size')
        return False


def read_labeled_data_full(conn):
    logger.info('Loading all labeled data from DB')
    if conn is not None:
        statement = constants.sql_select_major_label_not_null
        df = pd.read_sql_query(statement, con=conn)
        if len(df.index) == 0:
            logger.info('No labeled data available')
            return None
        else:
            logger.info('All labeled data loaded from DB')
            return df


def read_all_text(conn):
    logger.info('Loading all text data from DB')
    statement = constants.sql_all_text
    df = pd.read_sql_query(statement, con=conn)
    logger.info('All text data loaded from DB')
    return df.to_numpy()


def read_init_data(conn):
    logger.info('Loading init data from DB')
    if conn is not None:
        statement = constants.sql_select_init_data
        df = pd.read_sql_query(statement, con=conn)
        if len(df.index) == 0:
            logger.info('No init data available')
            return None
        else:
            logger.info('Init data loaded from DB')
            return df


def save_countvec(data, conn):
    logger.info('Saving count vectorizer to DB')
    if conn is not None:
        statement = constants.sql_insert_countvec
        cur = conn.cursor()
        cur.execute(statement, (data,))
        cur.close()
        conn.commit()
        logger.info('Count vectorizer saved to DB')


def load_last_countvec(conn):
    logger.info('Loading count vectorizer')
    if conn is not None:
        statement = constants.sql_select_countvec
        cur = conn.cursor()
        cur.execute(statement)
        data = cur.fetchone()
        if data is None:
            cur.close()
            logger.info('No count vectorizer available')
            return None
        else:
            cur.close()
            logger.info('Count vectorizer loaded from DB')
            return data[0]


def save_model(data, conn):
    logger.info('Saving model to DB')
    if conn is not None:
        statement = constants.sql_insert_clf
        cur = conn.cursor()
        cur.execute(statement, (data, 0))
        conn.commit()
        id = cur.fetchone()[0]
        cur.close()
        logger.info('Model saved to DB')
        return id


def save_score(clf_id, precision_score, conn):
    logger.info('Saving precision score to DB')
    if conn is not None:
        statement = constants.sql_insert_precision_score
        cur = conn.cursor()
        cur.execute(statement, (precision_score, clf_id))
        conn.commit()
        cur.close()
        logger.info('Precision score saved to DB')


def find_max_occurences(arr):
    if len(arr) > 0:
        most_common = Counter(arr).most_common(1)[0][0]
        return most_common
    else:
        return None
