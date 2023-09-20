import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly }) {
    // Check if the user is authenticated by retrieving a token from local storage
    const isAuthenticated = localStorage.getItem('token');
    // Get the user's role from local storage
    const userRole = localStorage.getItem('userRole');

    // If the user is authenticated
    if (isAuthenticated) {
        // Check if the 'adminOnly' prop is provided and user role is 'admin'
        if (!adminOnly || (adminOnly && userRole === 'admin')) {
            return children;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    // If the user is not authenticated, navigate to the login page ('/login') and replace the current entry in the history
    return <Navigate to="/login" replace />;
}

export default ProtectedRoute;
