import mongoose from "mongoose";
const schema= mongoose.Schema({
  article: String,
  category: String,
  image: String,
  content:String,
  cloudinary_id: String,
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments'
   }]
});
export default mongoose.model("Blogs", schema);
