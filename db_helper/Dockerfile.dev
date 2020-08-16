FROM python:latest
WORKDIR '/app'
RUN python3 -m pip install psycopg2 ijson
COPY . .
CMD ["python3", "db_driver.py"]