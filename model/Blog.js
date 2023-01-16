const mongoose= require("mongoose");
const schema= mongoose.Schema({
  article: String,
  image: String,
  content:String,
  cloudinary_id: String
});
module.exports = mongoose.model("Blogs", schema);
