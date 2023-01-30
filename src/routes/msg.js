import express from "express";
import Msg from "../model/Msg";
import authenticate  from "../middleware/authenticate";
const MsgRouter = express.Router();


// Configuration

MsgRouter.post("/",authenticate.authenticate, async(req,res)=>{
  try{
    
    let msg = new Msg({
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    })
    let newMsg=await msg.save();
    res.json(newMsg);

  }catch(err){
      console.log(err);
  }

});

MsgRouter.get("/",authenticate.admin, async(req,res)=>{
    try{
        const query = await Msg.find()
        res.send(query)
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }

})

//delete a message
MsgRouter.delete("/:id",authenticate.admin, async(req,res)=>{
    try{
      let msg= await Msg.findById(req.params.id);
      await msg.remove();
        res.status(204).send()
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }
})
// MsgRouter.put("/:id", async(req,res)=>{
//   try{
//     const id = req.params.id;
//     let msg= await Msg.findById(id);

//     let  name= req.body.name || msg.name;
//     let  email= req.body.email || msg.email;
//     let  content= req.body.content || msg.content;

//     msg=await Msg.findOneAndUpdate({_id: id },{ $set:{ name: name ,email: email ,content: content}}, { new: true});
//     res.json(msg);
    
//   }catch(err){
//         res.status(404)
//         res.send({error:"Postman not found"})
//       console.log(err);
//   }

// });
module.exports =MsgRouter;
