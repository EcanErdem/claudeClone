//navigate ve route olayını yapamadım genel. 
// bıraktım bu haliyle tasarım gözüksün bi şey diye öyleisne oluştuğum bi sayfa
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate kullanıldı
import '../styles/loginPage.css';
import { setLogin } from "../state";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate kullanıldı

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginResponse = await fetch("http://localhost:3001/auth/login",{
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email:email,password:password})
    })
    const loggedIn= await loginResponse.json();
    if(loggedIn){
      dispatch(setLogin({
        user:loggedIn.user,
        token:loggedIn.token
      }))
    }
    navigate("/");
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
