import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const clearSession = async () => {
    await fetch('http://localhost:5097/api/v1/login/clear-session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  clearSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5097/api/v1/login/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data.message)
      navigate('/dashboard');
    } else {
      setErrorMessage(data.message);
    } 
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Submit Button */}
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;