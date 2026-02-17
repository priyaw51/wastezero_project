const errorHandler = (err, req, res, next) => {
    // Log the error for debugging (remove in production or use a logger)
    console.error(err.stack);

    // If headers are already sent, delegate to the default Express error handler
    if (res.headersSent) {
        return next(err);
    }

    // Default status code: 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;

    // Default error message
    let message = err.message || 'Server Error';

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        message = messages.join(', ');
        // Set bad request status for validation errors
        // err.statusCode = 400; // Not strictly needed as we handle it below
        return res.status(400).json({
            success: false,
            message: message
        });
    }

    // Joi Validation Error (if not using separate middleware that handles it first)
    // Joi usually throws errors with details array
    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            message: err.details[0].message
        });
    }

    // Duplicate Key Error (Unique Constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered: ${field}`;
        return res.status(400).json({
            success: false,
            message: message
        });
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again.';
        return res.status(401).json({
            success: false,
            message: message
        });
    }

    // Token Expired Error
    if (err.name === 'TokenExpiredError') {
        message = 'Token expired. Please log in again.';
        return res.status(401).json({
            success: false,
            message: message
        });
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
