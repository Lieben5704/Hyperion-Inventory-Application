// Middleware to check if a user is an admin
const isAdmin = (req, res, next) => {
    // Check if there is a user object in the request and if the user has the isAdmin property set to true
    if (req.user && req.user.isAdmin) {
        // If the user is an admin, continue to the next middleware/route handler
        next();
    } else {
        // If the user is not an admin, send a 403 (Forbidden) response
        res.status(403).json({ message: 'Access denied' });
    }
};

module.exports = isAdmin;
