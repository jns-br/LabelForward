# al_learner

A Python microservice for the LabelForward App. Its task is to create and persist new classifiers trained with labeled data received through the LabelForward API. 

# Workflow

This section describes the basic workflow of this microservice. 

## Initialization

On startup, this microservice initializes a connection to a PostgreSQL server and a Redis server. When both connections where established successfully, the service subsrcibes to a dedicated Redis channel and 
listens for two types of messages described below.

## Events

The microservice handles two main types of events, init and update, which are received via the dedicated
Redis channel.

## Events: init

This event is triggered by the init message from the dedicated Redis channel. The message is triggered by the db_helper microservice after it is done inserting all necessary data into the PostgreSQL database, as described in the README of the db_helper microservice. After the receiving this message, the mircoservice will check if any init data is available, eg. a small set of prelabeled data. If init data
is available, it will train a classifier based on this dataset. If there is no init data available, the
classifier will be trained with a randomly labeled subset of the dataset to be labeled. After this initial training of a classifier, the microservice publishes an update message on the Redis channel dedicated to the al_predictor microservice.

## Events: update

This event is triggered by the update message from the dedicated Redis channel. The message is triggered by the LabelForward API when a predefined number of datapoints have been labeled by annotators. The number of samples is defined as an environment variable for the LabelForward API (see API documentation).


After receiving this message, the service will first check the number of new samples again, which is defined by an env var (see list of env vars below). If there are enough new samples, the service will update the major label, which is determined by choosing the most frequent label the annotators have assigned to the datapoint. You can configure a minimal label count through an env var to limit these updates to datapoints which have at least this number of labels given by annotators. If all labels have the same frequency, an arbitrary label will be chosen. 

When the major label update is finished, a new classifier is trained on all available data with a major label. This also includes any init data if available. After training a new classifier, the microservice publishes an update message on the Redis channel dedicated to the al_predictor microservice.

# Environment variables

These section covers environment variables for configuration of this microservice. Standard PostgreSQL and Redis environment variables will be omitted.

## BATCH_SIZE

configures the minimum count of new labeled datapoints for updating the major label and training a new classifier

## MIN_LABEL_COUNT

configures the minimum count of labels given by annotators for each datapoint to update the major label and train a new classifier.

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