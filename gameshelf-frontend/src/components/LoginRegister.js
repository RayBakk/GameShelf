import { useState } from 'react';

export default function LoginRegister({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem('token', data.token);
      onLogin(data.userId);
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h2>Inloggen of registreren</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Gebruikersnaam" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" type="password" />
      <button onClick={() => handleSubmit('/api/auth/login')}>Inloggen</button>
      <button onClick={() => handleSubmit('/api/auth/register')}>Registreren</button>
    </div>
  );
}
