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
        let tkn = req.headers.authorization.split(" ")[1]
        let decoded= jwt.verify(tkn, "ngoma)(")
        req.user = decoded
        next()
    }catch(err){
        res.send({
            message: "Authentication Failed!"
        })
    }
}


module.exports = {
    authenticate,
    admin
     };