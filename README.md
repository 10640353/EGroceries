# eco

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

Login to Registry from powershell from local system,
s

