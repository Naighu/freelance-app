
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const protectAdmin = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log(token);
            console.log( process.env.ADMIN_TOKEN);

            
            if (token === process.env.ADMIN_TOKEN) {
                return next();
            }
            else {
                return res.status(401).json({ message: 'Not authorized, You are not admin' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    return res.status(401).json({ message: 'Not authorized, You are not admin' });
}

module.exports = { protect,protectAdmin };
