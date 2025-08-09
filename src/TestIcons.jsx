import React from 'react';
import { FaCar, FaUser, FaSearch } from 'react-icons/fa';

function TestIcons() {
  return (
    <div style={{ padding: '20px', fontSize: '24px' }}>
      <h1>Icon Test Page</h1>
      <div style={{ margin: '10px 0' }}>
        <FaCar style={{ color: 'blue', marginRight: '10px' }} />
        Car Icon
      </div>
      <div style={{ margin: '10px 0' }}>
        <FaUser style={{ color: 'green', marginRight: '10px' }} />
        User Icon
      </div>
      <div style={{ margin: '10px 0' }}>
        <FaSearch style={{ color: 'red', marginRight: '10px' }} />
        Search Icon
      </div>
    </div>
  );
}

export default TestIcons;
