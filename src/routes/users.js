import express from "express";
import User from "../model/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticate from "../middleware/authenticate";
const UserRouter = express.Router();
// Configuration

UserRouter.post("/signup", async (req, res) => {
    let username = req.body.username;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    User.findOne({
            $or: [{
                username: username
            }]
        })
        .then(async(user) => {
            if (user) {
                res.json({
                    message: 'User already exist'
                })
            } else{
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPass
            });
            try {
                let newUser= await user.save();
                let token = jwt.sign({
                    _id: newUser._id,
                    username: user.username
                }, "AzQ,PI)0(", {
                    expiresIn: '1h'
                });
                res.json({
                    message: 'SignUp successfuly',
                    id: newUser._id,
                    token
                })
            
            } catch (err) {
                console.log(err);
            }
        }
    });  
 
});

UserRouter.get("/", authenticate.admin, async (req, res) => {
    try {
        let users;
        users = await User.find()
        res.send(users)
    } catch {
        res.status(404)
        res.send({
            error: "Not found"
        })
    }

});

//delete a message
UserRouter.delete("/account/:id", authenticate.admin||authenticate.authenticate, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        await user.remove();
        res.status(200).send()
    } catch {
        res.status(404)
        res.send({
            error: "Postman not found"
        })
    }
})
UserRouter.put("/profile/:id", authenticate.authenticate, async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findById(userId);
        let username = req.body.username || user.username;
        let email = req.body.email || user.email;
        let password = req.body.password || user.password;
        user = await User.findOneAndUpdate({
            _id: userId
        }, {
            $set: {
                username: username,
                email: email,
                password: password
            }
        }, {
            new: true
        });
        res.json(user);

    } catch (err) {
        res.status(404)
        res.send({
            error: "Postman not found"
        })
        console.log(err);
    }

});

UserRouter.post("/login", async (req, res) => {

    var username = req.body.username
    var password = req.body.password

    User.findOne({
            $or: [{
                username: username
            }, {
                email: username
            }]
        })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({
                            _id: user._id,
                            username: user.username
                        }, "AzQ,PI)0(", {
                            expiresIn: '1h'
                        })
                        res.json({
                            message: 'Login Successful!',
                            _id: user._id,
                            token
                        })
                    } else {
                        res.json({
                            message: "Password does not match"
                        })
                    }
                })
            } else {
                res.json({
                    message: "No user found"
                })
            }
        })
});
// UserRouter.post('/signout',authenticate.signout, (req, res) => {
//     res.send({ message: 'Successfully signed out' });
//   });

UserRouter.post("/admin/login", async (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    var un = process.env.USER_NAME;
    var pw = process.env.PASSWORD_;
    if (username === un && password === pw) {
        let token = jwt.sign({
            username: username
        }, "ngoma)(", {
            expiresIn: '1h'
        })
        res.json({
            message: 'Login Successful!',
            token
        })
    } else {
        res.json({
            message: "Access denied"
        })
    }
});
module.exports = UserRouter;