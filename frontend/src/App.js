import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ManageUsers from './components/ManageUsers';

// Main App component
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

// Nested component to manage content based on the route
function AppContent() {
    // Get the current location
    const location = useLocation();

    return (
        <>
            {/* Render the Navbar component for all routes except '/login' and '/register' */}
            {location.pathname !== "/login" && location.pathname !== "/register" && <Navbar />}
            
            <Routes>
                {/* Route for the main dashboard, protected by authentication */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Route for the login page */}
                <Route path="/login" element={<Login />} />

                {/* Route for managing users, protected and accessible to admins only */}
                <Route path="/users" element={
                    <ProtectedRoute adminOnly={true}>
                        <ManageUsers />
                    </ProtectedRoute>
                } />

                {/* Route for user registration */}
                <Route path="/register" element={<Register />} />

                {/* Catch-all route to redirect to the main dashboard when a route doesn't match */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
