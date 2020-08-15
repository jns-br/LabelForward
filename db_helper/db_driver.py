import psycopg2
import ijson
import keys


def connect():
    conn = None
    try:
        print('Connecting to Postgres database')
        conn = psycopg2.connect(host=keys.host, dbname=keys.dbname, user=keys.user, password=keys.password, port=keys.port)

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
    statement_news = """
        CREATE TABLE IF NOT EXISTS news(
            news_id SERIAL PRIMARY KEY,
            category VARCHAR(255) NOT NULL,
            headline VARCHAR(500) NOT NULL,
            authors VARCHAR (500) NOT NULL,
            link VARCHAR (500) NOT NULL,
            description VARCHAR (2000) NOT NULL,
            publish_date VARCHAR (50) NOT NULL 
        )
    """

    statement_results = """
        CREATE TABLE IF NOT EXISTS results(
            result_id SERIAL PRIMARY KEY,
            news VARCHAR(2000) NOT NULL,
            label VARCHAR (100) NOT NULL
        )
    """
    try:
        cur = conn.cursor()
        cur.execute(statement_news)
        cur.execute(statement_results)
        cur.close()
        conn.commit()
        print('Created tables!')
    except (Exception, psycopg2.DatabaseError) as error:
        print('error: ', error)


def read_news_json(fn, conn):
    events = ijson.parse(open(fn), multiple_values=True)
    cur = conn.cursor()

    doc_counter = 0
    for prefix, event, value in events:
        if prefix == 'category':
            category = value

        if prefix == 'headline':
            headline = value

        if prefix == 'authors':
            authors = value

        if prefix == 'link':
            link = value

        if prefix == 'short_description':
            description = value

        if prefix == 'date':
            publish_date = value

        if (prefix, event) == ('', 'end_map'):
            try:
                statement = """
                    INSERT INTO news(category, headline, authors, link, description, publish_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cur.execute(statement, (category, headline, authors, link, description, publish_date))
                doc_counter += 1
                if doc_counter % 100 == 0:
                    conn.commit()
                    print('Inserted news docs: ', doc_counter)
            except (Exception, psycopg2.DatabaseError) as error:
                print('error: ', error)

    conn.commit()
    print('Inserted news docs: ', doc_counter)
    cur.close()


if __name__ == '__main__':
    conn = connect()
    create_table(conn)
    read_news_json(keys.file_name, conn)