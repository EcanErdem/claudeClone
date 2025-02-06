import Chat from '../modules/Chat.js';
import User from '../modules/User.js';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();


const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const msg = async (messages) => {
   const response =  await anthropic.messages.create({
        model:"claude-3-5-haiku-20241022",
        max_tokens: 100,
        messages: messages
    })
    return response;
}

export const startChat = async (req,res)=>{
    try{
        const chat = await Chat.create({
            user:req.body.user,
            chatUrl: crypto.randomBytes(20).toString('hex'),
            chatTitle:req.body.chatTitle,
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
        const chat = await Chat.find();
        res.status(200).json(chat);
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

export const newMessage = async (req,res)=>{
    try{

        const chat = await Chat.findOne({chatUrl:req.body.chatUrl});
        chat.messages.push({role:"user", content:req.body.userMessage});
        const response = await msg(chat.messages.map(({role,content})=>({role,content}))); 
        chat.messages.push({role:"assistant", content:response.content[0].text});
        await chat.save();
        res.status(200).json(chat);
    }
    catch(err){
        res.status(500).json({err:err});
    }
}

export const deleteChat = async (req,res)=>{
    try{
        const chat = await Chat.deleteOne({chatUrl:req.query.chatUrl});
        res.status(200).json(chat);
    }catch(err){
        res.status(500).json({err:err});
    }
}