import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouter from "./routes/users";
import BlogRouter from "./routes/blogs";
import MsgRouter from "./routes/msg";
import CommentRouter from "./routes/comments";
import cors from "cors";
import morgan from "morgan";
import SwaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import * as options  from "./documentation/swagger";

const specs = swaggerJSDoc(options);
const app = express();
dotenv.config();
const port=process.env.PORT

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan("dev"));
mongoose.set('strictQuery', true);


async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL_TESTS);
    console.log("connected");
  } catch (error) {
    console.error(error);
  }
}
app.use("/api-docs", SwaggerUI.serve, SwaggerUI.setup(specs));
app.use("/messages", MsgRouter);
app.use("/blogs", BlogRouter);
app.use("/auth", UserRouter);
app.use("/comments", CommentRouter);
connect();

app.listen(5000, () =>{
  console.log(`server started on port 5000`);
});

module.exports = app;