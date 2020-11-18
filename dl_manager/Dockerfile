FROM python:3.8
WORKDIR '/app'
RUN python3 -m pip install psycopg2 pandas redis sklearn pyyaml
COPY . .
CMD ["python3", "-u", "manager.py"]