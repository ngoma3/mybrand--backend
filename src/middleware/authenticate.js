import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    tkn(req,res,"AzQ,PI)0(",next);
}
const admin = (req, res, next) => {
tkn(req,res,"ngoma)(",next);
}

function tkn(req,res,key,next){
    try {
        const token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, key)
            req.user = decode
            next()
    } catch (error) {
        res.json({
            message: "Authentication Failed!"
        })
    }
}

module.exports = {
    authenticate,
    admin
};