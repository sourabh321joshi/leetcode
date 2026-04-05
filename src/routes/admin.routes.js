const express = require('express');
const { register } = require('../controllers/admin.controller');
const adminRouter = express.Router();

adminRouter.post('/register' ,register )

module.exports = {
    adminRouter
}