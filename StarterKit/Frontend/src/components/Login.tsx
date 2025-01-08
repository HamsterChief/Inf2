import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        'Content-Type': 'application/json', // Dit geeft aan dat je JSON verzendt
        'Accept': 'application/json', // Dit vertelt de server dat je JSON als antwoord verwacht
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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
