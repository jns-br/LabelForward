FROM python:3.8
WORKDIR '/app'
RUN python3 -m pip install pandas psycopg2 redis sklearn
COPY . .
CMD [ "python3", "-u", "learner.py" ]