const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");
const User = require("../models/user.model");

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Invalid token")

        const payload = jwt.verify(token, process.env.JWT_KEY)

        const { _id } = payload;

        if (!_id) {
            throw new Error("Invalid token")
        }

        const result = await User.findById(_id);

        if (payload.role != "admin") {
            throw new Error("User is not admin")
        }


        // if (result.role !== "admin") {
        //     throw new Error("User is not admin")
        // }


        if (!result) {
            throw new Error("User not found")
        }


        // Redis blocklist 
        const isBlocked = await redisClient.exists(`token:${token}`);


        if (isBlocked) {
            throw new Error("Token is blocked")
        }


        req.result = result;
        next();

    } catch (error) {
        return res.status(401).send({ message: error.message });
    }
}

module.exports = {
    adminMiddleware
}