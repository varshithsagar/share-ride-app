import React from 'react';

function TestApp() {
  console.log('🧪 TestApp is rendering!');
  
  return (
    <div style={{
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '50px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>🚗 Share Ride Test</h1>
      <p>✅ React is working!</p>
      <p>📱 Frontend server is running!</p>
      <p>⚡ This is a test component!</p>
      <button style={{
        padding: '10px 20px',
        fontSize: '16px',
        marginTop: '20px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid white',
        borderRadius: '10px',
        color: 'white',
        cursor: 'pointer'
      }} onClick={() => alert('Button clicked!')}>
        Test Button
      </button>
    </div>
  );
}

export default TestApp;
