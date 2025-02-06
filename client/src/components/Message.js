import React from 'react';
import '../styles/message.css';

const Message = ({ text, sender }) => {
  return (
    <div className={`message ${sender}`}>
      <p>{text}</p>
    </div>
  );
};

export default Message;
