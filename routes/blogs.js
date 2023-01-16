const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Blog = require("../model/Blog");
const { $where } = require("../model/Blog");
const authenticate = require("../middleware/authenticate")
// Configuration

router.post("/",authenticate.admin, upload.single("image"), async(req,res)=>{
  try{
    const result= await cloudinary.uploader.upload(req.file.path, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "capstone"
    });
    let blog = new Blog({
      article: req.body.article,
      image: result.secure_url,
      content: req.body.content,
      cloudinary_id: result.public_id
    })
    await blog.save();
    res.json(blog);

  }catch(err){

      console.log(err);
  }

});

router.get("/", async(req,res)=>{
    try{
        const query = await Blog.find()
        res.send(query)
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }

})

//delete a message
router.delete("/:id", async(req,res)=>{
    try{
      let blog= await Blog.findById(req.params.id);
      await cloudinary.uploader.destroy(blog.cloudinary_id);
      await blog.remove();
        res.status(204).send()
    }catch{
        res.status(404)
        res.send({error:"Postman not found"})
    }
})
router.put("/:id",upload.single("image"), async(req,res)=>{
  try{
    const id = req.params.id;
    let blog= await Blog.findById(id);
    const result={};
    if(req.file){
      result= await cloudinary.uploader.upload(req.file.path, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "capstone"
      });
    }
      
      let  article= req.body.article || blog.article;
       let image= result.secure_url || blog.image;
      let  content= req.body.content || blog.content;
      let  cloudinary_id= result.public_id || blog.cloudinary_id;
      
    
    
    blog=await Blog.findOneAndUpdate({_id: id },{ $set:{article: article,image: image,content: content,cloudinary_id: cloudinary_id}}, { new: true});
    res.json(blog);
    
  }catch(err){
        res.status(404)
        res.send({error:"Postman not found"})
      console.log(err);
  }

});
module.exports = router;
