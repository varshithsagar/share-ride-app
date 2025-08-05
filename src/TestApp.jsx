import React from 'react';
import './App.css';

function TestApp() {
  console.log("TestApp is rendering!");
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{margin: '0 0 20px 0'}}>🚗 Share Ride</h1>
        <p style={{margin: '0'}}>Test Component is Working!</p>
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
          padding: '15px 30px',
          borderRadius: '25px',
          marginTop: '20px',
          cursor: 'pointer'
        }}>
          Login Test Button
        </div>
      </div>
    </div>
  );
}

export default TestApp;
