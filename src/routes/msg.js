import express from "express";
import Msg from "../model/Msg";
import authenticate  from "../middleware/authenticate";
const MsgRouter = express.Router();


// Configuration

MsgRouter.post("/", async(req,res)=>{
  const msg = new Msg({
    name: req.body.name,
    content: req.body.content,
    email: req.body.email
  })
  try{  
    const newMsg=await msg.save();
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
      const msg= await Msg.findById(req.params.id);
      await msg.remove();
        res.status(204).send()
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }
})

module.exports =MsgRouter;
