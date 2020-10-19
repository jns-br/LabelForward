import psycopg2, keys
import pandas as pd
from collections import Counter
import sys
import constants


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
        sys.exit(1)

    return conn


def load_labels(conn):
    print('Loading labels', flush=True)
    label_statement = constants.sql_select_labels
    df = pd.read_sql_query(label_statement, con=conn)
    return df['label'].to_numpy()


def is_new_batch_ready(conn):
    print('Checking new batch', flush=True)
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
            if majority_label != constants.key_ignored:
                update_counter += 1
    conn.commit()
    if update_counter >= int(keys.batch_size):
        return True
    else:
        return False


def read_labeled_data_not_ignored(conn):
    print('Reading labeled data full without ignored', flush=True)
    if conn is not None:
        statement = constants.sql_select_not_ignored
        df = pd.read_sql_query(statement, con=conn, params={constants.key_ignored: constants.key_ignored})
        if len(df.index) == 0:
            return None
        else:
            return df


def read_labeled_data_full(conn):
    print('Reading labeld data full', flush=True)
    if conn is not None:
        statement = constants.sql_select_major_label_not_null
        df = pd.read_sql_query(statement, con=conn)
        if len(df.index) == 0:
            return None
        else:
            return df


def read_all_text(conn):
    print('Reading all text data', flush=True)
    statement = constants.sql_all_text
    df = pd.read_sql_query(statement, con=conn)
    return df.to_numpy()


def read_init_data(conn):
    print('Reading init data', flush=True)
    if conn is not None:
        statement = constants.sql_select_init_data
        df = pd.read_sql_query(statement, con=conn)
        if len(df.index) == 0:
            return None
        else:
            return df


def save_countvec(data, conn):
    print('Saving count vectorizer', flush=True)
    if conn is not None:
        statement = constants.sql_insert_countvec
        cur = conn.cursor()
        cur.execute(statement, (data,))
        cur.close()
        conn.commit()


def load_last_countvec(conn):
    print('Loading last countvec', flush=True)
    if conn is not None:
        statement = constants.sql_select_countvec
        cur = conn.cursor()
        cur.execute(statement)
        data = cur.fetchone()
        if data is None:
            cur.close()
            return None
        else:
            cur.close()
            return data[0]


def save_model(data, conn):
    print('Saving model', flush=True)
    if conn is not None:
        statement = constants.sql_insert_clf
        cur = conn.cursor()
        cur.execute(statement, (data, 0))
        conn.commit()
        id = cur.fetchone()[0]
        cur.close()
        return id


def save_ignore_model(data, conn):
    print('Saving ignore model', flush=True)
    if conn is not None:
        statement = constants.sql_insert_ignore_clf
        cur = conn.cursor()
        cur.execute(statement, (data, 0))
        conn.commit()
        id = cur.fetchone()[0]
        cur.close()
        return id


def save_score(clf_id, precision_score, conn):
    if conn is not None:
        statement = constants.sql_insert_precision_score
        cur = conn.cursor()
        cur.execute(statement, (precision_score, clf_id))
        conn.commit()
        cur.close()


def save_score_ignore(clf_id, precision_score, conn):
    if conn is not None:
        statement = constants.sql_update_precision_score_ignore
        cur = conn.cursor()
        cur.execute(statement, (precision_score, clf_id))
        conn.commit()
        cur.close()


def find_max_occurences(arr):
    if len(arr) > 0:
        most_common = Counter(arr).most_common(1)[0][0]
        return most_common
    else:
        return None
