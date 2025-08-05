import React, { useState, useEffect } from 'react';
import './App.css';

function MyRides({ user, onClose, rideHistory }) {
  return (
    <div className="overlay">
      <div className="modal-container my-rides-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>📊 My Rides</h2>
        
        <div className="rides-history">
          {rideHistory.length === 0 ? (
            <div className="no-history">
              <div className="no-history-icon">🚗</div>
              <h3>No rides yet!</h3>
              <p>Your booked rides will appear here.</p>
              <p>Start by finding and booking your first ride!</p>
            </div>
          ) : (
            <>
              <div className="history-stats">
                <div className="stat-card">
                  <span className="stat-number">{rideHistory.length}</span>
                  <span className="stat-label">Total Rides</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">₹{rideHistory.reduce((total, ride) => total + ride.totalPrice, 0)}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{rideHistory.filter(ride => ride.status === 'Booked').length}</span>
                  <span className="stat-label">Active Bookings</span>
                </div>
              </div>
              
              <div className="rides-list-history">
                {rideHistory.map(ride => (
                  <div key={ride.id} className="ride-history-card">
                    <div className="ride-header-history">
                      <div className="ride-route-history">
                        <span className="from">{ride.from}</span>
                        <span className="arrow">→</span>
                        <span className="to">{ride.to}</span>
                      </div>
                      <div className={`ride-status status-${ride.status.toLowerCase()}`}>
                        {ride.status}
                      </div>
                    </div>
                    
                    <div className="ride-details-history">
                      <div className="ride-info-grid">
                        <div className="info-item">
                          <span className="info-label">📅 Date:</span>
                          <span className="info-value">{ride.date}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">🕐 Time:</span>
                          <span className="info-value">{ride.time}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">👥 Passengers:</span>
                          <span className="info-value">{ride.passengers}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">💰 Total Price:</span>
                          <span className="info-value">₹{ride.totalPrice}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">🚗 Driver:</span>
                          <span className="info-value">{ride.driver}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">⭐ Rating:</span>
                          <span className="info-value">{ride.driverRating}/5</span>
                        </div>
                      </div>
                      
                      {ride.notes && (
                        <div className="ride-notes">
                          <strong>📝 Notes:</strong> {ride.notes}
                        </div>
                      )}
                      
                      <div className="booking-meta">
                        <small>Booked on: {ride.bookingDate}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function UserSettings({ user, onClose, onUpdate }) {
  const [settings, setSettings] = useState({
    fullName: user.fullName || user.username || '',
    phone: user.phone || '',
    vehicle: user.vehicle || '',
    notifications: user.notifications !== false // default to true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...user, ...settings });
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>⚙️ User Settings</h2>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              value={settings.fullName}
              onChange={(e) => setSettings({...settings, fullName: e.target.value})}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
            />
          </div>
          
          <div className="form-group">
            <label>Vehicle Details:</label>
            <input
              type="text"
              value={settings.vehicle}
              onChange={(e) => setSettings({...settings, vehicle: e.target.value})}
              placeholder="e.g., Honda City (White) KA-01-XX-XXXX"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              />
              <span className="checkmark"></span>
              Enable ride notifications
            </label>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="save-btn">💾 Save Settings</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OfferRidePage({ user, onClose, onOfferRide }) {
  const [newRide, setNewRide] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: "",
    price: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const ride = {
      ...newRide,
      id: Date.now(),
      status: "Upcoming",
      driver: user.fullName || user.username,
      vehicle: user.vehicle || "Vehicle details not provided",
      driverRating: 4.8,
      estimatedDuration: "30 mins"
    };
    onOfferRide(ride);
    setNewRide({
      from: "",
      to: "",
      date: "",
      time: "",
      seats: "",
      price: "",
      notes: ""
    });
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>🚗 Offer a Ride</h2>
        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-row">
            <div className="form-group">
              <label>From:</label>
              <input
                type="text"
                value={newRide.from}
                onChange={(e) => setNewRide({...newRide, from: e.target.value})}
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div className="form-group">
              <label>To:</label>
              <input
                type="text"
                value={newRide.to}
                onChange={(e) => setNewRide({...newRide, to: e.target.value})}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={newRide.date}
                onChange={(e) => setNewRide({...newRide, date: e.target.value})}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input
                type="time"
                value={newRide.time}
                onChange={(e) => setNewRide({...newRide, time: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Available Seats:</label>
              <input
                type="number"
                value={newRide.seats}
                onChange={(e) => setNewRide({...newRide, seats: e.target.value})}
                placeholder="Number of seats"
                required
                min="1"
                max="8"
              />
            </div>
            <div className="form-group">
              <label>Price per seat (₹):</label>
              <input
                type="number"
                value={newRide.price}
                onChange={(e) => setNewRide({...newRide, price: e.target.value})}
                required
                min="10"
                max="500"
                placeholder="e.g., 50"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Additional Notes:</label>
            <textarea
              value={newRide.notes}
              onChange={(e) => setNewRide({...newRide, notes: e.target.value})}
              placeholder="e.g., AC vehicle, no smoking, music allowed..."
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="offer-btn">🚀 Offer Ride</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FindRidePage({ onClose, onFindRide, availableRides }) {
  const [searchRide, setSearchRide] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1"
  });
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const filteredRides = availableRides.filter(ride => {
      const fromMatch = ride.from.toLowerCase().includes(searchRide.from.toLowerCase());
      const toMatch = ride.to.toLowerCase().includes(searchRide.to.toLowerCase());
      const dateMatch = !searchRide.date || ride.date === searchRide.date;
      const seatsMatch = ride.seats >= parseInt(searchRide.passengers);
      return fromMatch && toMatch && dateMatch && seatsMatch;
    });

    filteredRides.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`);
      const timeB = new Date(`${b.date} ${b.time}`);
      return timeA - timeB;
    });

    setSearchResults(filteredRides);
    setShowResults(true);
  };

  const handleBookRide = (ride) => {
    onFindRide(ride, parseInt(searchRide.passengers));
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal-container find-ride-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>🔍 Find a Ride</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>From:</label>
              <input
                type="text"
                value={searchRide.from}
                onChange={(e) => setSearchRide({...searchRide, from: e.target.value})}
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div className="form-group">
              <label>To:</label>
              <input
                type="text"
                value={searchRide.to}
                onChange={(e) => setSearchRide({...searchRide, to: e.target.value})}
                placeholder="Enter destination"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={searchRide.date}
                onChange={(e) => setSearchRide({...searchRide, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Passengers:</label>
              <input
                type="number"
                value={searchRide.passengers}
                onChange={(e) => setSearchRide({...searchRide, passengers: e.target.value})}
                placeholder="Number of passengers"
                min="1"
                max="8"
              />
            </div>
          </div>
          <button type="submit" className="search-btn">🔍 Search Rides</button>
        </form>

        {showResults && (
          <div className="search-results">
            <h3>Available Rides ({searchResults.length})</h3>
            {searchResults.length === 0 ? (
              <div className="no-results">
                <p>😔 No rides found matching your criteria.</p>
                <p>Try adjusting your search parameters.</p>
              </div>
            ) : (
              <div className="rides-list">
                {searchResults.map(ride => (
                  <div key={ride.id} className="ride-card">
                    <div className="ride-header">
                      <div className="ride-route">
                        <span className="from">{ride.from}</span>
                        <span className="arrow">→</span>
                        <span className="to">{ride.to}</span>
                      </div>
                      <div className="ride-price">₹{ride.price}</div>
                    </div>
                    <div className="ride-details">
                      <div className="ride-info">
                        <p><strong>🚗 Driver:</strong> {ride.driver}</p>
                        <p><strong>📅 Date:</strong> {ride.date}</p>
                        <p><strong>🕐 Time:</strong> {ride.time}</p>
                        <p><strong>💺 Available:</strong> {ride.seats} seats</p>
                        <p><strong>⭐ Rating:</strong> {ride.driverRating}/5</p>
                        {ride.notes && <p><strong>📝 Notes:</strong> {ride.notes}</p>}
                      </div>
                      <button 
                        onClick={() => handleBookRide(ride)}
                        className="book-btn"
                        disabled={ride.seats < parseInt(searchRide.passengers)}
                      >
                        🎫 Book Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <div className="input-wrapper">
            <span className="input-icon">👤</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
        </div>
        <div>
          <label>Password:</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
            />
          </div>
        </div>
        {error && <p className="error">❌ {error}</p>}
        <button type="submit" className="login-btn">🚀 Login</button>
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
      <h2>� Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <div className="input-wrapper">
            <span className="input-icon">🆔</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
            />
          </div>
        </div>
        <div>
          <label>Password:</label>
          <div className="input-wrapper">
            <span className="input-icon">�</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>
        </div>
        <div>
          <label>Confirm Password:</label>
          <div className="input-wrapper">
            <span className="input-icon">�</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {error && <p className="error">❌ {error}</p>}
        {success && <p className="success">✅ {success}</p>}
        <button type="submit" className="login-btn">� Join Now</button>
      </form>
      {success && (
        <div className="registration-success">
          <div>
            <h3>🎉 Registration Successful!</h3>
            <p>✨ Redirecting to login...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  console.log("Simple App component is rendering...");
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  
  // Additional states for the main app
  const [showSettings, setShowSettings] = useState(false);
  const [showOfferRide, setShowOfferRide] = useState(false);
  const [showFindRide, setShowFindRide] = useState(false);
  const [showMyRides, setShowMyRides] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [myRideHistory, setMyRideHistory] = useState([]);
  const [availableRides, setAvailableRides] = useState([
    {
      id: 1,
      from: "City Center",
      to: "University",
      date: "2025-08-05",
      time: "14:30",
      price: 50,
      seats: 2,
      status: "Upcoming",
      driver: "John Doe",
      vehicle: "Honda City (White) KA-01-XX-XXXX",
      notes: "AC vehicle, music allowed",
      driverRating: 4.8,
      estimatedDuration: "25 mins"
    },
    {
      id: 2,
      from: "Mall",
      to: "Tech Park",
      date: "2025-08-05",
      time: "15:00",
      price: 40,
      seats: 3,
      status: "Upcoming",
      driver: "Jane Smith",
      vehicle: "Toyota Innova (Silver) KA-02-YY-YYYY",
      notes: "Pets allowed, no smoking",
      driverRating: 4.9,
      estimatedDuration: "30 mins"
    },
    {
      id: 3,
      from: "Airport",
      to: "City Center",
      date: "2025-08-05",
      time: "16:15",
      price: 75,
      seats: 4,
      status: "Upcoming",
      driver: "Michael Chen",
      vehicle: "Kia Carnival (Black) KA-03-ZZ-ZZZZ",
      notes: "Luggage space available, AC vehicle",
      driverRating: 4.7,
      estimatedDuration: "45 mins"
    }
  ]);
  
  console.log("User state:", user);
  console.log("Is registering:", isRegistering);

  const handleRegistration = (userData) => {
    const registeredData = {
      username: userData.username,
      password: userData.password
    };
    setRegisteredUser(registeredData);
    setIsRegistering(false);
  };

  const handleOfferRide = (ride) => {
    setAvailableRides([...availableRides, ride]);
    setShowOfferRide(false);
  };

  const handleFindRide = (ride, passengers) => {
    // Create booking record
    const booking = {
      id: Date.now(),
      rideId: ride.id,
      from: ride.from,
      to: ride.to,
      date: ride.date,
      time: ride.time,
      price: ride.price,
      passengers: passengers,
      totalPrice: ride.price * passengers,
      driver: ride.driver,
      vehicle: ride.vehicle,
      driverRating: ride.driverRating,
      bookingDate: new Date().toLocaleDateString(),
      status: "Booked",
      notes: ride.notes || ""
    };
    
    // Add to ride history
    setMyRideHistory(prevHistory => [booking, ...prevHistory]);
    
    // Update available seats
    const updatedRides = availableRides.map(r => {
      if (r.id === ride.id) {
        return { ...r, seats: r.seats - passengers };
      }
      return r;
    });
    setAvailableRides(updatedRides);
    
    // Show success message
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
    setShowFindRide(false);
  };

  if (user) {
    console.log("User is logged in, showing main dashboard");
    return (
      <>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        
        {bookingSuccess && (
          <div className="booking-success">
            🎉 Ride booked successfully! Have a great journey!
          </div>
        )}
        
        <div className="main-dashboard">
          {/* Header with navigation */}
          <header className="dashboard-header">
            <div className="header-left">
              <h1 className="dashboard-title">🚗 Share Ride</h1>
              <p className="welcome-text">Welcome back, {user.fullName || user.username}!</p>
            </div>
            <div className="header-right">
              <button 
                className="settings-btn"
                onClick={() => setShowSettings(true)}
              >
                ⚙️ Settings
              </button>
              <button 
                className="logout-btn"
                onClick={() => setUser(null)}
              >
                🚪 Logout
              </button>
            </div>
          </header>

          {/* Main action buttons */}
          <div className="action-cards">
            <div className="action-card" onClick={() => setShowOfferRide(true)}>
              <div className="card-icon">🚗</div>
              <h3>Offer a Ride</h3>
              <p>Share your journey and earn money</p>
            </div>
            
            <div className="action-card" onClick={() => setShowFindRide(true)}>
              <div className="card-icon">🔍</div>
              <h3>Find a Ride</h3>
              <p>Book affordable rides to your destination</p>
            </div>
            
            <div className="action-card" onClick={() => setShowMyRides(true)}>
              <div className="card-icon">📊</div>
              <h3>My Rides</h3>
              <p>View your ride history and upcoming trips</p>
            </div>
          </div>

          {/* Recent rides section */}
          <div className="recent-rides">
            <h2>🚀 Available Rides</h2>
            <div className="rides-grid">
              {availableRides.slice(0, 6).map(ride => (
                <div key={ride.id} className="ride-card-mini">
                  <div className="ride-route-mini">
                    <span className="from">{ride.from}</span>
                    <span className="arrow">→</span>
                    <span className="to">{ride.to}</span>
                  </div>
                  <div className="ride-meta">
                    <span className="price">₹{ride.price}</span>
                    <span className="seats">{ride.seats} seats</span>
                    <span className="time">{ride.time}</span>
                  </div>
                  <div className="driver-info">
                    <span>🚗 {ride.driver}</span>
                    <span className="rating">⭐ {ride.driverRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showMyRides && (
          <MyRides 
            user={user}
            onClose={() => setShowMyRides(false)}
            rideHistory={myRideHistory}
          />
        )}
        
        {showSettings && (
          <UserSettings 
            user={user}
            onClose={() => setShowSettings(false)}
            onUpdate={(updatedData) => {
              setUser(updatedData);
              setShowSettings(false);
            }}
          />
        )}
        
        {showOfferRide && (
          <OfferRidePage 
            user={user}
            onClose={() => setShowOfferRide(false)}
            onOfferRide={handleOfferRide}
          />
        )}
        
        {showFindRide && (
          <FindRidePage 
            onClose={() => setShowFindRide(false)}
            onFindRide={handleFindRide}
            availableRides={availableRides}
          />
        )}
      </>
    );
  }

  console.log("User is not logged in, showing login/register page");
  return (
    <>
      <div className="bubble"></div>
      <div className="bubble"></div>  
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="app-container">
        {/* Enhanced Header Section */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">🚗</div>
              <h1 className="app-title">Share Ride<span className="underline"></span></h1>
              <p className="app-tagline">Your journey, shared with care</p>
            </div>
            <div className="header-decorations">
              <div className="decoration-dot"></div>
              <div className="decoration-dot"></div>
              <div className="decoration-dot"></div>
            </div>
          </div>
        </header>
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
