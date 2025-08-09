// Test script to verify all connections

const API_BASE = 'http://localhost:3001/api';

async function testConnections() {
  console.log('🔍 Testing Share Ride App Connections...\n');

  // Test 1: API Root
  try {
    const response = await fetch(`${API_BASE}/`);
    const data = await response.json();
    console.log('✅ API Root Test:', data.message);
  } catch (error) {
    console.log('❌ API Root Test Failed:', error.message);
  }

  // Test 2: Database Connection
  try {
    const response = await fetch(`${API_BASE}/test`);
    const data = await response.json();
    console.log('✅ Database Test:', data.message);
  } catch (error) {
    console.log('❌ Database Test Failed:', error.message);
  }

  // Test 3: Active Rides
  try {
    const response = await fetch(`${API_BASE}/rides/active`);
    const data = await response.json();
    console.log(`✅ Active Rides Test: Found ${data.length} active rides`);
  } catch (error) {
    console.log('❌ Active Rides Test Failed:', error.message);
  }

  // Test 4: Login with Demo User
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo_user', password: 'demo123' })
    });
    const data = await response.json();
    if (data.user) {
      console.log('✅ Login Test: Demo user login successful');
      console.log(`   User: ${data.user.full_name} (${data.user.username})`);
    } else {
      console.log('❌ Login Test Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Login Test Failed:', error.message);
  }

  // Test 5: Frontend Server
  try {
    const response = await fetch('http://localhost:5173');
    if (response.ok) {
      console.log('✅ Frontend Server Test: Frontend is accessible');
    } else {
      console.log('❌ Frontend Server Test: Response not OK');
    }
  } catch (error) {
    console.log('❌ Frontend Server Test Failed:', error.message);
  }

  console.log('\n🎉 Connection Testing Complete!');
}

testConnections().catch(console.error);
