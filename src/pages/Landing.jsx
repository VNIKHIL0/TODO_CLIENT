// src/pages/Landing.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home'); // already logged in
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the To-Do App 📝</h1>
      <div style={{ marginTop: '30px' }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/signup" style={{ marginLeft: '10px' }}><button>Signup</button></Link>
      </div>
    </div>
  );
}

export default Landing;
