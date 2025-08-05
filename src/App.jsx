import React, { useState } from 'react';
import './App.css';

function LoginPage({ onLogin, registeredUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    // Generate a random 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(generatedOTP);
    setOtpSent(true);
    setError('');
    // In a real app, you would send this OTP to the user's phone
    console.log('OTP sent:', generatedOTP);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate against registered user
    if (!registeredUser || username !== registeredUser.username) {
      setError('Username not found. Please register first.');
      return;
    }
    
    if (password !== registeredUser.password) {
      setError('Incorrect password. Please try again.');
      return;
    }
    
    onLogin(registeredUser); // Pass the full user data
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
        <button type="submit" className="login-btn">Login</button>
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
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
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
    const registeredData = {
      username: userData.username,
      password: userData.password
    };
    setRegisteredUser(registeredData);
    setIsRegistering(false);
  };

  if (user) {
    return (
      <>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="welcome-container">
          <div className="user-display">
            <span className="welcome-text">Welcome,</span>
            <span className="username">{user.username}</span>
          </div>
          <h2>🚗 Share Your Ride – Save Time, Money & the Planet!</h2>
          
          <div className="ride-actions">
            <button className="action-btn offer-ride">
              <span className="icon">🚙</span>
              Offer a Ride
            </button>
            <button className="action-btn find-ride">
              <span className="icon">🔍</span>
              Find a Ride
            </button>
          </div>

          <div className="welcome-content">
            <div className="available-rides">
              <h3>🚗 Available Rides Nearby</h3>
              <div className="ride-cards">
                <div className="ride-card">
                  <div className="ride-info">
                    <p className="route">🏢 City Center → 🎓 University</p>
                    <p className="time">🕒 Leaving in 30 mins</p>
                    <p className="price">💰 ₹50 per person</p>
                    <p className="seats">💺 2 seats available</p>
                  </div>
                  <button className="join-btn">Join Ride</button>
                </div>

                <div className="ride-card">
                  <div className="ride-info">
                    <p className="route">🏬 Mall → 🏢 Tech Park</p>
                    <p className="time">🕒 Leaving in 1 hour</p>
                    <p className="price">💰 ₹40 per person</p>
                    <p className="seats">💺 3 seats available</p>
                  </div>
                  <button className="join-btn">Join Ride</button>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="profile-btn">
              <span className="icon">👤</span>
              My Profile
            </button>
            <button className="my-rides-btn">
              <span className="icon">🚗</span>
              My Rides
            </button>
            <button className="logout-btn" onClick={() => {
              setUser(null);
              setIsRegistering(false);
            }}>
              <span className="icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="app-container">
        <h1 className="app-title">Share Ride<span className="underline"></span></h1>
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
    </>
  );
}

export default App;
