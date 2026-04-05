const User = require('../models/user.model');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        validate(req.body)
        const { firstName, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).send({ message: "Email already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.role = 'admin'

        const user = await User.create({
            firstName,
            email,
            password: hashedPassword,
            role: req.body.role
        })

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_KEY, { expiresIn: "1h" })
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });

        return res.status(201).send({
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(400).send({
            message: error.message || "Something went wrong"
        });
    }
}

module.exports = {
    register
}