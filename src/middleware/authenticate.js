import jwt from "jsonwebtoken";

const authenticate = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode= jwt.verify(token, "AzQ,PI)0(")

        req.user = decode
        next()
    }catch(error){
        res.json({
            message: "Authentication Failed! Login first"
        })
    }
}
const admin = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode= jwt.verify(token, "AzQ,PI)0(")
    
        req.user = decode
        next()
    }catch(error){
        res.json({
            message: "Authentication Failed!"
        })
    }
}
const signout = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1]
        const decode= jwt.verify(token, "AzQ,PI)0(")
        console.log(decode);
        //decoded.exp = Math.floor(Date.now() / 1000) + 3600;
    next();
   }catch(error){
    res.json({
        message: "Authentication Failed!"
    })
  }
};

module.exports = {
    authenticate,
    admin,
    signout };