import psycopg2, keys
import pandas as pd
from collections import Counter
import sys

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
    label_statement = """
        SELECT label FROM labels
    """
    df = pd.read_sql_query(label_statement, con=conn)
    return df['label'].to_numpy()


def is_new_batch_ready(conn):
    print('Checking new batch', flush=True)
    cur = conn.cursor()
    update_counter = 0
    select_all_statement = """
        SELECT text_id, labels, major_label FROM text_data WHERE array_length(labels, 1) >= %(min_label_count)s
    """
    df = pd.read_sql_query(select_all_statement, con=conn, params={"min_label_count": int(keys.min_label_count)})
    update_statement = """
        UPDATE text_data SET major_label = %s WHERE text_id = %s
    """

    for index, row in df.iterrows():
        majority_label = find_max_occurences(row['labels'])
        if majority_label != row['major_label']:
            text_id = int(row['text_id'])
            cur.execute(update_statement, (majority_label, text_id))
            if majority_label != 'ignored':
                update_counter += 1
    conn.commit()
    if update_counter >= int(keys.batch_size):
        return True
    else:
        return False


def read_labeled_data_full(conn):
    print('Reading labeled data full', flush=True)
    if conn is not None:
        statement = """
            SELECT text_id, text_data, major_label FROM text_data WHERE major_label IS NOT NULL AND major_label != %(ignored)s
        """
        df = pd.read_sql_query(statement, con=conn, params={"ignored": "ignored"})
        if len(df.index) == 0:
            return None
        else:
            return df


def read_all_text(conn):
    print('Reading all text data', flush=True)
    statement = """
        SELECT text_data FROM text_data
    """
    df = pd.read_sql_query(statement, con=conn)
    return df.to_numpy()


def save_countvec(data, conn):
    print('Saving count vectorizer', flush=True)
    if conn is not None:
        statement = """
            INSERT INTO countvecs(countvec) VALUES (%s)
        """
        cur = conn.cursor()
        cur.execute(statement, (data,))
        cur.close()
        conn.commit()


def load_last_countvec(conn):
    print('Loading last countvec', flush=True)
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


def save_model(data, conn):
    print('Saving model', flush=True)
    if conn is not None:
        statement = """
            INSERT INTO classifiers(clf, download) VALUES (%s, %s) RETURNING clf_id
        """
        cur = conn.cursor()
        cur.execute(statement, (data, 0))
        conn.commit()
        id = cur.fetchone()[0]
        cur.close()
        return id


def save_score(clf_id, precision_score, conn):
    if conn is not None:
        statement = """
            UPDATE classifiers SET precision_score = %s WHERE clf_id = %s
        """
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
