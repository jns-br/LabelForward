# al_predictor

A Python microservice for the LabelForward App. Its task is to create and persist prediction probabilites for available datapoints based on classifiers created by the al_learner microservice.

# Workflow

# Workflow

This section describes the basic workflow of this microservice. 

## Initialization

On startup, this microservice initializes a connection to a PostgreSQL server and a Redis server. When both connections where established successfully, the service subsrcibes to a dedicated Redis channel and 
listens for one type of message/event described below.

## Events

The microservice handles one main type of events, update, which is received via the dedicated
Redis channel.

## Events: update

This event is triggered by an update message from the dedicated Redis channel. The message is triggered by the al_learner microservice after a new classifier was trained and persisted to the PostgreSQL database. 

After receiving this message, the service will use the latest classifier in the database to predict all label probabilities for each datapoint. It will then persist the highest label probability for each datapoint in the database. 

# Environment variables

No service specific environment variables need to be set. Standard PostgreSQL and Redis environment variables will be omitted here (see the docker-compose.yaml).

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