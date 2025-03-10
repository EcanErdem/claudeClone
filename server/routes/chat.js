import express from 'express';
import {getChat,startChat,newMessage, getAllChat, deleteChat,newMessageWithImage} from "../controllers/chat.js"
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"uploads/")
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage:storage})


const router = express.Router();

router.get("",verifyToken,getChat)
router.get("/allChat",verifyToken,getAllChat)

router.post("/newChat",verifyToken,startChat)
router.post("",verifyToken,newMessage)
router.post("/upload",verifyToken,upload.single("image"),newMessageWithImage)

router.delete("/deleteChat",verifyToken,deleteChat)

export default router;