import React, { useEffect, useRef } from 'react';
import Message from './Message';
import '../styles/chat.css';
//a
const ChatContainer = ({ messages, projectName }) => {
  const chatEndRef = useRef(null);

  // Mesaj kaydırma
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Mesaj kaydırma

  return (
    <div className="chat-container">
  
      {!messages.length && (
        <div className="project-title">
          <h2>{projectName}</h2>
        </div>
      )}
      {messages.map((msg, index) => (
        <Message key={index} text={msg.content} sender={msg.role} />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatContainer;
