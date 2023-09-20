import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 50px',
        backgroundColor: '#333',
        color: '#fff',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    link: {
        margin: '0 10px',
        textDecoration: 'none',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    linkHover: {
        backgroundColor: '#555',
    }
};

// Define the Navbar component as a functional component
function Navbar() {
    const navigate = useNavigate();

    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        console.log("Logging out..."); // Debugging
        // Navigate to the login page
        navigate('/login');
        }

    // Get the user's role from local storage
    const userRole = localStorage.getItem('userRole');

    return (
        <nav style={styles.nav}>
            <h1 style={styles.title}>Inventory App</h1>
            <div>
                {/* Render Inventory link if the user's role is not 'end-user' */}
                {userRole !== 'end-user' && ( <Link to="/" style={styles.link} onMouseOver={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Inventory</Link>)}

                {/* Render Users link if the user's role is not 'end-user' */}
                {userRole !== 'end-user' && ( <Link to="/users" style={styles.link} onMouseOver={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Users</Link>)}

                {/* Render Logout link */}
                <span onClick={handleLogout} style={styles.link} onMouseOver={e => e.target.style.backgroundColor = styles.linkHover.backgroundColor} onMouseOut={e => e.target.style.backgroundColor = 'transparent'}>Logout</span>
            </div>
        </nav>
    );
}

export default Navbar;
