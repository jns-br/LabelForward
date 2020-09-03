import psycopg2, keys
import pandas as pd


def connect():
    conn = None
    try:
        print('Connecting to Postgres database')
        conn = psycopg2.connect(
            host=keys.pg_host,
            dbname=keys.pg_dbname,
            user=keys.pg_user,
            password=keys.pg_password,
            port=keys.pg_port)

    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)

    return conn


def read_labeled_data():
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
