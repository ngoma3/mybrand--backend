import express from "express";
import cloudinary from "../utils/cloudinary";
import multer from "../utils/multer";
import Blog from "../model/Blog";
import Comment from "../model/Comment";
import authenticate from "../middleware/authenticate";
import User from "../model/Users";
const BlogRouter = express.Router();
// Configuration

BlogRouter.post("/",authenticate.admin, multer.single("image"), async (req, res) => {
  try {
    await cloudinary.uploader.upload(req.file.path, {
      public_id: `${Date.now()}`,
      folder: "capstone",
      resource_type: "auto"
    })
    .then(async(result)=>{
      let blog = new Blog({
        article: req.body.article,
        image: result.secure_url,
        cloudinary_id: result.public_id,
        content: req.body.content,
        category: req.body.category
  
      })
      let nblog=await blog.save();
      res.json(nblog);
    });
    

  } catch (err) {
    console.log(err);
  }

});

BlogRouter.get("/", async (req, res) => {
  try {
  await Blog.find()
  .then(async(query)=>{
    res.send(query)
  }) ;
  } catch {
    res.status(404)
    res.send({
      error: 'Postman not found',
      message: "it's me"
    })
  }

})
BlogRouter.get("/:id", async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    const arr= blog.comments;
    let comments=[];
    for (var i = 0; i < arr.length; i++) {
      let comment = await Comment.findById(arr[i]);
      let user = await User.findById(comment.user);
      const cmt = {
        user: user.username,
        comment: comment.comment,
        date: comment.date
      }
      comments.push(cmt);
    }
    let blog2={
      _id: blog._id,
      article: blog.article,
      category: blog.category,
      image: blog.image,
      content: blog.content,
      cloudinary_id: blog.cloudinary_id,
      comments: comments
    }
    res.send(blog2)
  } catch {
    res.status(404)
    res.send({
      error: 'Postman not found'
    })
  }

})


BlogRouter.delete("/:id",authenticate.admin, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    await cloudinary.uploader.destroy(blog.cloudinary_id);
    const arr = blog.comments;
    for (var j = 0; j < arr.length; j++) {
      let cmt = await Comment.findById(arr[j]);
      cmt.remove()
    }
    await blog.remove();
    res.send({
      message: 'Blog deleted successfuly'
    })
  } catch {
    res.status(404)
    res.send({
      error: 'Postman not found'
    })
  }
})
BlogRouter.put("/blog/:id", authenticate.admin ,  multer.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    let blog = await Blog.findById(id);
    let result = {};

    if (req.file) {
      if(blog.cloudinary_id !== null){
        await cloudinary.uploader.destroy(blog.cloudinary_id);
      }
      result = await cloudinary.uploader.upload(req.file.path, {
        public_id: `${Date.now()}`,
        resource_type: "auto",
        folder: "capstone"
      });
    }
    // if(req.file || req.body.article){
    //   const arr = blog.comments;
    //   for (var i = 0; i < arr.length; i++) {
    //     await Comment.findById(arr[i])
    //     .then(async(comment)=>{
    //       comment.remove()
    //     });
    //   }
    // }
    let article = req.body.article || blog.article;
    let image = result.secure_url || blog.image;
    let content = req.body.content || blog.content;
    let category = req.body.category || blog.category;
    let cloudinary_id = result.public_id || blog.cloudinary_id;
    
    blog = await Blog.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        article: article,
        image: image,
        category: category,
        content: content,
        cloudinary_id: cloudinary_id
      }
    }, {
      new: true
    });
    res.send({
      message: "Updated successfuly"
    });

  } catch (err) {
    res.status(404)
    res.send({
      error: "Postman not found"
    })
    console.log(err);
  }

});
module.exports = BlogRouter;