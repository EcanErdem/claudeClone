import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{type:Schema.Types.ObjectId, ref:"User"},
    chatUrl:{type:String},
    messages:[{
        role:{type:String},
        content:{type:String},
    }],
    chatTitle:{type:String}
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;