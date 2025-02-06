//navigate ve route olayını yapamadım genel. 
// bıraktım bu haliyle tasarım gözüksün bi şey diye öyleisne oluştuğum bi sayfa
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate kullanıldı
import '../styles/loginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Burda patlıyo galiba 

  const handleLogin = (e) => {
    e.preventDefault();
    // Burada login işlemleri yapılacak
    // Eğer giriş başarılıysa, yönlendirme yapılabilir
    console.log("Giriş yapılıyor...");
    // navigate("/dashboard"); // Örneğin dashboard'a yönlendirme
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Giriş Yap</h1>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
