import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data for the application
const MOCK_USERS = [
  { id: 1, username: 'demo_user', password: 'demo123', full_name: 'Demo User', email: 'demo@shareride.com', phone: '+91 9876543210' },
  { id: 2, username: 'john_doe', password: 'password123', full_name: 'John Doe', email: 'john@shareride.com', phone: '+91 9876543211' },
  { id: 3, username: 'jane_smith', password: 'password123', full_name: 'Jane Smith', email: 'jane@shareride.com', phone: '+91 9876543212' }
];

const MOCK_RIDES = [
  {
    id: 1,
    driver: 'John Doe',
    from: 'Gachibowli',
    to: 'Hitec City',
    date: '2025-08-10',
    time: '09:00',
    price: 50,
    seats: 3,
    vehicle: 'Honda City',
    rating: 4.8,
    vehicleType: 'Sedan',
    pickup: 'Near Gachibowli Metro Station'
  },
  {
    id: 2,
    driver: 'Jane Smith',
    from: 'Kukatpally',
    to: 'Hitec City',
    date: '2025-08-10',
    time: '08:30',
    price: 60,
    seats: 2,
    vehicle: 'Toyota Innova',
    rating: 4.9,
    vehicleType: 'SUV',
    pickup: 'Near Kukatpally Bus Station'
  },
  {
    id: 3,
    driver: 'Mike Johnson',
    from: 'Secunderabad',
    to: 'Gachibowli',
    date: '2025-08-10',
    time: '10:15',
    price: 200,
    seats: 4,
    vehicle: 'Maruti Swift',
    rating: 4.7,
    vehicleType: 'Car',
    pickup: 'Near Secunderabad Railway Station'
  }
];

const VEHICLE_TYPES = [
  {
    id: 'bike',
    name: 'Bike',
    icon: '🏍️',
    seats: '2 Seats',
    bags: '1 Bag',
    models: 'Royal Enfield, Pulsar',
    basePrice: 80
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: '🛺',
    seats: '3 Seats',
    bags: '2 Bags',
    models: 'Bajaj Auto, TVS King',
    basePrice: 120
  },
  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    seats: '4 Seats',
    bags: '3 Bags',
    models: 'Swift, Indica, Wagon R',
    basePrice: 200
  },
];

