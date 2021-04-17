const User = require('mongoose').model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const jwtExpirySeconds = 900;
const jwtKey = config.secretKey;

// Create a new error handling controller method
const getErrorMessage = function (err) {
    // Define the error message variable
    var message = '';

    // If an internal MongoDB error occurs get the error message
    if (err.code) {
        switch (err.code) {
            // If a unique index error occurs set the message error
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            // If a general error occurs set the message error
            default:
                message = 'Something went wrong';
        }
    } else {
        // Grab the first error message from a list of possible errors
        for (const errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    // Return the message error
    return message;
};

// Create a new user
exports.create = function (req, res) {
    var user = new User(req.body);

    // save the new instance
    user.save((err) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        } else {
            const token = createToken(user);
            res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });
            return res.status(200).end();
        }
    });
};

// Authenticates and signs in a user
exports.authenticate = function (req, res) {
    // Get credentials from request
    const username = req.body.username;
    const password = req.body.password;

    // find the user with given username using static method findOne
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return res.status(400).json({ message: getErrorMessage(err) });
        } else if (!user) {
            return res.status(400).json({ message: "User not found" });
        } else {
            // compare passwords	
            if (bcrypt.compareSync(password, user.password)) {
                const token = createToken(user);

                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });
                return res.status(200).end();
            } else {

                return res.status(400).json({ message: "Incorrect password" });
            }
        }
    });
};

// Check if a user is currently signed in
exports.isSignedIn = function (req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.end();
    }

    try {
        const payload = jwt.verify(token, jwtKey);

        return res.send({ user: payload });
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }

        return res.status(400).end();
    }
};

// Verifies if user is signed in
exports.requiresLogin = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.end();
    }

    try {
        const payload = jwt.verify(token, jwtKey);

        // refresh cookie
        const newToken = createToken({
            _id: payload.id,
            username: payload.username,
            fullName: payload.fullName,
            role: payload.role
        });
        res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });

        req.userId = payload.id;
        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }

        return res.status(400).end();
    }
};

// Sign current user out
exports.signOut = function (req, res) {    
    res.clearCookie("token");
    return res.status(200).end();
};

// Get a user by ID
exports.userByID = function (req, res, next, id) {
    User.findOne({
        _id: id
    }, (err, user) => {
        if (err) {
            return next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

// Send user as JSON
exports.read = function (req, res) {
    res.send({ user: req.user });
};

// Returns a token with the user's ID, full name, and role in the payload,
// and expires in 900 seconds or 15 minutes
function createToken(user) {
    return jwt.sign({
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
    }, jwtKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds });
}