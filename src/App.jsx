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

function ProfilePage({ user, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    vehicle: user.vehicle || '',
    licenseNumber: user.licenseNumber || '',
    preferredRoutes: user.preferredRoutes || '',
    about: user.about || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...user, ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>👤 My Profile</h2>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                required
                pattern="[0-9]{10}"
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>Vehicle Details:</label>
              <input
                type="text"
                value={profileData.vehicle}
                onChange={(e) => setProfileData({...profileData, vehicle: e.target.value})}
                placeholder="e.g., Honda City (White) KA-01-XX-XXXX"
              />
            </div>
            <div className="form-group">
              <label>License Number:</label>
              <input
                type="text"
                value={profileData.licenseNumber}
                onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Preferred Routes:</label>
              <textarea
                value={profileData.preferredRoutes}
                onChange={(e) => setProfileData({...profileData, preferredRoutes: e.target.value})}
                placeholder="e.g., City Center ↔️ Tech Park, University ↔️ Mall"
                rows="2"
              />
            </div>
            <div className="form-group">
              <label>About Me:</label>
              <textarea
                value={profileData.about}
                onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                placeholder="Tell others about yourself..."
                rows="3"
              />
            </div>
            <div className="profile-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <p><strong>Full Name:</strong> {profileData.fullName || 'Not set'}</p>
              <p><strong>Email:</strong> {profileData.email || 'Not set'}</p>
              <p><strong>Phone:</strong> {profileData.phone || 'Not set'}</p>
              <p><strong>Address:</strong> {profileData.address || 'Not set'}</p>
            </div>
            
            <div className="profile-section">
              <h3>Driver Information</h3>
              <p><strong>Vehicle:</strong> {profileData.vehicle || 'Not set'}</p>
              <p><strong>License Number:</strong> {profileData.licenseNumber || 'Not set'}</p>
            </div>

            <div className="profile-section">
              <h3>Preferences</h3>
              <p><strong>Preferred Routes:</strong> {profileData.preferredRoutes || 'Not set'}</p>
              <p><strong>About Me:</strong> {profileData.about || 'Not set'}</p>
            </div>

            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <span className="icon">✏️</span> Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showOfferRide, setShowOfferRide] = useState(false);
  const [showFindRide, setShowFindRide] = useState(false);
  const [showMyRides, setShowMyRides] = useState(false);
  const [activeRidesTab, setActiveRidesTab] = useState('upcoming');
  const [rideHistory, setRideHistory] = useState([
    {
      id: 1,
      date: "2025-08-01",
      time: "09:30",
      from: "City Center",
      to: "Tech Park",
      amount: 45,
      status: "completed",
      driver: "John Doe",
      vehicle: "Honda City (White)",
      passengers: 2,
      rating: 4.5,
      paymentMethod: "Card ending in 4242"
    },
    {
      id: 2,
      date: "2025-07-28",
      time: "14:15",
      from: "Mall",
      to: "University",
      amount: 35,
      status: "cancelled",
      refunded: true,
      driver: "Jane Smith",
      vehicle: "Toyota Innova (Silver)",
      cancellationReason: "Heavy traffic delay"
    },
    {
      id: 3,
      date: "2025-07-25",
      time: "11:00",
      from: "Airport",
      to: "Hotel Zone",
      amount: 60,
      status: "completed",
      driver: "Mike Wilson",
      vehicle: "Hyundai Creta (Black)",
      passengers: 1,
      rating: 5,
      paymentMethod: "Digital Wallet"
    }
  ]);
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
      notes: "AC vehicle, music allowed"
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
      notes: "Pets allowed, no smoking"
    }
  ]);

  const [newRide, setNewRide] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: "",
    price: "",
    notes: ""
  });

  const [searchRide, setSearchRide] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1"
  });

  const handleOfferRide = (e) => {
    e.preventDefault();
    const ride = {
      ...newRide,
      id: availableRides.length + 1,
      status: "Upcoming",
      driver: user.fullName || user.username,
      vehicle: user.vehicle || "Vehicle details not provided"
    };
    setAvailableRides([...availableRides, ride]);
    setNewRide({
      from: "",
      to: "",
      date: "",
      time: "",
      seats: "",
      price: "",
      notes: ""
    });
    setShowOfferRide(false);
  };

  const handleFindRide = (e) => {
    e.preventDefault();
    // Implement ride search logic here
    setShowFindRide(false);
  };

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastBookedId, setLastBookedId] = useState(null);

  const handleBookRide = (ride) => {
    if (ride.seats <= 0) return;

    // Create a new booking entry
    const booking = {
      id: rideHistory.length + 1,
      date: ride.date,
      time: ride.time,
      from: ride.from,
      to: ride.to,
      amount: ride.price,
      status: "upcoming",
      driver: ride.driver,
      vehicle: ride.vehicle,
      passengers: 1,
      paymentMethod: "Card",
      bookingDate: new Date().toISOString().split('T')[0]
    };

    // Add to ride history
    setRideHistory([booking, ...rideHistory]);

    // Update available seats in the ride
    const updatedRides = availableRides.map(r => {
      if (r.id === ride.id) {
        return { ...r, seats: r.seats - 1 };
      }
      return r;
    });
    setAvailableRides(updatedRides);
    setLastBookedId(ride.id);
    
    // Show success message with animation
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 3000);
  };

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
        {bookingSuccess && (
          <div className="booking-success">
            Ride booked successfully! Check "My Rides" for details
          </div>
        )}
        <div className="welcome-container">
          <div className="user-display">
            <span className="welcome-text">Welcome,</span>
            <span className="username">{user.username}</span>
          </div>
          <h2>🚗 Share Your Ride – Save Time, Money & the Planet!</h2>
          
          <div className="ride-actions">
            <button className="action-btn offer-ride" onClick={() => setShowOfferRide(true)}>
              <span className="icon">🚙</span>
              Offer a Ride
            </button>
            <button className="action-btn find-ride" onClick={() => setShowFindRide(true)}>
              <span className="icon">🔍</span>
              Find a Ride
            </button>
          </div>

          {!showOfferRide && !showFindRide && (
            <div className="welcome-content">
              <div className="available-rides">
                <h3>🚗 Available Rides Nearby</h3>
                <div className="ride-cards">
                  {availableRides.map((ride, index) => (
                    <div className={`ride-item ${lastBookedId === ride.id ? 'new-booking' : ''}`} key={index}>
                      <div className="ride-header">
                        <div className="ride-date">{ride.date}</div>
                        <span className={`seats-indicator ${
                          ride.seats > 2 ? 'available' : ride.seats > 0 ? 'limited' : 'full'
                        }`}>
                          {ride.seats} {ride.seats === 1 ? 'seat' : 'seats'} left
                        </span>
                      </div>
                      <div className="ride-details">
                        <div className="ride-detail-item">
                          <span className="detail-icon">🚗</span>
                          <div className="detail-content">
                            <div className="detail-label">Route</div>
                            <div className="detail-value">{ride.from} → {ride.to}</div>
                          </div>
                        </div>
                        <div className="ride-detail-item">
                          <span className="detail-icon">🕒</span>
                          <div className="detail-content">
                            <div className="detail-label">Departure</div>
                            <div className="detail-value">{ride.time}</div>
                          </div>
                        </div>
                        <div className="ride-detail-item">
                          <span className="detail-icon">💰</span>
                          <div className="detail-content">
                            <div className="detail-label">Price per seat</div>
                            <div className="detail-value">₹{ride.price}</div>
                          </div>
                        </div>
                        <div className="ride-detail-item">
                          <span className="detail-icon">💺</span>
                          <div className="detail-content">
                            <div className="detail-label">Available Seats</div>
                            <div className="detail-value">{ride.seats} seats</div>
                          </div>
                        </div>
                        <div className="ride-detail-item">
                          <span className="detail-icon">👤</span>
                          <div className="detail-content">
                            <div className="detail-label">Driver</div>
                            <div className="detail-value">{ride.driver}</div>
                          </div>
                        </div>
                        <div className="ride-detail-item">
                          <span className="detail-icon">🚘</span>
                          <div className="detail-content">
                            <div className="detail-label">Vehicle</div>
                            <div className="detail-value">{ride.vehicle}</div>
                          </div>
                        </div>
                      </div>
                      <div className="ride-actions">
                        <button className="ride-action-btn action-view">View Details</button>
                        <button 
                          className="ride-action-btn action-cancel"
                          onClick={() => handleBookRide(ride)}
                          disabled={ride.seats === 0}
                        >
                          {ride.seats > 0 ? 'Book Now' : 'Fully Booked'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showOfferRide && (
            <div className="offer-ride-form">
              <h3>Offer a New Ride</h3>
              <form onSubmit={handleOfferRide} className="ride-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>From</label>
                    <input
                      type="text"
                      required
                      placeholder="Starting point"
                      value={newRide.from}
                      onChange={(e) => setNewRide({...newRide, from: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <input
                      type="text"
                      required
                      placeholder="Destination"
                      value={newRide.to}
                      onChange={(e) => setNewRide({...newRide, to: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={newRide.date}
                      onChange={(e) => setNewRide({...newRide, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      required
                      value={newRide.time}
                      onChange={(e) => setNewRide({...newRide, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Available Seats</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={newRide.seats}
                      onChange={(e) => setNewRide({...newRide, seats: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price per Seat (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newRide.price}
                      onChange={(e) => setNewRide({...newRide, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Any specific details about the ride..."
                    value={newRide.notes}
                    onChange={(e) => setNewRide({...newRide, notes: e.target.value})}
                  ></textarea>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-ride-btn">Offer Ride</button>
                  <button type="button" className="cancel-ride-btn" onClick={() => setShowOfferRide(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {showFindRide && (
            <div className="find-ride-form">
              <h3>Find a Ride</h3>
              <form onSubmit={handleFindRide} className="ride-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>From</label>
                    <input
                      type="text"
                      required
                      placeholder="Starting point"
                      value={searchRide.from}
                      onChange={(e) => setSearchRide({...searchRide, from: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>To</label>
                    <input
                      type="text"
                      required
                      placeholder="Destination"
                      value={searchRide.to}
                      onChange={(e) => setSearchRide({...searchRide, to: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={searchRide.date}
                      onChange={(e) => setSearchRide({...searchRide, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Passengers</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={searchRide.passengers}
                      onChange={(e) => setSearchRide({...searchRide, passengers: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-ride-btn">Search Rides</button>
                  <button type="button" className="cancel-ride-btn" onClick={() => setShowFindRide(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="action-buttons">
            <button className="profile-btn" onClick={() => setShowProfile(true)}>
              <span className="icon">👤</span>
              My Profile
            </button>
            <button className="my-rides-btn" onClick={() => setShowMyRides(true)}>
              <span className="icon">🚗</span>
              My Rides
            </button>
            {showMyRides && (
              <div className="profile-overlay">
                <div className="profile-container">
                  <button className="close-btn" onClick={() => setShowMyRides(false)}>×</button>
                  <h2>🚗 My Rides</h2>
                  
                  <div className="rides-tabs">
                    <button 
                      className={`rides-tab ${activeRidesTab === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveRidesTab('upcoming')}
                    >
                      <span className="icon">📅</span> Upcoming
                    </button>
                    <button 
                      className={`rides-tab ${activeRidesTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveRidesTab('history')}
                    >
                      <span className="icon">📖</span> History
                    </button>
                  </div>

                  {activeRidesTab === 'history' ? (
                    <div className="ride-history">
                      <div className="history-timeline">
                        {rideHistory.length > 0 ? (
                          rideHistory.map((ride) => (
                            <div key={ride.id} className={`history-item ${ride.status}`}>
                              <div className="history-header">
                                <span className="history-date">
                                  {new Date(ride.date).toLocaleDateString('en-US', { 
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })} - {ride.time}
                                </span>
                                <span className={`history-amount ${ride.refunded ? 'refunded' : ''}`}>
                                  {ride.refunded ? '- ' : ''}₹{ride.amount}
                                </span>
                              </div>
                              
                              <div className="history-details">
                                <div className="history-detail">
                                  <div className="history-detail-icon">🚗</div>
                                  <div className="history-detail-content">
                                    <div className="history-detail-label">Route</div>
                                    <div className="history-detail-value">{ride.from} → {ride.to}</div>
                                  </div>
                                </div>
                                
                                <div className="history-detail">
                                  <div className="history-detail-icon">👤</div>
                                  <div className="history-detail-content">
                                    <div className="history-detail-label">Driver</div>
                                    <div className="history-detail-value">{ride.driver}</div>
                                  </div>
                                </div>

                                <div className="history-detail">
                                  <div className="history-detail-icon">🚘</div>
                                  <div className="history-detail-content">
                                    <div className="history-detail-label">Vehicle</div>
                                    <div className="history-detail-value">{ride.vehicle}</div>
                                  </div>
                                </div>

                                {ride.status === 'completed' && (
                                  <div className="history-detail">
                                    <div className="history-detail-icon">⭐</div>
                                    <div className="history-detail-content">
                                      <div className="history-detail-label">Rating</div>
                                      <div className="history-detail-value">{ride.rating} / 5</div>
                                    </div>
                                  </div>
                                )}

                                {ride.status === 'cancelled' && (
                                  <div className="history-detail">
                                    <div className="history-detail-icon">ℹ️</div>
                                    <div className="history-detail-content">
                                      <div className="history-detail-label">Cancellation Reason</div>
                                      <div className="history-detail-value">{ride.cancellationReason}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="history-actions">
                                <button className="history-action-btn action-receipt">
                                  <span className="icon">📄</span> Receipt
                                </button>
                                <button className="history-action-btn action-report">
                                  <span className="icon">🚩</span> Report Issue
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="history-empty">
                            <div className="history-empty-icon">📭</div>
                            <p>No ride history available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="ride-list">
                      {/* Upcoming rides will be shown here */}
                      {availableRides.map((ride) => (
                        <div key={ride.id} className="ride-item">
                          <div className="ride-header">
                            <span className="ride-date">
                              {new Date(ride.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })} - {ride.time}
                            </span>
                            <span className="ride-status status-upcoming">
                              {ride.seats} seats left
                            </span>
                          </div>
                          
                          <div className="ride-details">
                            <div className="ride-detail-item">
                              <span className="detail-icon">🚗</span>
                              <div className="detail-content">
                                <div className="detail-label">Route</div>
                                <div className="detail-value">{ride.from} → {ride.to}</div>
                              </div>
                            </div>

                            <div className="ride-detail-item">
                              <span className="detail-icon">👤</span>
                              <div className="detail-content">
                                <div className="detail-label">Driver</div>
                                <div className="detail-value">{ride.driver}</div>
                              </div>
                            </div>

                            <div className="ride-detail-item">
                              <span className="detail-icon">🚘</span>
                              <div className="detail-content">
                                <div className="detail-label">Vehicle</div>
                                <div className="detail-value">{ride.vehicle}</div>
                              </div>
                            </div>

                            <div className="ride-detail-item">
                              <span className="detail-icon">💰</span>
                              <div className="detail-content">
                                <div className="detail-label">Price per seat</div>
                                <div className="detail-value">₹{ride.price}</div>
                              </div>
                            </div>
                          </div>

                          <div className="ride-actions">
                            <button 
                              className="ride-action-btn action-view"
                              onClick={() => handleBookRide(ride)}
                              disabled={ride.seats === 0}
                            >
                              {ride.seats > 0 ? 'Book Now' : 'Fully Booked'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <button className="logout-btn" onClick={() => {
              setUser(null);
              setIsRegistering(false);
            }}>
              <span className="icon">🚪</span>
              Logout
            </button>
          </div>
          {showProfile && (
            <ProfilePage 
              user={user}
              onClose={() => setShowProfile(false)}
              onUpdate={(updatedData) => {
                setUser(updatedData);
                setShowProfile(false);
              }}
            />
          )}
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
