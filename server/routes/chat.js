import express from 'express';
import {getChat,startChat,newMessage, getAllChat, deleteChat} from "../controllers/chat.js"
import { verifyToken } from '../middleware/auth.js';
 
const router = express.Router();

router.get("",verifyToken,getChat)
router.get("/allChat",verifyToken,getAllChat)

router.post("/newChat",verifyToken,startChat)
router.post("",verifyToken,newMessage)

router.delete("/deleteChat",verifyToken,deleteChat)

export default router;