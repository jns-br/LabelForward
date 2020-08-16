# CovidStateWeb 

A web application for the CovidState project. It provides an interface for labeling data related to the project, soon to be combined with an active learning framework. It can be build using docker-compose, which will start up a docker environment with
microservices for frontend, backend, database and a database setup.

# Prerequisites

To build this project, only [Docker](https://docs.docker.com/get-docker/) must be installed on your machine.
You also need to make sure that port 3050 is not already in use on your machine.

# Build

To build the project for the first time, open a terminal and navigate to the directory containing the docker-compose.yml. After navigating to the directory, execute the following command:
```shell
docker-compose up --build
```
This will build the microservices for the first time and start them afterwards. Note that there might be problems on the first build and the application might not work correctly. In this case, shutdown the services with Ctrl + C and follow the steps described in usage.

# Usage
The aforementioned build process also starts the microservices. After the first build, the services can be started without building again using the following command:
```shell
docker-compose up
```

You can now access the application at http://localhost:3050

To shutdown the application, enter Ctrl + C in the terminal you started the application with. Alternatively, navigate to the directory containing the docker-compose.yml and execute the following command:
```shell
docker-compose down
```