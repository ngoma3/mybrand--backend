const express= require("express");
const mongoose = require("mongoose");
const app= express();
const dotenv= require("dotenv");
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
