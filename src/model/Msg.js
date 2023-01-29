import mongoose from "mongoose";
const schema= mongoose.Schema({
  name: String,
  email:String,
  content:String
});
export default mongoose.model("Messages", schema);
