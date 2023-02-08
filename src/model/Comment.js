import mongoose from "mongoose";
const date = new Date();
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formatedDate = date.toLocaleDateString('en-US', options);
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
     default: formatedDate
    }
});
export default mongoose.model("Comments", schema);