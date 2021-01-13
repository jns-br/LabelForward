# db_helper

A Python microservice for the LabelForward App. Its task is to set up the PostgreSQL database with data relevant to the App. This includes text samples, labels, prelabeled data and accessors.

# Workflow

This section describes the basic workflow of this microservice.

## Initialization

On startup, the service intializes a connection to the PostgreSQL server and the Redis server. When both connections were established successfully, the service starts the setup of the database for the LabelForward App.

## Prelabeled data

The service will check if any prelabeled data for inital classifier training is available. This data must be provided as a pandas Dataframe formatted to JSON. The file needs to contain two columns named 'data' and 'label' with the respective data contained in the rows (see exampledata files). The path to the JSON file must be defined as an environment variable, described below. If initial data is provided, the service will insert it into the respective table.

## Text data

The service will try to insert the text data to be labeled into its respective table. This data must be provided as a pandas Dataframe formatted to JSON. The file needs to contain one column named 'data' with the text data contained in the rows (see exampledata files). The path to the JSON file must be defined as an environment variable, described below. If no text data is provided, the service will exit with an error.

## Labels

The service will try to insert the available labels into its respective table. This data must be provided as a pandas Dataframe formatted to JSON. The file needs to contain one column named 'labels' with the available lables contained in the rows (see exampledata files). The path to the JSON file must be defined as an environment variable, described below. If no labels are provided, the service will exit with an error.

## Accessors

The service will try to insert accessor data, eg. email addresses of annotators, into its respective table. This data must be provided as a pandas Dataframe formatted to JSON. The file needs to contain one column named 'accessor' with the available lables contained in the rows (see exampledata files). The path to the JSON file must be defined as an environment variable, described below. If no labels are provided, the service will exit with an error.

## Message

If all necessary data insertions have been successful, the service will send an init message to the al_learner microservice to train an initial classifier. More details on this in the al_learner README.

# Environment variables

This section covers environment variables for configuration of this microservice. Standard PostgreSQL and Redis environment variables will be omitted here (see the docker-compose.yaml).

## DATA_PATH

defines the path to the JSON file containing the text data to be labeled.

## LABEL_PATH

defines the path to the JSON file containing the available labels.

## ACCESSOR_PATH

defines the path to the JSON file containig the accessor data, eg. email addresses of annotators.

## INIT_DATA_PATH

defindes the path to the JSON file conataining prelabeled data.

# Prerequesits

This is a mircoservice for the LabelForward App and needs to be run in that context, eg. with docker-compose or as a Kubernetes deployment. It can be run standalone using the Dockerfile in the microservice's root folder, 
but needs to be connected to a PostgreSQL server and a Redis server, which can be configured through environment variables (see the docker-compose.yaml for a list of env vars for this microservice). While this is possible,
it is highly recommended to run this microservice in the LabelForward App context.

# Build

To build the production version of the microservice, execute the following command in the microservice root directory:
```shell
docker build .
```

To build the development version of the microservice, execute the following command in the mircoservice root directory:
```shell
docker build -f Dockerfile.dev .
```
This will return an image id, which is needed for running the microservice.

# Run

To run the version you built in the previous step, execute the following command with the image id you received:
```shell
docker run <imgid>
```