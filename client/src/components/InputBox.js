import React, { useState } from 'react';
import '../styles/inputBox.css';

const InputBox = ({ onSendMessage,onClick }) => {
  const [message, setMessage] = useState('');

  const handleSend =  async () => {
    if (message.trim()) {
      const response = await fetch("http://localhost:3001/chat/",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({chatUrl:onSendMessage,userMessage:message})
      })
      if(response.ok){
        setMessage('');
        onClick();
      }
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
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSend}>Gönder</button>
    </div>
  );
};

export default InputBox;
