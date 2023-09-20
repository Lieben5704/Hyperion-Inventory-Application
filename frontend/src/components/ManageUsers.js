import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const styles = {
    bodyContainer: {
        margin: '0 auto',
        maxWidth: '95%',
        padding: '20px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
    },
    header: {
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold'
    },
    cell: {
        border: '1px solid #e0e0e0',
        padding: '8px 15px',
        textAlign: 'left'
    },
    lowStockRow: {
        backgroundColor: '#ffdede'
    },
    flexboxContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        alignItems: 'center' 
    },
    searchBar: {
        flex: 1,
        marginRight: '20px',
        padding: '10px 15px',
        borderRadius: '5px',
        border: '1px solid #e0e0e0',
        fontSize: '16px'
    },
    addButton: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: '#ffffff',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    addButtonHover: {
        backgroundColor: '#0056b3'
    },
    modalContent: {
        width: '400px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px'
    },
};

class ManageUsers extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            showModal: false,
            showEditModal: false,
            editingUser: null,
            searchTerm: '',
            newUser: {
                username: '',
                email: '',
                password: '',
                role: 'end-user'
            }
        };
    }

    // Lifecycle method: Fetch user data from the server when the component is mounted
    componentDidMount() {
        
        fetch('http://localhost:5000/users', {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                this.setState({ users: data });
            } else {
                console.error('Received non-array response:', data);
                this.setState({ users: [] });
            }
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            this.setState({ users: [] });
        });
    }
    
    // Function to toggle the visibility of the user creation modal
    toggleModal = () => {
        this.setState(prevState => ({ showModal: !prevState.showModal }));
    };

    //Function to handle changes in input fields for creating a new user account
    handleInputChange = (field, value) => {
        this.setState(prevState => ({
            newUser: { ...prevState.newUser, [field]: value }
        }));
    };

    // Function to fetch the list of users
    fetchUsers = () => {
        
        fetch('http://localhost:5000/users', {
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    this.setState({ users: data });
                } else {
                    console.error('Received non-array response:', data);
                }
            })
    }

    // Function to add a new user
    addNewUser = () => {
        const { username, email, password, role } = this.state.newUser;
        
    
        const userData = {
            username,
            email,
            password,
            role
        };

        fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("User added successfully:", data);
            this.fetchUsers();
            this.setState({
                newUser: {
                    username: '',
                    email: '',
                    password: '',
                    role: ''
                }
            });
            this.toggleModal();
        })
        .catch(error => {
            console.error("Error adding new user:", error);
        });
    };

    // Function to handle a click event on a user row, triggering user editing
    handleRowClick = (user) => {
        this.setState({ showEditModal: true, editingUser: user });
    };
    
    // Function to close the user editing modal
    handleCloseEditModal = () => {
        this.setState({ showEditModal: false, editingUser: null });
    };

    // Function to handle changes in the search input
    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    }

    // Function to handle input changes for editing a user
    handleEditInputChange = (field, value) => {
        this.setState(prevState => ({
            editingUser: { ...prevState.editingUser, [field]: value }
        }));
    };

    // Function to handle user deletion
    handleDelete = () => {
        const userId = this.state.editingUser._id;
    
        fetch(`http://localhost:5000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            const newUsers = this.state.users.filter(user => user._id !== userId);
            this.setState({
                users: newUsers,
                showEditModal: false,
                editingUser: null
            });
        })
        .catch(error => {
            console.error("Error deleting the user:", error);
        });
    };
    
    // Function to handle saving edits to a user
    handleSaveEdit = () => {
        const { editingUser } = this.state;
        
        fetch(`http://localhost:5000/users/${editingUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(editingUser)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(updatedUser => {
            const newUsers = this.state.users.map(user => 
                user._id === updatedUser._id ? updatedUser : user
            );
            this.setState({
                users: newUsers,
                showEditModal: false,
                editingUser: null
            });
        })
        .catch(error => {
            console.error("Error updating the user:", error);
        });
    };
    

    render() {

         // Filter users based on the search term
        const displayedUsers = this.state.users.filter(user => 
            user.username.toLowerCase().includes(this.state.searchTerm.toLowerCase())
        );
        
        return (
            <div style={styles.bodyContainer}>
                {/* Render the search bar and "Add New User" button */}
                <div style={styles.flexboxContainer}>
                    <Form.Control 
                        type="text" 
                        placeholder="Search User..."
                        style={styles.searchBar}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
                    />
                    <button style={styles.addButton} onClick={this.toggleModal}>Add New User</button>
                </div>
    
                {/* Render the user creation modal */}
                {this.state.showModal && (
                    <Modal show onHide={this.toggleModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Username" 
                                    value={this.state.newUser.username}
                                    onChange={e => this.handleInputChange('username', e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Control 
                                    type="email" 
                                    placeholder="Email" 
                                    value={this.state.newUser.email}
                                    onChange={e => this.handleInputChange('email', e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Password" 
                                    value={this.state.newUser.password}
                                    onChange={e => this.handleInputChange('password', e.target.value)}
                                />
                            </Form.Group>
                            <br />
                            <Form.Group>
                                <Form.Control as="select" value={this.state.newUser.role} onChange={e => this.handleInputChange('role', e.target.value)}>
                                    <option value="admin">Admin</option>
                                    <option value="end-user">End-User</option>
                                </Form.Control>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.addNewUser}>
                                Add User
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
    
                {/* Render the user editing modal */}
                {this.state.showEditModal && this.state.editingUser && (
                    <Modal show onHide={this.handleCloseEditModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           
                                <React.Fragment>
                                    <Form.Group>
                                        <Form.Control 
                                            type="text" 
                                            placeholder="Username" 
                                            value={this.state.editingUser.username}
                                            onChange={e => this.handleEditInputChange('username', e.target.value)}
                                        />
                                    </Form.Group>
                                    <br />
                                    <Form.Group>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Email" 
                                            value={this.state.editingUser.email}
                                            onChange={e => this.handleEditInputChange('email', e.target.value)}
                                        />
                                    </Form.Group>
                                    <br />
                                    <Form.Group>
                                        <Form.Control as="select" value={this.state.editingUser.role} onChange={e => this.handleEditInputChange('role', e.target.value)}>
                                            <option value="admin">Admin</option>
                                            <option value="end-user">End-User</option>
                                        </Form.Control>
                                    </Form.Group>
                                </React.Fragment>
                            
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={this.handleDelete}>
                                Delete
                            </Button>
                            <Button variant="primary" onClick={this.handleSaveEdit}>
                                Save Changes
                            </Button>
                            <Button variant="secondary" onClick={this.handleCloseEditModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
    
                {/* Render the user table */}
                <table style={styles.table}>
                    <thead style={styles.header}>
                        <tr>
                            <th style={styles.cell}>Username</th>
                            <th style={styles.cell}>Email</th>
                            <th style={styles.cell}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* Map and render the displayed user data */}
                    {displayedUsers.map(user => (
                            <tr key={user._id} onClick={() => this.handleRowClick(user)}>
                                <td style={styles.cell}>{user.username}</td>
                                <td style={styles.cell}>{user.email}</td>
                                <td style={styles.cell}>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    
}

export default ManageUsers;
