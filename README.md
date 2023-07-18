# EGroceries: An Express Node.js App Deployment Guide on Azure with MSSQL
## Introduction : 
EGroceries is an online sell and delivery grocery application, it is shifted from in house Infrastructure to the cloud Infrastructure for efficiency and cost saving

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
az container create --name mssqlservercontainer --resource-group EGroceriesResourceGroup --image mcr.microsoft.com/mssql/server:2022-latest --ip-address Public --ports 1433 --cpu 2 --memory 4 --environment-variables ACCEPT_EULA=Y SA_PASSWORD=Admin@1234
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
    "value": "Admin@1234",
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

## Step 10: Creating a Database Container

Create a container with the same registry as EGroceries:

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Admin@1234" -p 1433:1433 --name mssqlserver -d mcr.microsoft.com/mssql/server:2022-latest
```

## Step 11: Declaring Environment Variables

Declare the environment variables in the advanced settings of the repository image:

```json
{
    "name": "DB_HOST",
    "value": "db_ip",
    "slotSetting": false
}, 
{
    "name": "DB_NAME",
    "value": "egroceries",
    "slotSetting": false
}, 
{
    "name": "DB_PASSWORD",
    "value": "Admin@1234",
    "slotSetting": false
}, 
{
    "name": "DB_USER",
    "value": "sa",
    "slotSetting": false
}
```

## Step 12: Publishing and Creating an Instance From the Image

Publish the image and create an instance from it on Azure. 

## Step 13: Creating Database Schema

Create your `egroceries` database and define your `products` and `cart` tables:

```sql
CREATE DATABASE egroceries;

USE egroceries;

CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10, 2),
    imagePath VARCHAR(255)
);

CREATE TABLE cart (
    id INT PRIMARY KEY,
    userId INT,
    productId INT,
    quantity INT NOT NULL
);
```

## Step 14: Inserting Data Into the Tables

Insert data into the `products` and `cart` tables:

```sql
INSERT INTO products (id, name, description, price, imagePath)
VALUES
    (1, 'tomato', 'vegetable', 10.99, 'https://i.imgur.com/8qx8119.jpg'),
    (2, 'potato', 'vegetable', 19.99, 'https://i.imgur.com/hF7AXuE.jpg'),
    (3, 'apple', 'fruit', 14.99, 'https://i.imgur.com/DKqFzvi.jpg');

INSERT INTO cart (id, userId, productId, quantity)
VALUES
    (1, 1, 1, 2),
    (2, 1, 2, 1),
    (3, 2, 1, 3);
```

## Step 15: Finalizing the Deployment

Finally, open the Azure portal and locate the web application at https://egroceries.azurewebsites.net/
