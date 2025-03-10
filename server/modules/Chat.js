import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{type:Schema.Types.ObjectId, ref:"User"},
    chatUrl:{type:String,unique:true},
    messages: [{
        role: { type: String, required: true },
        content: [{
            type: { type: String, required: true },
            text: { type: String },
            source: {
                type: { type: String },
                media_type: { type: String },
                data: { type: String }
            }
        }]
    }],
    chatTitle:{type:String}
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;