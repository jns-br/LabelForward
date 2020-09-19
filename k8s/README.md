# CovidStateWeb Kubernetes

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


