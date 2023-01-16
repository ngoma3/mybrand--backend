const mongoose= require("mongoose");
const schema= mongoose.Schema({
  name: String,
  email:String,
  content:String
});
module.exports = mongoose.model("Messages", schema);
