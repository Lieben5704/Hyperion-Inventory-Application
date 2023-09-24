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

    // Styles for rows with low stock items
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

class Dashboard extends Component {
    constructor() {
        super();
        // Component state to manage data and UI state
        this.state = {
            categories: [],
            items: [],
            showModal: false,
            showEditModal: false,
            editingItem: null,
            searchTerm: '',
            newItem: {
                name: '',
                quantity: '',
                supplierName: '',
                category: ''
            }
        };
    }

     // Lifecycle method to fetch data when component is mounted
    componentDidMount() {
        this.fetchItems();
        this.fetchCategories();
    
        // Fetch user categories
        fetch('${process.env.REACT_APP_API_URL}/categories', {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ categories: data });
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
    }

    // Event handler for the search input
    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value });
    }    

    // Event handler to toggle the item modal
    toggleModal = () => {
        this.setState(prevState => ({ showModal: !prevState.showModal }));
    };

    // Event handler for input field changes in the new item modal
    handleInputChange = (field, value) => {
        this.setState(prevState => ({
            newItem: { ...prevState.newItem, [field]: value }
        }));
    };

    // Event handler for category change in the select input
    handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        // Fetch items for the selected category
        fetch(`${process.env.REACT_APP_API_URL}/items?category=${selectedCategory}`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ items: data });
        })
        .catch(error => {
            console.error("Error fetching items:", error);
        });
    };


    // Function to fetch items based on category
    fetchItems = (category) => {
        let url = '${process.env.REACT_APP_API_URL}/items';
    
        if (category) {
            url += `?category=${category}`;
        }
    
        // Fetch items data
        fetch(url, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ items: data });
        })
        .catch(error => {
            console.error("Error fetching items:", error);
        });
    }


    // Event handler for adding a new item
    addNewItem = () => {
        const { name, quantity, supplierName, category } = this.state.newItem;
    
        const itemData = {
            name,
            quantity,
            supplierName,
            category
        };
    
        // Send a POST request to add a new item
        fetch('${process.env.REACT_APP_API_URL}/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(itemData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Item added successfully:", data);
            this.toggleModal();
            this.fetchItems();
            this.fetchCategories();
            this.setState({
                newItem: {
                    name: '',
                    quantity: '',
                    supplierName: '',
                    category: ''
                }
            });
            this.toggleModal();
            this.fetchItems();
        })
        .catch(error => {
            console.error("Error adding new item:", error);
        });
    };


    // Event handler for clicking on a table row to edit an item
    handleRowClick = (item) => {
        this.setState({ showEditModal: true, editingItem: item });
    };
    
    // Event handler to close the edit item modal
    handleCloseEditModal = () => {
        this.setState({ showEditModal: false, editingItem: null });
    };


    // Event handler for input field changes in the edit item modal
    handleEditInputChange = (field, value) => {
        this.setState(prevState => ({
            editingItem: { ...prevState.editingItem, [field]: value }
        }));
    };

    // Function to fetch categories
    fetchCategories = () => {
        fetch('${process.env.REACT_APP_API_URL}/categories', {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ categories: data });
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
    }

    // Event handler for deleting an item
    handleDelete = () => {
        const itemId = this.state.editingItem._id;
    
        // Send a DELETE request to remove the item
        fetch(`${process.env.REACT_APP_API_URL}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')  // Assuming the token is stored in local storage under the name 'token'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            const newItems = this.state.items.filter(item => item._id !== itemId);
            this.setState({
                items: newItems,
                showEditModal: false,
                editingItem: null
            });
        })
        .catch(error => {
            console.error("Error deleting the item:", error);
        });
    };


     // Event handler for saving edits to an item
    handleSaveEdit = () => {
        const { editingItem } = this.state;

        // Send a PUT request to update the item
        fetch(`${process.env.REACT_APP_API_URL}/items/${editingItem._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify(editingItem)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(updatedItem => {
            // Update the items in the state with the edited item
            const newItems = this.state.items.map(item => 
                item._id === updatedItem._id ? updatedItem : item
            );

            this.setState({
                items: newItems,
                showEditModal: false,
                editingItem: null
            });
        })
        .catch(error => {
            console.error("Error updating the item:", error);
        });
    };

    render() {

        // Filter items based on the search term
        const filteredItems = Array.isArray(this.state.items) 
    ? this.state.items.filter(item => item.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()))
    : [];

    // Get user information from local storage
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

        return (
            <div style={styles.bodyContainer}>
                <div style={{ marginBottom: '20px', fontSize: '18px' }}>
                    Logged in as: <strong>{username}</strong> | Role: <strong>{userRole}</strong>
                </div>
                <div style={styles.flexboxContainer}>
                    {/* Select input for filtering items by category */}
                    <select onChange={this.handleCategoryChange} style={styles.searchBar}>
                        <option value="">All Categories</option>
                        {this.state.categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    {/* Search input for filtering items by name */}
                    <Form.Control 
                        type="text" 
                        placeholder="Search Item Name..."
                        style={styles.searchBar}
                        value={this.state.searchTerm}
                        onChange={this.handleSearchChange}
/>
        {/* Add New Item button, visible to admins */}
        {userRole !== 'end-user' && ( <button style={styles.addButton} onClick={this.toggleModal}>Add New Item</button>)}
                </div>

        {/* Modal for adding a new item */}
                {this.state.showModal && (
                    <Modal show onHide={this.toggleModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Item Name" 
                                    value={this.state.newItem.name}
                                    onChange={e => this.handleInputChange('name', e.target.value)}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Quantity in Stock" 
                                    value={this.state.newItem.quantity}
                                    onChange={e => this.handleInputChange('quantity', e.target.value)}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Supplier Name" 
                                    value={this.state.newItem.supplierName}
                                    onChange={e => this.handleInputChange('supplierName', e.target.value)}
                                />
                            </Form.Group>
                            <br></br>
                            <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Category" 
                                    value={this.state.newItem.category}
                                    onChange={e => this.handleInputChange('category', e.target.value)}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.toggleModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={this.addNewItem}>
                                Add Item
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

            {/* Modal for editing an item */}
                {this.state.showEditModal && this.state.editingItem && (
                    <Modal show onHide={this.handleCloseEditModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {userRole !== 'admin' && (  <p>You do not have permission to edit Items</p>)}
                        {userRole !== 'end-user' && ( <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Item Name" 
                                    value={this.state.editingItem.name}
                                    onChange={e => this.handleEditInputChange('name', e.target.value)}
                                />
                            </Form.Group>)}
                            <br></br>
                            {userRole !== 'end-user' && (<Form.Group>
                                <Form.Control 
                                    type="number" 
                                    placeholder="Quantity in Stock" 
                                    value={this.state.editingItem.quantity}
                                    onChange={e => this.handleEditInputChange('quantity', e.target.value)}
                                />
                            </Form.Group>)}
                            <br></br>
                            {userRole !== 'end-user' && ( <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Supplier Name" 
                                    value={this.state.editingItem.supplierName}
                                    onChange={e => this.handleEditInputChange('supplierName', e.target.value)}
                                />
                            </Form.Group>)}
                            <br></br>
                            {userRole !== 'end-user' && ( <Form.Group>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Category" 
                                    value={this.state.editingItem.category}
                                    onChange={e => this.handleEditInputChange('category', e.target.value)}
                                />
                            </Form.Group>)}
                        </Modal.Body>
                        <Modal.Footer>
                        {userRole !== 'end-user' && ( <Button variant="danger" onClick={this.handleDelete}>
                        Delete
                        </Button>)}
                        <Button variant="secondary" onClick={this.handleCloseEditModal}>
                        Close
                        </Button>
                        {userRole !== 'end-user' && ( <Button variant="primary" onClick={this.handleSaveEdit}>
                        Save Changes
                        </Button>)}
                        </Modal.Footer>
                    </Modal>
                )}

                <table style={styles.table}>
                    <thead style={styles.header}>
                        <tr>
                             {/* Table headers */}
                            <th style={styles.cell}>Item Name</th>
                            <th style={styles.cell}>Quantity</th>
                            <th style={styles.cell}>Supplier</th>
                            <th style={styles.cell}>Category</th>
                            <th style={styles.cell}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Rows for displaying items */}
                        {filteredItems.map(item => (
                            <tr key={item._id} style={item.quantity < 10 ? styles.lowStockRow : {}} onClick={() => this.handleRowClick(item)}>
                                <td style={styles.cell}>{item.name}</td>
                                <td style={styles.cell}>{item.quantity}</td>
                                <td style={styles.cell}>{item.supplierName}</td>
                                <td style={styles.cell}>{item.category}</td>
                                <td style={styles.cell}>{item.quantity < 10 ? 'Low Stock!' : 'In Stock'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Dashboard;
