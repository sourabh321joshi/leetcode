const  jwt  = require("jsonwebtoken");
const User = require("../models/user.model");

const userMiddleware = async (req, res, next) => {

    try {
        const { token } = req.cookies;
        if (!token) throw new Error("Invalid token")

        const payload = jwt.verify(token, process.env.JWT_KEY)

        const { _id} = payload;

        if(_id) {
            throw new Error("Invalid token")
        }

        const result = await User.findById(_id);

        if(!result){
            throw new Error("User not found")
        }

        // Redis blocklist 

        

    } catch (error) {
        console.log(error)
    }
}