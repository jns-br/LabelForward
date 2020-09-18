FROM python:latest
WORKDIR '/app'
RUN python3 -m pip install psycopg2 pandas redis
COPY . .
CMD ["python3", "db_driver.py"]