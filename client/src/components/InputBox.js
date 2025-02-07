import React, { useState } from 'react';
import '../styles/inputBox.css';
import { useSelector } from 'react-redux';

const InputBox = ({ onSendMessage,onClick }) => {
  const [message, setMessage] = useState('');
  const [isSending,setIsSending] = useState(false);
  const token = useSelector((state)=>state.token)


  const handleSend =  async () => {
    if (message.trim()) {
      setIsSending(true);
      const response = await fetch("http://localhost:3001/chat/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({chatUrl:onSendMessage,userMessage:message})
      })
      if(response.ok){
        setMessage('');
        onClick();
      }
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Bana mesaj yaz!"
        value={message} disabled={isSending}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSend} disabled={isSending} >Gönder</button>
    </div>
  );
};

export default InputBox;
