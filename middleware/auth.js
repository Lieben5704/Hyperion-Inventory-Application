const jwt = require('jsonwebtoken');

// Middleware to check if a user is authenticated with a valid JWT token
function isAuthenticated(req, res, next) {
    // Get the JWT token from the request's 'x-auth-token' header
    const token = req.header('x-auth-token');

    // If no token is provided, send a 401 (Unauthorized) response
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify the JWT token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Continue to the next middleware/route handler
        next();
    } catch (ex) {
        // If the token is invalid, send a 400 (Bad Request) response
        res.status(400).send('Invalid token.');
    }
}

module.exports = isAuthenticated;
