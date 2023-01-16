import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();




app.use(express.json());
mongoose.set('strictQuery', true);


async function connect(){
  try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected");
  }catch(error){
    console.error(error);
  }
}
app.use("/messages", require("./routes/msg"));
app.use("/blogs", require("./routes/blogs"));
app.use("/auth", require("./routes/users"));
connect();

app.listen(3000, ()=>{
  console.log("server started on port 3000");
});
