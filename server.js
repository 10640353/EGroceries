// server.js
const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;
const session = require('express-session');

// Database connection configuration
const dbConfig = {
  user:  process.env.DB_USER, //'${DB_USER}',       // Replace with your database username
  password: process.env.DB_PASSWORD, //'${DB_PASSWORD}',   // Replace with your database password
  server: process.env.DB_HOST, //'${DB_HOST}',         // Replace with your database server
  database: process.env.DB_NAME,
  trustServerCertificate: true,
};

app.use(
  session({
    secret: 'my-test-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.urlencoded({ extended: true }));

// Route handler for the home page
app.get('/', (req, res) => {
  // Establish a connection to the database
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log('Database connection failed:', err);
      return res.status(500).send('Database connection failed');
    }

    // Create a SQL query to retrieve products
    const query = 'SELECT * FROM products';

    // Execute the query to retrieve products
    new sql.Request().query(query, (err, productsResult) => {
      if (err) {
        console.log('Query execution failed:', err);
        sql.close();
        return res.status(500).send('Query execution failed');
      }

      // Create a SQL query to retrieve cart items
      const cartQuery = 'SELECT * FROM cart';

      // Execute the query to retrieve cart items
      new sql.Request().query(cartQuery, (err, cartResult) => {
        if (err) {
          console.log('Query execution failed:', err);
          sql.close();
          return res.status(500).send('Query execution failed');
        }

        const cartItems = cartResult.recordset || [];

        // Render the EJS template with the retrieved products and cart items
        res.render('index', { products: productsResult.recordset, cartItems });

        // Close the database connection
        sql.close();
      });
    });
  });
});

// Route handler for the cart page
app.get('/cart', (req, res) => {
  // Retrieve cart items from the session or database
  const cartItems = []; // Replace this with your logic to retrieve cart items

  // Render the cart.ejs template with the cart items
  res.render('cart', { cartItems });
});

// Route handler for the login page
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

// Route handler for the register page
app.get('/register', (req, res) => {
  res.render('register', { errorMessage: null });
});

// Route handler for adding a product to the cart
app.post('/cart/add', (req, res) => {
  const productId = req.body.productId;
  const userId = req.session.userId; // Replace with your actual user ID retrieval logic

  // Establish a connection to the database
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log('Database connection failed:', err);
      return res.status(500).send('Database connection failed');
    }

    // Create a SQL query to insert the product into the cart table
    const query = `
      INSERT INTO cart (userId, productId)
      VALUES (${userId}, ${productId})
    `;

    // Execute the query
    new sql.Request().query(query, (err) => {
      if (err) {
        console.log('Query execution failed:', err);
        sql.close();
        return res.status(500).send('Query execution failed');
      }

      // Redirect back to the home page after adding to cart
      res.redirect('/');

      // Close the database connection
      sql.close();
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
