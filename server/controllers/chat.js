import Chat from '../modules/Chat.js';
import User from '../modules/User.js';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { format } from 'path';
import multer from 'multer';
import fs from "fs";
dotenv.config();

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"uploads/")
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})


const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const msg = async (messages,version) => {
   const response =  await anthropic.messages.create({
        model:version,//claude-3-5-haiku-20241022
        max_tokens: 8000,
        messages: messages
    })
    return response;
}

export const startChat = async (req,res)=>{
    try{
        const chat = await Chat.create({
            user:req.body.user,
            chatUrl: crypto.randomBytes(20).toString('hex'),
            chatTitle:"New Chat",
        });
        res.status(201).json(chat);
    
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

export const getChat = async (req,res)=>{
    try{
        const chat = await Chat.findOne({chatUrl:req.query.chatUrl});
        if(!chat) return res.status(404).json("Chat not found");
        res.status(200).json(chat);
    }catch(err){
        res.status(500).json({err:err.message});
    }   
}

export const getAllChat = async (req,res)=>{
    try{
        const chat = await Chat.find({user:req.query.user});
        res.status(200).json(chat);
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

export const newMessageWithImage = async(req,res)=>{
    try{
        const chat = await Chat.findOne({chatUrl:req.body.chatUrl}).lean()
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString("base64");
        chat.messages.push({role:"user",content: [
            {
              "type": "image",
              "source": {
                "type": "base64",
                "media_type": req.file.mimetype,
                "data": base64Image,
              }
            },
            {"type": "text", "text": req.body.userMessage}
          ]
        });
        fs.unlink(req.file.path,(err)=>{
            if(err) console.log(err);
        });
        const formattedMessages = chat.messages.map(({ role, content }) => ({
            role,
            content: Array.isArray(content)
                ? content.map(({ _id, id,filePath, ...rest }) => rest) // `_id` ve `id` alanlarını kaldır
                : [{ ...content, _id: undefined, id: undefined }]
        }));
       const response = await msg(formattedMessages,req.body.version);
        chat.messages.push({role:"assistant", content:response.content[0]});
        await Chat.replaceOne({chatUrl:req.body.chatUrl},chat);
        res.status(200).json(chat);
    }catch(err){
        console.log(err)
        res.status(500).json({err:err.message});
    }
}

export const newMessage = async (req,res)=>{
    try{
        const chat = await Chat.findOne({chatUrl:req.body.chatUrl}).lean()
        console.log(req.body.userMessage)
        if(chat.messages.length==0){
            const chatTitle = await msg([{role:"user",content:`Yazıcağım metin için içeriği en iyi yansıtan kısa bir başlık önerir misin? Cevabın sadece başlığı içersin ve başka bir şey yazılı olmasın : ${req.body.userMessage}`}],"claude-3-5-haiku-20241022");
            chat.chatTitle = chatTitle.content[0].text;
        }

        /*if(isIncludeImage){
            chat.messages.push({role:"user",content: [
                {
                  "type": "image",
                  "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": "/9j/4AAQSkZJRg...",
                  }
                },
                {"type": "text", "text": req.body.userMessage}
              ]
            });
        }else{
            chat.messages.push({role:"user", content:[{"type":"text","text":req.body.userMessage}]});
        }*/
        chat.messages.push({ role: "user", content: [{ "type": "text", "text": req.body.userMessage }] });
        
        const formattedMessages = chat.messages.map(({ role, content }) => ({
            role,
            content: Array.isArray(content)
                ? content.map(({ _id, id, ...rest }) => rest) // `_id` ve `id` alanlarını kaldır
                : [{ ...content, _id: undefined, id: undefined }]
        }));
       const response = await msg(formattedMessages,req.body.version);
        chat.messages.push({role:"assistant", content:response.content[0]});
        await Chat.replaceOne({chatUrl:req.body.chatUrl},chat);
        res.status(200).json(chat);
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:err.message});
    }
}

export const deleteChat = async (req,res)=>{
    try{
        const chat = await Chat.deleteOne({chatUrl:req.query.chatUrl});
        res.status(200).json(chat);
    }catch(err){
        res.status(500).json({err:err.message});
    }
}