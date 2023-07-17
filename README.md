# EGroceries

EGroceries
steps to build an push docker containers to container registry in azure

docker build -t EGroceries:v1 .

create Container registry and login into it

az acr login --name EGroceries

docker tag resbook:v1 EGroceries.azurecr.io/resbook:v1

docker push EGroceries.azurecr.io/resbook:v1

Deploy using Web app of the image publish or up the container

container with ip and port https://egroceries.azurewebsites.net/

Database connection for EGroceries

import the mssql database from azure latest

docker pull mcr.microsoft.com/mssql/server:2022-latest

create container with same registry as EGroceries

declare variables in advance settings of the repo image

{ "name": "DB_HOST", "value": "db_ip", "slotSetting": false }, { "name": "DB_NAME", "value": "mydb", "slotSetting": false }, { "name": "DB_PASSWORD", "value": "Admin@1234", "slotSetting": false }, { "name": "DB_USER", "value": "sa", "slotSetting": false },

and publish and create instance from the image

Create database groceries


use groceries

CREATE TABLE products (
                          id INT PRIMARY KEY,
                          name VARCHAR(255),
                          description VARCHAR(255),
                          price DECIMAL(10, 2),
                          imagePath VARCHAR(255)
)

CREATE TABLE cart (
                      id INT PRIMARY KEY,
                      userId INT, -- Assuming user identification
                      productId INT,
                      quantity INT NOT NULL,
    -- Additional columns as per your requirements
);



INSERT INTO products (id, name, description, price, imagePath)
VALUES
    (1, 'tomato', 'vegetable', 10.99, 'https://i.imgur.com/8qx8119.jpg'),
    (2, 'potato', 'vegetable', 19.99, 'https://i.imgur.com/hF7AXuE.jpg'),
    (3, 'apple', 'Fruit', 14.99, 'https://i.imgur.com/DKqFzvi.jpg');


INSERT INTO cart (id, userId, productId, quantity)
VALUES
    (1, 1, 1, 2),
    (2, 1, 2, 1),
    (3, 2, 1, 3);





Azure Create container Registry

Login to Registry from powershell from local systems

