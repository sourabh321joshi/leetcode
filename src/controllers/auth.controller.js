const User = require('../models/user.model');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// const register = async (req, res) => {
//     try {
//         validate(req.body);
//         const { firstName, email, password } = req.body;
//         //  email already exist

//         const emailExist = await User.findOne({email})
//         if(emailExist) throw new Error ("email already exist");

//         const hashedPassword = await bcrypt.hash(password, 10)

//         const user = await User.create({firstName , email , password : hashedPassword});

//         const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: 60 * 60 })
//         res.cookie('token', token, { maxAge: 60 * 60 * 1000 })

//         res.status(201).send("User registered successfully")

//     } catch (error) {
//         res.status(400).send("Error" + error.message);
//     }
// }

const register = async (req , res) => {
    try{
    validate(req.body)

    const {firstName , email , password} = req.body

    const existingUser = await User.findOne({email})

    if(existingUser) {
        return res.status(409).send({message : "Email already exist"});
    }

    const hashedPassword = await bcrypt.hash(password , 10);
    req.body.role = 'user'

    const user = await User.create({
        firstName,
        email,
        password : hashedPassword 
    })

    const token = jwt.sign( {_id : user._id , role:user.role} , process.env.JWT_KEY, { expiresIn: "1h" })
    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000
    });

    return res.status(201).send({message: "User registered successfully",
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

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email) throw new Error("Invalid credentials");
//         if (!password) throw new Error("Invalid credentials");

//         const user = await User.findOne({ email });
//         if (!user) throw new Error("Invalid credentials");

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) throw new Error("Invalid credentials");

//         const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: 60 * 60 });
//         res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

//         res.status(200).send("logged in successfully");

//     } catch (error) {
//         res.status(401).send("Error : " + error.message);
//     }
// };


const login = async (req,res) => {
    try{
        const {email , password} = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id , role:user.role },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).send({
            message: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        });


    }catch(error){
        return res.status(500).send({
            message : error.message || "Server error"
        })
    }
}

// logout

const logout = async (req,res) => {
    try{
        
    }catch(error){

    }
}

module.exports = {register , login ,logout}