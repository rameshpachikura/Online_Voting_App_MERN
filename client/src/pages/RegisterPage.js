import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Optional shared styles

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        role: 'voter' // hardcoded as voter
      });

      setMessage(res.data.message);
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>📝 Voter Registration</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
