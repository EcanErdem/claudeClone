import React, { useState } from 'react';
import '../styles/welcome.css';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';


const WelcomePage = ({ onStartChat }) => {
  
  const isAuth = Boolean(useSelector((state)=>state.token))



  const handleLogin = () => {
    window.location.href = '/login'; // Login sayfası
  };


  const handleSignup = () => {
    window.location.href = '/signup'; // Signup sayfası
  };

  
  // const {t, i18n} = this.props; BU T FUNC KULLANMAK İÇİN GEREKEN CONST
  return (
    <div 
      className="welcome-page" 
    >
      <div className="welcome-content">
        <h1>Claude Clone</h1>
        <p> Karşılama mesajı </p>
     {/* * <p> {t('karşılama')}</p>  KULLANIM BÖYLE OLMALI */} 
        {isAuth && (
          <button className="start-btn" onClick={onStartChat}>Sohbete Başla</button>
        )} 
      </div>

      
      {!isAuth && (
        <div className="additional-buttons">
          <button className="auth-button" onClick={handleLogin}>Login</button>
          <button className="auth-button" onClick={handleSignup}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

// export default withTranslation()(WelcomePage); BU DA ÇALIŞMASI İÇİN GEREKEN KAPANIŞ
export default WelcomePage;

