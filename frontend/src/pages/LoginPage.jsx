import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin') {
      localStorage.setItem('user', 'admin');
      navigate('/dashboard');
    } else {
      alert('Invalid login');
    }
  };

  return (
    <div className="login-container">
  <h2>Login</h2>
  <input
    className="login-input"
    value={username}
    onChange={e => setUsername(e.target.value)}
    placeholder="Username"
  />
  <button className="login-button" onClick={handleLogin}>Login</button>
</div>
  );
}