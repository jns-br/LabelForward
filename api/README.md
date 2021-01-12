# LabelForward API

A Node.js microservice for the LabelForward App. It provides an API for the LabelForward frontend to communicate with other microservices of the LabelForward App.

# Workflow

This section describes the basic workflow of the LabelForward API as well as its interactions with other microservices. 

The main task of the API is to provide the annotators with new text samples to be labeled via the frontend and persist labeled text samples received from the frontend in the database. It also messages the al_learner microservice if a predefined number of samples have been labled to train a new classifier (see the al_learner README for further information).

## Sample selection

The API provides two approaches for text sample selection, active learning with uncertainty sampling and a basic ranking. The type of approach can be configured through an environment variable, described below.

When choosing the active learning approach, the API will select the text sample the latest classifier is most uncertain about, eg. the sample with the overall lowest prediction probability for its most probable label, which has not been labeled by the requesting annotator yet. 

When choosing the the ranking approach, the API will select the text sample the latest classifier is most certain about, eg. the sample with the overall highest prediction probability for its most probable label, which has not been labeled by the requesting annotator yet. This can be very useful if your dataset contains a lot of irrelevant text samples.

## Label aggregation

In the default approach for sample selection and label aggregation provides every annotator with every text sample that was determined to labeled. This can be quite cost intensive, especially on a large dataset and/or few annotators. Therefore the label aggregation can be turned off, so that every text sample will be labeled by one annotator only. This can be configured by an environment variable described below.

## Authentication & Authorization

The LabelForward App features multi-user support, so an authentication and authorization method is required. The API uses a combination of JSON Web Tokens and Http-Only Cookies to offer a secure approach for authorization & authentication.

### Important

For security reasons, it is necessary to set your own secret for JWTs in an environment variable descrbed below.

# Environment variables

This section covers environment variables for configuration of this microservice. Standard PostgreSQL and Redis environment variables will be omitted here (see the docker-compose.yaml).

## JWT_SECRET

defines the secret for the JSON Web Tokens

## BATCH_SIZE

defines the labeled sample batch size which should be used for training a new classifier. If the batch size is reached, the API will send a message to the al_learner microservice via a dedicated Redis channel.

## ACTIVE_LEARNING

If set to true, the API will use the active learning approach with uncertainty sampling for sample selection. If set to false, the ranking approach will be used.

## NO_VOTE

If set to true, each datapoint determinded to be labeled will only be labeled by one annotator. If set to false, each datapoint will be labeled by all annotators and labels will be aggregated.

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