// Vehicle Selection Component
function VehicleSelection({ selectedVehicle, onVehicleSelect, distance = 25 }) {
  return (
    <div className="vehicle-selection">
      <h3 style={{ marginBottom: 'var(--space-6)', color: 'var(--text-dark)', textAlign: 'center' }}>
        Select Vehicle Type
      </h3>
      <div className="vehicle-grid">
        {VEHICLE_TYPES.map(vehicle => {
          const calculatedPrice = Math.round(vehicle.basePrice + (distance * 8));
          return (
            <div
              key={vehicle.id}
              className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
              data-vehicle-id={vehicle.id}
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className="vehicle-icon">{vehicle.icon}</div>
              <div className="vehicle-name">{vehicle.name}</div>
              <div className="vehicle-details">
                <span>👥 {vehicle.seats}</span>
                <span>🎒 {vehicle.bags}</span>
                <span>❄️ AC</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-gray)', marginBottom: 'var(--space-3)' }}>
                {vehicle.models}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Login Component - QuickRide Style
function LoginPage({ onLogin, onToggleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-showcase">
          <h1 className="brand-heading">Share Ride</h1>
          <p className="brand-subtitle">Your journey, shared with care</p>
        </div>
        
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to your account to continue your journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`btn-primary ${loading ? 'loading' : ''}`}
            style={{ width: '100%', marginBottom: 'var(--space-4)' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="toggle-text">
            Don't have an account?{' '}
            <button className="link-button" onClick={onToggleRegister}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Registration Component
function RegistrationPage({ onRegister, onToggleLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Check if username already exists
      const existingUser = MOCK_USERS.find(u => u.username === formData.username);
      
      if (existingUser) {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: MOCK_USERS.length + 1,
        ...formData
      };
      
      MOCK_USERS.push(newUser);
      onRegister(newUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-showcase">
          <h1 className="brand-heading">Share Ride</h1>
          <p className="brand-subtitle">Your journey, shared with care</p>
        </div>
        
        <div className="login-header">
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Join Share Ride to start your journey with us</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading} 
            className={`btn-primary ${loading ? 'loading' : ''}`}
            style={{ width: '100%', marginBottom: 'var(--space-4)' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="toggle-text">
            Already have an account?{' '}
            <button className="link-button" onClick={onToggleLogin}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ user, onLogout }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [tripType, setTripType] = useState('one-way');
  const [returnDate, setReturnDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [multiCityLegs, setMultiCityLegs] = useState([
    { from: '', to: '', date: '' },
    { from: '', to: '', date: '' }
  ]);

  const handleTripTypeChange = (type) => {
    setTripType(type);
    // Reset form when changing trip type
    if (type !== 'multi-city') {
      setMultiCityLegs([
        { from: '', to: '', date: '' },
        { from: '', to: '', date: '' }
      ]);
    }
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const isFormValid = () => {
    if (tripType === 'one-way') {
      return fromLocation && toLocation && selectedVehicle && departureDate;
    } else if (tripType === 'round-trip') {
      return fromLocation && toLocation && selectedVehicle && departureDate && returnDate;
    } else if (tripType === 'multi-city') {
      return multiCityLegs.every(leg => leg.from && leg.to && leg.date) && selectedVehicle;
    }
    return false;
  };
  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">🚗</div>
            <div>
              <h1 className="app-title">Share Ride</h1>
              <p className="app-tagline">Best Ride. Best Fare</p>
            </div>
          </div>
          
          <nav className="header-nav">
            <div className="header-cta">
              <span style={{ color: 'white', marginRight: '15px' }}>
                Welcome, {user.full_name}!
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      <div className="booking-section">
        <div className="booking-container">
          {/* Trip Type Selector */}
          <div className="trip-type-selector">
            <button 
              className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('one-way')}
            >
              <span className="trip-icon">➡️</span>
              One Way
            </button>
            <button 
              className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('round-trip')}
            >
              <span className="trip-icon">🔄</span>
              Round Trip
            </button>
            <button 
              className={`trip-type-btn ${tripType === 'multi-city' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('multi-city')}
            >
              <span className="trip-icon">�️</span>
              Multi City
            </button>
          </div>

          {/* Location inputs for one-way and round-trip */}
          {(tripType === 'one-way' || tripType === 'round-trip') && (
            <>
              <div className="location-inputs">
                <div className="location-input-group">
                  <label className="location-label">📍 From</label>
                  <input
                    type="text"
                    className="location-input"
                    placeholder="Enter pickup location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                  />
                </div>
                
                <div className="swap-button-container">
                  <button className="swap-btn" onClick={swapLocations} type="button">⇄</button>
                </div>
                
                <div className="location-input-group">
                  <label className="location-label">🎯 To</label>
                  <input
                    type="text"
                    className="location-input"
                    placeholder="Enter destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="date-inputs">
                <div className="date-input-group">
                  <label className="date-label">📅 Departure Date</label>
                  <input
                    type="date"
                    className="date-input"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {tripType === 'round-trip' && (
                  <div className="date-input-group">
                    <label className="date-label">🔄 Return Date</label>
                    <input
                      type="date"
                      className="date-input"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={departureDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Multi City Form */}
          {tripType === 'multi-city' && (
            <div className="multi-city-container">
              <div className="multi-city-header">
                <h3>Plan Your Multi-City Journey</h3>
                <p>Add multiple destinations for your trip</p>
              </div>
              
              {multiCityLegs.map((leg, index) => (
                <div key={index} className="multi-city-leg">
                  <div className="leg-header">
                    <span className="leg-number">{index + 1}</span>
                    <span className="leg-title">
                      {index === 0 ? 'First Destination' : 
                       index === 1 ? 'Second Destination' : 
                       `Destination ${index + 1}`}
                    </span>
                  </div>
                  
                  <div className="multi-city-inputs">
                    <div className="multi-input-group">
                      <label>📍 From</label>
                      <input
                        type="text"
                        className="location-input"
                        placeholder="Departure city"
                        value={leg.from}
                        onChange={(e) => {
                          const updatedLegs = multiCityLegs.map((l, i) => 
                            i === index ? { ...l, from: e.target.value } : l
                          );
                          setMultiCityLegs(updatedLegs);
                        }}
                      />
                    </div>
                    
                    <div className="multi-input-group">
                      <label>🎯 To</label>
                      <input
                        type="text"
                        className="location-input"
                        placeholder="Destination city"
                        value={leg.to}
                        onChange={(e) => {
                          const updatedLegs = multiCityLegs.map((l, i) => 
                            i === index ? { ...l, to: e.target.value } : l
                          );
                          setMultiCityLegs(updatedLegs);
                        }}
                      />
                    </div>
                    
                    <div className="multi-input-group">
                      <label>📅 Date</label>
                      <input
                        type="date"
                        className="date-input"
                        value={leg.date}
                        onChange={(e) => {
                          const updatedLegs = multiCityLegs.map((l, i) => 
                            i === index ? { ...l, date: e.target.value } : l
                          );
                          setMultiCityLegs(updatedLegs);
                        }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                className="add-destination-btn"
                onClick={() => setMultiCityLegs([...multiCityLegs, { from: '', to: '', date: '' }])}
                type="button"
              >
                ➕ Add Another Destination
              </button>
            </div>
          )}

          <VehicleSelection 
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />

          <div className="booking-actions">
            <button 
              className="btn-primary"
              style={{ width: '100%', padding: 'var(--space-4)' }}
              disabled={!isFormValid()}
            >
              {tripType === 'one-way' && '🔍 Search One Way Rides'}
              {tripType === 'round-trip' && '🔍 Search Round Trip Rides'}
              {tripType === 'multi-city' && '🔍 Search Multi-City Rides'}
            </button>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="quick-action-card">
          <div className="quick-action-icon">🚗</div>
          <h3>Offer a Ride</h3>
          <p>Share your journey and earn money</p>
        </div>
        
        <div className="quick-action-card">
          <div className="quick-action-icon">📊</div>
          <h3>My Trips</h3>
          <p>View your booking history</p>
        </div>
        
        <div className="quick-action-card">
          <div className="quick-action-icon">👤</div>
          <h3>Profile</h3>
          <p>Manage your account settings</p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function ShareRideApp() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check for saved user
    const savedUser = localStorage.getItem('shareride_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('shareride_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('shareride_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleRegister = (userData) => {
    localStorage.setItem('shareride_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('shareride_user');
    setUser(null);
  };

  if (!user) {
    return (
      <div className="app-container">
        {isRegistering ? (
          <RegistrationPage 
            onRegister={handleRegister} 
            onToggleLogin={() => setIsRegistering(false)}
          />
        ) : (
          <LoginPage 
            onLogin={handleLogin} 
            onToggleRegister={() => setIsRegistering(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default ShareRideApp;
