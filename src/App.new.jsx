import React, { useState } from 'react';
import './App.css';

function LoginPage({ onLogin, registeredUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate against registered user
    if (registeredUser && username === registeredUser.username && password === registeredUser.password) {
      onLogin({ username });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function RegistrationPage({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSuccess('Registration successful!');
    // Simulate API call with delay
    setTimeout(() => {
      onRegister({ username, password });
    }, 1500);
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <div>
          <label>Confirm Password:</label><br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Register</button>
      </form>
      {success && (
        <div className="registration-success">
          <h3>Registration Successful!</h3>
          <p>Redirecting to login...</p>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleRegistration = (userData) => {
    setRegisteredUser(userData);
    setUser(userData);
    setIsRegistering(false);
  };

  if (user) {
    return (
      <div className="welcome-container">
        <div className="user-display">
          <span className="welcome-text">Welcome,</span>
          <span className="username">{user.username}</span>
        </div>
        <p>Start sharing your ride today – it's quick, simple, and smart.</p>
        <button onClick={() => setUser(null)}>Logout</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {isRegistering ? (
        <>
          <RegistrationPage onRegister={handleRegistration} />
          <p className="toggle-text">
            Already have an account?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(false)}>
              Login
            </button>
          </p>
        </>
      ) : (
        <>
          <LoginPage onLogin={setUser} registeredUser={registeredUser} />
          <p className="toggle-text">
            Don't have an account?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(true)}>
              Register
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default App;
