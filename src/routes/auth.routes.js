const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const authRouter = express.Router();

// Register a new user
// login
// logout
// getprofile

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
// authRouter.get('/getProfile', getProfile);


module.exports = {
    authRouter
}