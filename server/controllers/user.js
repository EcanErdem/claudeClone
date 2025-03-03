import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";

export const register = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = await User.create({
            email,
            password:hashedPassword
        })
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

export const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json("User not found");
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json("Invalid credentials");
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user});

    }catch(err){
        res.status(500).json({err:err.message});
    }
}
