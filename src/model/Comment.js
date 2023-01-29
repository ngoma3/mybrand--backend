import mongoose from "mongoose";
const schema= mongoose.Schema({
   blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blogs'},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    comment:{
        type:String,
    },
    date:{
     type: Date,
     default: Date.now
    }
});
export default mongoose.model("Comments", schema);