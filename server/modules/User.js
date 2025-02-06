import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,},
    email:{type:String, required:true},
    password:{type:String, required:true},
    profilePic:{type:String, default:""},
    chats:[{type:mongoose.Schema.Types.ObjectId, ref:"Chat"}]
});

const User = mongoose.model("User",userSchema);
export default User;