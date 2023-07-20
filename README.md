# EGroceries: An Express Node.js App Deployment Guide on Azure with MSSQL
## Introduction : 
EGroceries is an online sell and delivery grocery application, it is shifted from in house Infrastructure to the cloud Infrastructure for efficiency and cost saving
Url : https://egroceries.azurewebsites.net/
## Pre-requisites

- Docker installation on your local machine
- Azure CLI installation on your local machine
- Valid Azure account with an active subscription

## Step 1: Building the Docker Image

Switch to the directory where your Dockerfile resides and execute the following command to create the Docker image:

```bash
docker build -t egroceries:v1 .
```

## Step 2: Connecting to Azure and Azure Container Registry (ACR)

Authenticate your access to Azure:

```bash
az login
```

Proceed with the Azure Container Registry (ACR) login:

```bash
az acr login --name egroceriesacr
```

## Step 3: Tagging the Docker Image

Tag the Docker image with your ACR's login server:

```bash
docker tag egroceries:v1 egroceriesacr.azurecr.io/egroceries:v1
```

## Step 4: Pushing the Docker Image to ACR

Push your Docker image to the ACR:

```bash
docker push egroceriesacr.azurecr.io/egroceries:v1
```

## Step 5: Creating a Resource Group and MSSQL Server Container on Azure

Initialize a resource group:

```bash
az group create --name EGroceriesResourceGroup --location eastus
```

Establish an Azure Container Instances (ACI) for the MSSQL Server:

```bash
az container create --name mssqlservercontainer --resource-group EGroceriesRG --image mcr.microsoft.com/mssql/server:2022-latest --ip-address Public --ports 1433 --cpu 2 --memory 4 --environment-variables ACCEPT_EULA=Y SA_PASSWORD=Groceries@123
```

## Step 6: Deploying the Application Container on Azure

Set up a Web App for Containers service on Azure:

```bash
az appservice plan create --name EGroceriesServicePlan --resource-group EGroceriesResourceGroup --sku B1 --is-linux

az webapp create --resource-group EGroceriesResourceGroup --plan EGroceriesServicePlan --name egroceriesapp --deployment-container-image-name egroceriesacr.azurecr.io/egroceries:v1
```

## Step 7: Configuring Advanced Settings 

Navigate to the properties of the web app and in the 'Advanced' tab, include the following JSON configuration:

```json
{
    "name": "DB_HOST",
    "value": "ip_address",
    "slotSetting": false
},
{
    "name": "DB_NAME",
    "value": "egroceries",
    "slotSetting": false
},
{
    "name": "DB_PASSWORD",
    "value": "Groceries@123",
    "slotSetting": false
},
{
    "name": "DB_USER",
    "value": "sa",
    "slotSetting": false
}
```

## Step 8: Configuring Environment Variables

Set the necessary environment variables for the application:

```bash
az webapp config appsettings set --resource-group EGroceriesResourceGroup --name egroceriesapp --settings DB_HOST=ip_address DB_NAME=egroceries DB_PASSWORD=Admin@1234 DB_USER=sa
```

## Step 9: Setting Up The Database

Pull the latest MSSQL Server image from Microsoft Container Registry:

```bash
docker pull mcr.microsoft.com/mssql/server:2022-latest
```


## Step 10: Finalizing the Deployment

Finally, open the Azure portal and locate the web application at https://egroceries.azurewebsites.net/
