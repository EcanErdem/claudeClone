import React, { useState } from 'react';
import '../styles/inputBox.css';
import { useSelector } from 'react-redux';
import { claudeVersion } from '../constants';

const InputBox = ({ onSendMessage, onClick, setIsThinking }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("claude-3-5-haiku-20241022");

  const token = useSelector((state) => state.token);

  const handleSend = async () => {
    console.log(selectedVersion)
    if (message.trim()) {
      setIsSending(true);
      setIsThinking(true);
      const response = await fetch("http://localhost:3001/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ chatUrl: onSendMessage, userMessage: message,version:selectedVersion})
      });
      if (response.ok) {
        setMessage('');
        await onClick();
      }
      setIsSending(false);
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSend();
    }
  };

  const handleVersionChange = (e) => {
    setSelectedVersion(e.target.value);
  };

  return (
    <div className="input-box">
      <input
        type="text"
        placeholder="Bana mesaj yaz!"
        value={message}
        disabled={isSending}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      <select style={{borderRadius:".5em"}} name="claudeVersion" id="claudeVersion" value={selectedVersion} onChange={handleVersionChange}>
        {claudeVersion.map((version) => (
          <option key={version.id} value={version.id}>
            {version.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default InputBox;
