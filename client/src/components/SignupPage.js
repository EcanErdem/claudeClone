import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../styles/signupPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    } else{
      const newSignUp = {
        email: email,
        password: password,
      }

      const signupResponse = await fetch("http://localhost:3001/auth/register",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSignUp)
      })
      const newSignUpAll = await signupResponse.json();
      navigate("/login");
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
