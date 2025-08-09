import React, { useState, useEffect } from 'react';

// Temporary simple apiService for testing
const apiService = {
  login: async (credentials) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },
  
  register: async (userData) => {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

// Simple Login Component
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('demo_user');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login with:', { username, password });
      const response = await apiService.login({ username, password });
      console.log('✅ Login successful:', response);
      onLogin(response.user);
    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        🔐 Login to Share Ride
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: '100%',
              fontSize: '16px'
            }}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: '100%',
              fontSize: '16px'
            }}
            placeholder="Enter your password"
          />
        </div>
        {error && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255,107,107,0.1)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,107,107,0.3)'
          }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: loading ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '🔄 Logging in...' : '🔐 Login'}
        </button>
      </form>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px'
      }}>
        <strong>Demo Credentials:</strong><br />
        Username: demo_user<br />
        Password: demo123
      </div>
    </div>
  );
}

// Simple Dashboard Component
function Dashboard({ user, onLogout }) {
  return (
    <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
      <h1>🚗 Welcome to Share Ride!</h1>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h2>👋 Hello, {user.full_name}!</h2>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button style={{
          padding: '15px 25px',
          borderRadius: '10px',
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          🚗 Offer a Ride
        </button>
        <button style={{
          padding: '15px 25px',
          borderRadius: '10px',
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          🔍 Find a Ride
        </button>
        <button style={{
          padding: '15px 25px',
          borderRadius: '10px',
          border: 'none',
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          📊 My Rides
        </button>
        <button 
          onClick={onLogout}
          style={{
            padding: '15px 25px',
            borderRadius: '10px',
            border: 'none',
            background: 'rgba(255,107,107,0.3)',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

// Main App Component
function SimpleApp() {
  console.log('🎨 SimpleApp component is rendering...');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 Checking for existing user session...');
    const savedUser = localStorage.getItem('shareride_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('✅ Found saved user:', userData);
        setUser(userData);
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.removeItem('shareride_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log('🎉 User logged in successfully:', userData);
    localStorage.setItem('shareride_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('👋 User logged out');
    localStorage.removeItem('shareride_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        <div>🔄 Loading Share Ride...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '50px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default SimpleApp;
