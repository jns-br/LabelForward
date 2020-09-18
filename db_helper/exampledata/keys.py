import os

host = os.getenv('PGHOST')
dbname = os.getenv('PGDATABASE')
user = os.getenv('PGUSER')
password = os.getenv('PGPASSWORD')
port = os.getenv('PGPORT')
redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
data_path = os.getenv('DATA_PATH')
label_path = os.getenv('LABEL_PATH')
