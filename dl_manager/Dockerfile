FROM python:latest
WORKDIR '/app'
RUN python3 -m pip install psycopg2 pandas redis sklearn 
COPY . .
CMD ["python3", "-u", "manager.py"]