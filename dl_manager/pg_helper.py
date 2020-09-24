import keys
import psycopg2

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


def load_model_by_id(conn, clf_id):
    cur = conn.cursor()
    statement = """
        SELECT clf FROM classifiers WHERE clf_id = %s
    """
    cur.execute(statement, (clf_id, ))
    data = cur.fetchone()
    if data is None:
        cur.close()
        return None
    else:
        cur.close()
        return data[0]