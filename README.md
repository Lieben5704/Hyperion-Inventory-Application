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

## Getting Started

1. **Clone the repository**: https://github.com/Lieben5704/Capstone-Final.git
  
2. **Install Dependencies and run Application**:
Navigate to the project directory and run: npm install then NPM Start
Navigate to the frontend and install: npm install then npm start

3. Open a browser and navigate to `http://localhost:3000`

