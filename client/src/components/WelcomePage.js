import React, { useState } from 'react';
import '../styles/welcome.css';

const WelcomePage = ({ onStartChat }) => {
  const [showButtons, setShowButtons] = useState(false);

  const handleMouseEnter = () => {
    setShowButtons(true);
  };

  const handleMouseLeave = () => {
    setShowButtons(false);
  };

  const handleLogin = () => {
    window.location.href = '/login'; // Login sayfasına yönlendirme
  };


  const handleSignup = () => {
    window.location.href = '/signup'; // Signup sayfasına yönlendirme
  };

  return (
    <div 
      className="welcome-page" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div className="welcome-content">
        <h1>Claude Clone</h1>
        <p>Yapay zeka destekli sohbet deneyimi</p>
        <button className="start-btn" onClick={onStartChat}>Sohbete Başla</button>
      </div>

      
      {showButtons && (
        <div className="additional-buttons">
          <button className="auth-button" onClick={handleLogin}>Login</button>
          <button className="auth-button" onClick={handleSignup}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;

