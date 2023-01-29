import express from "express";
import Comment from "../model/Comment";
import Blog from "../model/Blog";
import authenticate from "../middleware/authenticate";

const CommentRouter = express.Router();


// Configuration

CommentRouter.post("/:id", authenticate.authenticate, async (req, res) => {
    try {
        const comment = new Comment({
            blog: req.params.id,
            user: req.user._id,
            comment: req.body.comment
        });
        await comment.save();
        await Blog.updateOne({
            _id: comment.blog
        }, {
            $push: {
                comments: comment._id
            }
        })
        res.send(comment);
    } catch (err) {
        console.log(err);
    }

});

CommentRouter.get("/", authenticate.authenticate, async (req, res) => {
    try {
        const query = await Comment.find()
        res.send(query)
    } catch {
        res.status(404)
        res.send({
            error: "Postman not found"
        })
    }

})

//delete a message
CommentRouter.delete("/:id", authenticate.authenticate, async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findById(id);
    const commentor = comment.user;
    if (req.user._id === commentor) {
        try {

            const blog = Blog.findById(comment.blog);
            let arr = blog.comments;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === id) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            await Blog.findOneAndUpdate({
                _id: comment.blog
            }, {
                $set: {
                    comments: arr
                }
            }, {
                new: true
            })
            await comment.remove();
            res.success({
                message: "deleted successfully"
            });
        } catch {
            res.status(404)
            res.send({
                error: "Postman not found"
            })
        }

    }
});

module.exports = CommentRouter;