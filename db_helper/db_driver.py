import psycopg2
import ijson
import keys


def connect():
    conn = None
    try:
        print('Connecting to Postgres database')
        conn = psycopg2.connect(host=keys.host, dbname=keys.dbname, user=keys.user, password=keys.password)

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


if __name__ == '__main__':
    conn = connect()