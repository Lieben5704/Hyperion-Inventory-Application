import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    heading: {
        fontSize: '24px'
    },
    errorMessage: {
        color: 'red',
        fontSize: '14px',
        marginTop: '10px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        width: '500px',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },

    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width:  '50%',
        gap: '10px'
    }

};

function Login() {
    // State to manage form data and error messages
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        errorMessage: ''
    });

    // UseNavigate hook for navigation
    const navigate = useNavigate();

    // Event handler for input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    }

    // Event handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            // Send a POST request to the login endpoint
            const response = await fetch(`https://capstonefinal-968943e242eb.herokuapp.com/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                const data = await response.json();
    
                if (data.token) {
                    // Save the token in local storage
                    localStorage.setItem('token', data.token);  // Save the token

                    // Decode the token to get user role and save it in local storage
                    const decodedToken = jwt_decode(data.token);
                    if (decodedToken && decodedToken.role) {
                        localStorage.setItem('userRole', decodedToken.role);
                    }
                    
                    // Store the username in localStorage during login
                    localStorage.setItem('username', formData.username);
    
                    // Navigate to the home page
                    navigate('/'); 
                } else {
                    // Display an error message for invalid credentials
                    setErrorMessage('Invalid credentials');
                }
            } else {
                const data = await response.json();
                // Display an error message received from the server
                setErrorMessage(data.message || 'Error logging in');
            }
        } catch (error) {
            console.error("Error during login:", error);
            // Display error message
            setErrorMessage('Error logging in');
        }
    }
    
    
     // State to manage error messages
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div style={styles.container}>
        <h2 style={styles.heading}>Account Login</h2>
        <br></br>
        {/* Display error message if present */}
        {errorMessage && <p>{errorMessage}</p>}
        {/* Login form */}
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                defaultValue="admin"
                onChange={handleChange}
                style={styles.input}
            />
            <input
                type="password"
                name="password"
                defaultValue="asd123!"
                placeholder="Password"
                onChange={handleChange}
                style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
            <Link to="/register">Don't have an account? Register</Link>
        </form>
    </div>
    );
}

export default Login;
