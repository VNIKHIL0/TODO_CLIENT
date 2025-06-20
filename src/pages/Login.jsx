const API_BASE = import.meta.env.VITE_API_BASE_URL;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const res = await axios.post('https://todo-backend-69t0.onrender.com/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful ✅');
      navigate('/home');
    } catch (error) {
      alert('Login failed ❌');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>🔐 Login</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit">Login</button>
        <p>Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#007bff', cursor: 'pointer' }}>Signup</span></p>
      </form>
    </div>
  );
}

export default Login;
