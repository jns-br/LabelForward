# LabelForward 

A web application derived from the CovidState project. It provides an interface for labeling text data, using active learning workers to speed up the labeling process. It can be build and run using docker-compose, which will start up a docker environment with
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

# Add your own data
The aforementioned process builds the project with example data, a news headline dataset with with labels [link](https://www.kaggle.com/rmisra/news-category-dataset). To use it with your own data, you need to make a few adjustments.

## 1. Prepare your data
The data and the labels must be provided as a CSV file. Each file must only contain a single column, the data file one column with one text data point in each row, the label file one column with one label in each row. You also need to define a list of accessors (eg. email addresses of annotators) in the same format. See the db_helper/exampledata for examples.
Note that you need to locate your data, samples and accessors somewhere within the db_helper folder.

## 2. Adjust the docker-compose files
In the docker-compose files, you need to adjust the paths DATA_PATH, LABEL_PATH AND ACCESSOR_PATH to your CSV file paths. 