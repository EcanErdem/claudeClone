import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    try{
       let token = req.header("Authorization");
        if(!token) return res.status(403).json("Access Denied");

        if(token.startsWith("Bearer ")){
            console.log("Bearer found");
            token = token.slice(7,token.length).trimLeft();
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next();

    }catch(err){
        res.status(500).json({error:err.message});
    }
}