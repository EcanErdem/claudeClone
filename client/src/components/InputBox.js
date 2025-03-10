import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt, faMicrophoneAltSlash } from '@fortawesome/free-solid-svg-icons'; // Mikrofon ikonları
import '../styles/inputBox.css';
import { useSelector } from 'react-redux';
import { claudeVersion } from '../constants';

const InputBox = ({ onSendMessage, onClick, setIsThinking }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("claude-3-5-haiku-20241022");

  const token = useSelector((state) => state.token);

  const [file,setFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Sesli giriş için API'yi başlatan fonksiyon
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tarayıcınız bu özelliği desteklemiyor.');
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.lang = 'tr-TR'; // Türkçe dil desteği
    newRecognition.continuous = true; // Sürekli dinleme
    newRecognition.interimResults = true; // Geçici sonuçları da al

    newRecognition.onstart = () => {
      setIsListening(true);
    };

    newRecognition.onend = () => {
      setIsListening(false);
    };

    newRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript); // Sesle yazılan metni input'a set ediyoruz
    };

    newRecognition.start(); // Dinlemeye başlıyoruz
    setRecognition(newRecognition); // Recognition objesini saklıyoruz
  };

  // Dinlemeyi durdurma fonksiyonu
  const stopListening = () => {
    if (recognition) {
      recognition.stop(); // Ses tanımayı durduruyoruz
    }
  };

  // Sesli mesaj gönderme işlemi
  const handleSend = async () => {
    if (message.trim()) {
      if(file !== null){

      const formData =  new FormData();
      formData.append('image',file);
      formData.append('userMessage',message);
      formData.append('version',selectedVersion);
      formData.append('chatUrl',onSendMessage);
      setIsSending(true);
      setIsThinking(true);
      const response = await fetch("http://localhost:3001/chat/upload/",{
        method:"POST",
        headers:{
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });
      if(response.ok){
        setMessage('');
        setFile(null);
        await onClick();
      }
      setIsSending(false);
      setIsThinking(false);
    }else{
        setIsSending(true);
        setIsThinking(true);
        const response = await fetch("http://localhost:3001/chat/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ chatUrl: onSendMessage, userMessage: message, version: selectedVersion })
        });
        if (response.ok) {
          setMessage('');
          await onClick();
        }
        setIsSending(false);
        setIsThinking(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && message.trim()) {
      handleSend();
    }
  };

  const handleFileChange = (e) =>{
    setFile(e.target.files[0]);
    console.log(file)
  }

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
      {/* Mikrofon ikonu butonu */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isSending}
        style={{ border: 'none', background: 'transparent' }}
      >
        <FontAwesomeIcon
          icon={isListening ? faMicrophoneAltSlash : faMicrophoneAlt}
          style={{ fontSize: '30px', color: isListening ? 'red' : 'black' }}
        />
      </button>
      <input type='file' id='file' onChange={handleFileChange} className='inputFile' accept='image/*' />
      <button onClick={handleSend} disabled={isSending}>
        {isSending ? 'Gönderiliyor...' : 'Gönder'}
      </button>
      <select style={{ borderRadius: ".5em" }} name="claudeVersion" id="claudeVersion" value={selectedVersion} onChange={handleVersionChange}>
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
