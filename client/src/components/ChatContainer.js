import React, { useEffect, useRef } from 'react';
import Message from './Message';
import '../styles/chat.css';

const ChatContainer = ({ messages, projectName, isThinking }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDoubleClick = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR'; // or 'tr-TR' for Turkish
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  if (!messages || messages.length === 0) {
    return (
      <div className="messages-container">
        <div className="empty-chat">
          <h2>Bu sohbette henüz mesaj bulunmuyor. Mesaj göndererek sohbete başlayabilirsiniz.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {!messages.length && (
        <div className="empty-chat">
          <h2>{projectName}</h2>
        </div>
      )}
      {messages.map((msg, index) => (
        <div
          key={index}
          onDoubleClick={() => handleDoubleClick(msg.content)} // Add double-click handler
          className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`} // Dynamically add class
        >
          <Message
            text={msg.content}
            image={msg.image}
            sender={msg.role}
          />
        </div>
      ))}
      {isThinking && (
        <div className="message assistant thinking-message">
          <div className="thinking-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
