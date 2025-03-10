import React from 'react';
import '../styles/message.css';

const Message = ({ text,image, sender }) => {
  return (
    <div className={`message ${sender}`}>
      {image[0] &&
      <img src={image[0]} alt="Yüklenen görsel" className="message-image" />
      }
      <p>{text}</p>
    </div>
  );
};

export default Message;
