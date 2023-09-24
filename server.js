// Import necessary libraries and modules
const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); 

// Import custom middleware and routes
const isAuthenticated = require('./middleware/auth');
const isAdmin = require('./middleware/admin');
const itemController = require('./controllers/itemController');
const userController = require('./controllers/userController');

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});


// Cors allows the server to specify which origins are permitted to access resources on this server.
const corsOptions = {
    origin: 'https://capstonefinal-968943e242eb.herokuapp.com/',  // The origin URL where requests can come from
    optionsSuccessStatus: 200        // The status code to send when a preflight request (an initial, exploratory request sent by the browser) is successful. 
};

// Middleware for detailed logging of HTTP requests in the 'combined' pre-defined format
app.use(morgan('combined'));

// Apply the CORS middleware with the specified options to allow requests from the configured origin
app.use(cors(corsOptions));


//Item Related Routes
app.post('/items', isAuthenticated, isAdmin, itemController.createItem);
app.get('/items', isAuthenticated, itemController.getAllItems);
app.get('/categories', isAuthenticated, itemController.getCategories);
app.put('/items/:id', isAuthenticated, isAdmin, itemController.updateItem);
app.delete('/items/:id', isAuthenticated, isAdmin, itemController.deleteItem);


//User Related Routes
app.post('/users/register', userController.registerUser);
app.post('/users/login', userController.loginUser);
app.get('/users/is-admin', isAdmin, userController.isAdmin);
app.get('/users', isAuthenticated, isAdmin, userController.getAllUsers);
app.get('/users/:id', isAuthenticated, isAdmin, userController.getUserById);
app.post('/users', isAuthenticated, isAdmin, userController.createUser);
app.put('/users/:id', isAuthenticated, isAdmin, userController.updateUser);
app.delete('/users/:id', isAuthenticated,isAdmin, userController.deleteUser);


app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging
    res.status(500).send({ message: err.message }); // Send the error message as a property in a JSON response
});

// Catch 404 and forward to the error handler
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

require('dotenv').config();

// Establish a connection to the MongoDB database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

  module.exports = app;