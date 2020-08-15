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


def create_table(conn):
    statement = """
        CREATE TABLE IF NOT EXISTS news(
            news_id SERIAL PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            headline VARCHAR(500) NOT NULL,
            authors VARCHAR (100) NOT NULL,
            link VARCHAR (500) NOT NULL,
            description VARCHAR (1000) NOT NULL,
            publish_date VARCHAR (50) NOT NULL 
        )
    """

    try:
        cur = conn.cursor()
        cur.execute(statement)
        cur.close()
        conn.commit()
        print('News table created!')
    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)


if __name__ == '__main__':
    conn = connect()
    create_table(conn)