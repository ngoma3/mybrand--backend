import mongoose from "mongoose";
const schema= mongoose.Schema({
  username: String,
  email: String,
  password:String,
  token: String
});
export default mongoose.model("Users", schema);
