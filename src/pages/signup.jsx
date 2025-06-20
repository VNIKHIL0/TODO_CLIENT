const API_BASE = import.meta.env.VITE_API_BASE_URL;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/register', {
        name,
        email,
        password,
      });
      alert('Signup successful ✅');
      navigate('/login');
    } catch (error) {
      alert('Signup failed ❌');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>📝 Signup</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
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

        <button type="submit">Register</button>
        <p>Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#007bff', cursor: 'pointer' }}>Login</span></p>
      </form>
    </div>
  );
}

export default Signup;
