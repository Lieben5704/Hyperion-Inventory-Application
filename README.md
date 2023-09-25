# MERN Stack Inventory Application

a user-friendly inventory management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Capabilities

### User Authentication & Authorization:
- **Registration**: Users can register with a unique username, email, and password.
- **Login**: Secure login mechanism using JWT tokens stored in the browser's localStorage.
- **User Roles**: Clear differentiation between 'admin' and 'end-user' roles, with privileges based on roles.
- **Protected Routes**: Role-based access control to certain functionalities and routes.

### Dashboard & Inventory Management:
- **Low Stock Highlight**: Instantly recognize items with low stock for efficient inventory management.
- **Admin Privileges**: Edit and add items to the inventory seamlessly.

### Admin Management:
- **User Management**: Add users with specific roles and manage existing users.
- **Role-Based Access**: Grant permissions and access based on user roles.

### User Management:
- **Secure Data Handling**: Hashed passwords ensure user data security.
- **CRUD Operations**: Add, view, and update user data conveniently.

### Backend API:
- **RESTful Design**: Efficient API endpoints for user operations and inventory management.
- **JWT Authorization**: Secure data access using JWT tokens.

### Data Models:
- **User Model**: Store and manage user data including username, email, password, and role.
- **Item Model**: Detailed item representation for effective inventory management.

### Error Handling:
- **User Feedback**: Informative error messages for a better user experience.

### UI/UX:
- **Responsive Design**: A user-friendly interface suitable for various device sizes.
- **Dynamic Styling**: Visual cues like highlighting low stock items for an intuitive experience.

### Redirection & 404 Handling:
- **Smooth Navigation**: Efficient handling of unrecognized routes and user-friendly redirection based on authentication status.

## Security Implementation: 
- **Password Hashing during Registration**: When a new user is being registered, the password provided is hashed using bcrypt before being stored in the database.
- **Password Verification during Login**: During user login, the entered password is compared with the hashed password stored in the database using bcrypt.compare.
- **Authentication**: The application has employed JWT tokens for user authentication, ensuring that only authenticated users can access protected routes and resources and the auth.js middleware checks the presence and validity of JWT tokens in the x-auth-token header of incoming requests.
- **Authorization**: The admin.js middleware ensures that only users with the isAdmin property set to true can access admin-only routes and resources, protecting sensitive operations from unauthorized access.
- **CORS Policy**: A CORS policy is in place to restrict access to the server’s resources to specific origins, preventing Cross-Site Request Forgery (CSRF) and other cross-site attacks.
- **Logging**: Detailed logging of HTTP requests is implemented using the morgan middleware, which aids in monitoring and auditing.


## All used technologies and third-party libraries and modules:

- **Express**: A web framework for Node.js used to build the server and handle HTTP requests and responses.
- **Mongoose**: A library for MongoDB and Node.js that provides a straight-forward, schema-based solution to model application data.
- **jsonwebtoken (JWT)**: A module used to create and verify JSON Web Tokens for user authentication.
- **bcryptjs**: A library used for hashing and verifying passwords, providing cryptographic security for user passwords.
- **cors**: A Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- **dotenv**: A module used to load environment variables from a `.env` file into `process.env`, allowing for secure storage and access to sensitive information such as secrets and API keys.
- **morgan**: HTTP request logger middleware for Node.js, used for logging HTTP requests.
- **React and related libraries**: React is used for building the user interface of the application, along with related libraries and modules like `react-router-dom` for routing.

## Deployment Description: 
- The backend and frontend was deployed together, as it my application isnt extremely large or complex. 
- A single Heroku application is more cost-effective and easier to manage, avoiding the need for separate hosting services or configurations for the front-end and back-end.
- The application is deployed using Heroku and can be accessed from [https://inventoryapphyperiondev-4768857309ab.herokuapp.com/](https://inventoryapphyperiondev-4768857309ab.herokuapp.com/).
- **Inventory Admin Login:** Username: admin, Password: asd123!

## Getting Started

1. **Clone the repository**: https://github.com/Lieben5704/Capstone-Final.git
  
2. **Install Dependencies and run Application**:
Navigate to the project directory and run: npm install then NPM Start
Navigate to the frontend and install: npm install then npm start

3. Open a browser and navigate to `http://localhost:3000`

