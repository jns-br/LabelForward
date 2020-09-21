# CovidStateWeb 

A web application for the CovidState project. It provides an interface for labeling data related to the project, using active learning workers to speed up the labeling process. It can be build and run using docker-compose, which will start up a docker environment with
microservices for frontend, backend, database and a database setup.

# Prerequisites

To build this project, only [Docker](https://docs.docker.com/get-docker/) must be installed on your machine.
You also need to make sure that port 3050 is not already in use on your machine.

# Build

To build the project, open a terminal and navigate to the directory project directory. After navigating to the directory, execute the following command to build the development version:
```shell
docker-compose build 
```
To build the production version, execute the following command:
```shell
docker-compose -f docker-compose-prod.yml build
```

# Usage
To run the project in development mode, execute the following command:
```shell
docker-compose up
```
To run the poject in production mode, execute the following command:
```shell
docker-compose -f docker-compose-prod.yml up
```

You can now access the application at http://localhost:3050

To shutdown the application, enter Ctrl + C in the terminal you started the application with. Alternatively, navigate to the project directory and execute the following command:
```shell
docker-compose down
```

# Combine Build & Run
The build and run process can also be combined.
For development mode:
```shell
docker-compose up --build
```
For production mode:
```shell
docker-compose -f docker-compose-prod.yml up --build
```

# Troubleshooting
Sometimes the project might not update correctly when being rebuilt with changes in the services. Instead of pulling the project again and rebuild it from scratch, try executing the following command in the main directory:
```shell
docker-compose down --volumes && docker-compose up --build
```
