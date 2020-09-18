import os

host = os.getenv('PGHOST')
dbname = os.getenv('PGDATABASE')
user = os.getenv('PGUSER')
password = os.getenv('PGPASSWORD')
port = os.getenv('PGPORT')
redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
