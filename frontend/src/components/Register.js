import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    }
};

// Define the 'Register' functional component
function Register() {
     // Define and initialize the form data and error states
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        errorMessage: ''
    });

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Get the 'navigate' function from 'react-router-dom'
    const navigate = useNavigate();

    // Validation function for the username field
    const validateUsername = (username) => {
        if (!username) {
            setUsernameError("Username is required.");
            return false;
        }
        if (username.length < 4 || username.length > 20) {
            setUsernameError("Username should be between 4 to 20 characters.");
            return false;
        }
        if (/[^a-zA-Z0-9]/.test(username)) {
            setUsernameError("Username should not contain special characters.");
            return false;
        }
        setUsernameError("");
        return true;
    };

     // Validation function for the email field
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email) {
            setEmailError("Email is required.");
            return false;
        }
        if (!emailPattern.test(email)) {
            setEmailError("Invalid email format.");
            return false;
        }
        setEmailError("");
        return true;
    };

    // Validation function for the password field
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError("Password is required.");
            return false;
        }
        if (password.length < 8) {
            setPasswordError("Password should be at least 8 characters.");
            return false;
        }
        setPasswordError("");
        return true;
    };

    // Handle form input changes and perform validation
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));

        if (name === "username") validateUsername(value);
        if (name === "email") validateEmail(value);
        if (name === "password") validatePassword(value);
    }

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validate input before sending request
        const isUsernameValid = validateUsername(formData.username);
        const isEmailValid = validateEmail(formData.email);
        const isPasswordValid = validatePassword(formData.password);
    
        if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
            return; // Exit if validation fails
        }
    
        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            console.log("Server response status:", response.status);
            const data = await response.json();
            console.log("Server response data:", data);
    
            if (response.ok) {
                localStorage.setItem('username', formData.username); // Store the username in localStorage
                navigate('/login');  // Redirect to login page after successful registration
            } else {
                setFormData(prevState => ({ ...prevState, errorMessage: data.message || 'Error registering' }));
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setFormData(prevState => ({ ...prevState, errorMessage: 'Server error. Please try again later.' }));
        }
    }
    
    
    //render the registration form
    return (
        <div style={styles.container}>
        <h2 style={styles.heading}>Register Account</h2>
        {formData.errorMessage && <p style={styles.errorMessage}>{formData.errorMessage}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                style={{...styles.input, ...(usernameError ? styles.inputError : formData.username && styles.inputSuccess)}}
            />
            {usernameError && <p style={styles.errorMessage}>{usernameError}</p>}
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                style={{...styles.input, ...(emailError ? styles.inputError : formData.email && styles.inputSuccess)}}
            />
            {emailError && <p style={styles.errorMessage}>{emailError}</p>}
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                style={{...styles.input, ...(passwordError ? styles.inputError : formData.password && styles.inputSuccess)}}
            />
            {passwordError && <p style={styles.errorMessage}>{passwordError}</p>}
            <button type="submit" style={styles.button}>Register</button>
            <Link to="/login">Already have an account? Login</Link>
        </form>
    </div>
);
}

export default Register;
