# LabelForward Kubernetes

In this directory you will find the configuration files needed for a deployment on a kubernetes cluster. 

# Prerequisites

To be able to apply these files, you need a kubernetes cluster with the kubectl cli running on your machine. If you have Docker Desktop installed, you can activate a local cluster in the Docker Desktop settings. 

# Setup

The CovidState App uses two secrets as environment variables. Although the project uses a declarative approach, these secrets must be configured imperatively.

## Postgres Password

To set the postgres password as a secret, execute the following command in a terminal:
```shell
  kubectl create secret generic pgpassword --from-literal PGPASSWORD=<your_password>
```
The password can be any string.

## JSON Web Token secret

To set the JWT secret as a secret, execute the following command in a terminal:
```shell
  kubectl create secret generic jwtsecret --from-literal JWT_SECRET=<your_secret>
```

# Usage
After setting up the secrets, you can start the whole application by executing the following command in the project directory:
```shell
  kubectl apply -f k8s/
```

# Adjust settings
The aforementioned steps will create the example project and will contain the example data and example configuration of environment variables. To adjust it to your data and configuration, you need to adjust the deployment and job configuration files. See the comments in the files.

You will also need to build and push your own adjusted docker images to [Docker Hub](https://hub.docker.com/). You can do this by applying the following steps to eacht subproject.

## 1. Build the subproject
In the subproject directory, execute the following command to build the development version:
```shell
  docker build -t <dockerhub-username>/<tag-name> .
```

To build the prodution version, execute the following command:
```shell
  docker build -f docker-compose-prod.yaml -t <dockerhub-username>/<tag-name>
```

## 2. Push the subproject to Docker Hub
In the subproject directory, execute the following command to push the image you just built to Docker Hub:
```shell
  docker push <dockerhub-username>/<tag-name>:latest
```
