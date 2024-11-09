const errorHandler = (err, req, res, next) => {
    console.error('Global error:', err);

    // Handle specific error types
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
};

module.exports = errorHandler;
