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

When the service receives a download request message, it will extract the classifier id the request was based on. 