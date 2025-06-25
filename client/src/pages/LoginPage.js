import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // reuse the same CSS

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);
      setMessage('✅ Login successful!');

      // Decode the JWT token to get the role
      const decodedPayload = JSON.parse(atob(token.split('.')[1]));
      const userRole = decodedPayload.role;

      setTimeout(() => {
        if (userRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/vote';
        }
      }, 1500);
    } catch (err) {
      setMessage('❌ Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
