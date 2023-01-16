const router = require("express").Router();
const User = require("../model/Users");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authenticate = require("../middleware/authenticate")
// Configuration

router.post("/signup", async(req,res)=>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if (err){
            res.json({
                error: err
            })
        }
        user.password= hashedPass
    })
    
  try{ 
    await user.save();
    res.json(user);

  }catch(err){
      console.log(err);
  }

});

router.get("/",authenticate.admin, async(req,res)=>{
    try{
        const query = await User.find()
        res.send(query)
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }

})

//delete a message
router.delete("/:id",authenticate.admin, async(req,res)=>{
    try{
      let User= await User.findById(req.params.id);
      await user.remove();
        res.status(204).send()
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }
})
router.put("/:id",authenticate.admin, async(req,res)=>{
  try{
    const id = req.params.id;
    let user= await User.findById(id);

    let  username= req.body.username || msg.username;
    let  email= req.body.email || msg.email;
    let  password= req.body.password || msg.password;

    user=await User.findOneAndUpdate({_id: id },{ $set:{ username: username ,email: email ,password: password}}, { new: true});
    res.json(user);
    
  }catch(err){
        res.status(404)
        res.send({error:"Postman not found"})
      console.log(err);
  }

});

router.post("/login", async(req,res)=>{

    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{email: username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password,user.password, function(err, result){
                if(err) {
                    res.json({
                        error: err
                    })
                }if(result){
                    let token = jwt.sign({username: user.username}, "verySecretValue",{expiresIn: '1h'})
                    res.json({
                        message: 'Login Successful!',
                        token
                    })
                }else{
                    res.json({
                        message: "Password does not match"
                    })
                }
            })
        }else{
            res.json({
                message: "No user found"
            })
        }
    })
});
router.post("/admin/login", async(req,res)=>{

    var username = req.body.username;
    var password = req.body.password;
    var un= process.env.USER_NAME;
    var pw=process.env.PASSWORD_;
console.log(username, password);
console.log(process.env.USER_NAME,process.env.PASSWORD_);
    if(username === un && password === pw){
        let token = jwt.sign({username: username}, "ngoma",{expiresIn: '1h'})
        res.json({
            message: 'Login Successful!',
            token
        })
    }else{
        res.json({
            message: "Access denied"
        })
    }
});
module.exports = router;
