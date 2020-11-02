import psycopg2
import keys
import constants
import pandas as pd
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


def load_data(conn):
    print('Loading untaught data', flush=True)
    statement = constants.sql_select_data
    df = pd.read_sql_query(statement, con=conn)
    return df


def load_last_model(conn):
    print('Loading last model', flush=True)
    statement = constants.sql_select_last_model
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]


def insert_uncertainties(data, conn):
    print('Inserting uncertainties', flush=True)
    cur = conn.cursor()
    statement = constants.sql_update_uncertainty
    for index, row in data.iterrows():
        cur.execute(statement, (row[constants.key_uncertainty], row[constants.key_predicted_label], row[constants.key_text_id]))
    conn.commit()


def load_count_vec(conn):
    print('Loading count vec')
    statement = constants.sql_select_last_countvec
    cur = conn.cursor()
    cur.execute(statement)
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]
