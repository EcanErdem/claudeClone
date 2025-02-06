//navigate ve route olayını yapamadım genel.
// bıraktım bu haliyle tasarım gözüksün bi şey diye öyleisne oluştuğum bi sayfa
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../styles/signupPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }
    
    console.log("Kayıt yapılıyor...");

  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Kayıt Ol</h1>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifreyi Onayla"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
