# dl_manager

A Python microservice for the Labelforward App. Its task is task is to create downloadable zip-archives containing human labeled data, machine labeled data, the selected classifier as well as the sample timestamps.

# Workflow

This section describes the basic workflow of this microservice. 

## Initialization

On startup, this microservice initializes a connection to a PostgreSQL server and a Redis server. When both connections were established successfully, the service subsrcibes to a dedicated Redis channel and 
listens for two types of messages/events described below.

## Events

This microservice handles only one type of event, a dowload request message from the API via the dedicated Redis channel.

## Events: Download request

When the service receives a download request message, it will extract the classifier id the request was based on from the message. It will then mark the download status as 'requested' in the database. 

The service will then load the requested classifier from  the database and use it to predict labels for all datapoints which have not yet been labeled by annotators. The machine labeled datapoints will then be saved as a JSON file with the pandas DataFrame format.

After predicting unlabeled datapoints the microservice will load all datapoints, which have been labeled by annotators, and also save them as JSON file. It will also do this with all sample timestamps (see API README for more information).

The requested classifier will also be serialized in the pickle format.

When all relevant data has been saved as JSON or pickle, the service will create a zip-archive and persist it as a byte array to the database and mark the download request as available. This will allow the API to provide a downloadable zip-archive to the frontend.

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