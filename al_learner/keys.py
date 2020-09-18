import os

pg_host = os.getenv('PGHOST')
pg_dbname = os.getenv('PGDATABASE')
pg_user = os.getenv('PGUSER')
pg_password = os.getenv('PGPASSWORD')
pg_port = os.getenv('PGPORT')
redis_host = os.getenv('REDIS_HOST')
redis_port = os.getenv('REDIS_PORT')
batch_size = os.getenv('BATCH_SIZE')
min_label_count = os.getenv('MIN_LABEL_COUNT')
