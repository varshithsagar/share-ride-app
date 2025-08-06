import React, { useState, useEffect } from 'react';
import './App.css';

function MyRides({ user, onClose, rideHistory, onCancelRide, onContactPassenger, onSendRideStartMessage, onNavigateToPassenger, onTrackDriver }) {
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
                <div className="stat-card">
                  <span className="stat-number">{rideHistory.filter(ride => ride.status === 'Completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{rideHistory.filter(ride => ride.status === 'Cancelled').length}</span>
                  <span className="stat-label">Cancelled</span>
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
                        <div className="info-item">
                          <span className="info-label">🚙 Vehicle:</span>
                          <span className="info-value">{ride.vehicle || 'Not specified'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">⏱️ Duration:</span>
                          <span className="info-value">{ride.estimatedDuration || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">💺 Available Seats:</span>
                          <span className="info-value">{ride.seats || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">📞 Contact:</span>
                          <span className="info-value">{user.phone || 'Not provided'}</span>
                        </div>
                      </div>
                      
                      {ride.notes && (
                        <div className="ride-notes">
                          <strong>📝 Ride Notes:</strong> {ride.notes}
                        </div>
                      )}
                      
                      {ride.pickupPoint && (
                        <div className="ride-notes">
                          <strong>📍 Pickup Point:</strong> {ride.pickupPoint}
                        </div>
                      )}
                      
                      {ride.paymentMethod && (
                        <div className="ride-notes">
                          <strong>💳 Payment Method:</strong> {ride.paymentMethod}
                        </div>
                      )}
                      
                      <div className="booking-meta">
                        <small>🗓️ Booked on: {ride.bookingDate}</small>
                        {ride.bookingId && <small> | 📋 Booking ID: {ride.bookingId}</small>}
                        {ride.cancelledDate && (
                          <small> 
                            | ❌ Cancelled on: {ride.cancelledDate}
                            {ride.cancelledTime && ` at ${ride.cancelledTime}`}
                            {ride.cancellationReason && (
                              <span className="cancellation-reason"> ({ride.cancellationReason})</span>
                            )}
                          </small>
                        )}
                      </div>
                      
                      {(ride.status === 'Booked' || ride.status === 'Confirmed' || !ride.status) && (
                        <div className="ride-actions">
                          <button 
                            className="action-btn contact-btn"
                            onClick={() => onContactPassenger(ride)}
                          >
                            📞 Contact via WhatsApp
                          </button>
                          <button 
                            className="action-btn start-ride-btn"
                            onClick={() => onSendRideStartMessage(ride)}
                          >
                            🚀 Start Ride & Notify
                          </button>
                          <button 
                            className="action-btn cancel-btn"
                            onClick={() => onCancelRide(ride.id)}
                            title="Cancel ride instantly - No confirmation needed"
                          >
                            ❌ Cancel Ride
                          </button>
                        </div>
                      )}

                      {ride.status === 'In Progress' && (
                        <div className="ride-actions">
                          <button 
                            className="action-btn contact-btn"
                            onClick={() => onContactPassenger(ride)}
                          >
                            📞 Contact via WhatsApp
                          </button>
                          {/* NEW: Navigate to Passenger */}
                          <button 
                            className="action-btn navigate-btn"
                            onClick={(e) => {
                              e.target.textContent = '🔄 Opening Navigation...';
                              e.target.disabled = true;
                              onNavigateToPassenger(ride);
                              setTimeout(() => {
                                e.target.textContent = '🗺️ Navigate to Pickup';
                                e.target.disabled = false;
                              }, 2000);
                            }}
                            title="Open Google Maps navigation to passenger pickup location"
                          >
                            🗺️ Navigate to Pickup
                          </button>
                          {/* Passenger can cancel before pickup */}
                          <button 
                            className="action-btn cancel-before-pickup-btn"
                            onClick={() => onCancelRide(ride.id)}
                            title="Cancel ride instantly - Driver notified automatically via WhatsApp"
                          >
                            🚫 Cancel & Notify Driver
                          </button>
                          <div className="ride-status-info">
                            <span className="status-text">🚀 Ride Started at: {ride.startedAt}</span>
                            <p className="cancel-notice">💡 Click to cancel instantly - Driver gets WhatsApp notification</p>
                            {/* NEW: Track driver location button for passengers */}
                            <button 
                              className="action-btn track-driver-btn"
                              onClick={(e) => {
                                e.target.textContent = '🔄 Opening Maps...';
                                e.target.disabled = true;
                                onTrackDriver(ride);
                                setTimeout(() => {
                                  e.target.textContent = '📍 Track Route';
                                  e.target.disabled = false;
                                }, 2000);
                              }}
                              title="Open Google Maps to see route to destination"
                            >
                              📍 Track Route
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {ride.status === 'Completed' && (
                        <div className="payment-history">
                          <h4 className="payment-title">💳 Payment Details</h4>
                          <div className="payment-info">
                            <div className="payment-row">
                              <span className="payment-label">Total Amount:</span>
                              <span className="payment-value">₹{ride.totalPrice}</span>
                            </div>
                            <div className="payment-row">
                              <span className="payment-label">Payment Method:</span>
                              <span className="payment-value">{ride.paymentMethod}</span>
                            </div>
                            <div className="payment-row">
                              <span className="payment-label">Payment Date:</span>
                              <span className="payment-value">{ride.bookingDate}</span>
                            </div>
                            <div className="payment-row">
                              <span className="payment-label">Transaction ID:</span>
                              <span className="payment-value">{ride.bookingId}</span>
                            </div>
                            <div className="payment-row">
                              <span className="payment-label">Status:</span>
                              <span className="payment-value payment-completed">✅ Payment Completed</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {ride.status === 'Completed' && !ride.reviewed && (
                        <div className="ride-actions">
                          <button className="action-btn review-btn">⭐ Rate & Review</button>
                        </div>
                      )}
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
    pickupLocation: user.pickupLocation || '',
    destination: user.destination || '',
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
        
        <form onSubmit={handleSubmit} className="profile-form settings-form">
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
          
          <div className="form-group">
            <label>📍 Preferred Pickup Location:</label>
            <input
              type="text"
              value={settings.pickupLocation}
              onChange={(e) => setSettings({...settings, pickupLocation: e.target.value})}
              placeholder="Enter your pickup location"
              className="location-input"
            />
          </div>
          
          <div className="form-group">
            <label>🎯 Preferred Destination:</label>
            <input
              type="text"
              value={settings.destination}
              onChange={(e) => setSettings({...settings, destination: e.target.value})}
              placeholder="Enter your destination"
              className="location-input"
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

function QuickRidePage({ onClose, onQuickBook, availableRides, user }) {
  const [quickSearch, setQuickSearch] = useState({
    from: "",
    to: "",
    passengers: "1"
  });
  const [quickResults, setQuickResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Get rides available today for quick booking
  const getCurrentTimeRides = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    const today = now.toISOString().split('T')[0];

    return availableRides
      .filter(ride => {
        if (ride.date !== today) return false;
        
        const [hours, minutes] = ride.time.split(':').map(Number);
        const rideTime = hours * 60 + minutes;
        
        // Show all rides available today that haven't started yet
        return rideTime >= currentTime;
      })
      .sort((a, b) => {
        // Sort by time - earliest first for quick booking
        const timeA = a.time.replace(':', '');
        const timeB = b.time.replace(':', '');
        return timeA - timeB;
      });
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    
    const quickAvailableRides = getCurrentTimeRides();
    
    const filteredRides = quickAvailableRides.filter(ride => {
      const fromMatch = ride.from.toLowerCase().includes(quickSearch.from.toLowerCase());
      const toMatch = ride.to.toLowerCase().includes(quickSearch.to.toLowerCase());
      const seatsMatch = ride.seats >= parseInt(quickSearch.passengers);
      return fromMatch && toMatch && seatsMatch;
    });

    // Sort by time (earliest first)
    filteredRides.sort((a, b) => {
      const timeA = a.time.replace(':', '');
      const timeB = b.time.replace(':', '');
      return timeA - timeB;
    });

    setQuickResults(filteredRides);
    setShowResults(true);
  };

  const handleQuickBook = (ride) => {
    console.log("Quick book clicked for ride:", ride.id, "passengers:", quickSearch.passengers);
    const passengerCount = parseInt(quickSearch.passengers) || 1; // Ensure we have a valid number
    onQuickBook(ride, passengerCount);
    onClose();
  };

  const allQuickRides = getCurrentTimeRides();

  return (
    <div className="overlay">
      <div className="modal-container quick-ride-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>⚡ Quick Ride - Book Now!</h2>
        <p className="quick-ride-desc">� Rides available today for instant booking</p>
        
        <form onSubmit={handleQuickSearch} className="quick-search-form">
          <div className="form-row">
            <div className="form-group">
              <label>From:</label>
              <input
                type="text"
                value={quickSearch.from}
                onChange={(e) => setQuickSearch({...quickSearch, from: e.target.value})}
                placeholder="Current location"
                required
              />
            </div>
            <div className="form-group">
              <label>To:</label>
              <input
                type="text"
                value={quickSearch.to}
                onChange={(e) => setQuickSearch({...quickSearch, to: e.target.value})}
                placeholder="Where to?"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Passengers:</label>
              <input
                type="number"
                value={quickSearch.passengers}
                onChange={(e) => setQuickSearch({...quickSearch, passengers: e.target.value})}
                min="1"
                max="8"
              />
            </div>
            <button type="submit" className="quick-search-btn">⚡ Find Quick Rides</button>
          </div>
        </form>

        {/* Show all available quick rides by default */}
        <div className="quick-rides-section">
          <h3>🚀 Available Now ({allQuickRides.length})</h3>
          {allQuickRides.length === 0 ? (
            <div className="no-quick-rides">
              <p>😔 No rides available today for quick booking.</p>
              <p>Try offering a ride or check "Find Ride" for future trips.</p>
            </div>
          ) : (
            <div className="quick-rides-list">
              {allQuickRides.map(ride => (
                <div key={ride.id} className="quick-ride-card">
                  <div className="quick-ride-header">
                    <div className="ride-route">
                      <span className="from">{ride.from}</span>
                      <span className="arrow">→</span>
                      <span className="to">{ride.to}</span>
                    </div>
                    <div className="ride-time-urgent">
                      <span className="time">🕐 {ride.time}</span>
                      <span className="urgent-badge">QUICK</span>
                    </div>
                  </div>
                  <div className="quick-ride-details">
                    <div className="ride-info-quick">
                      <span><strong>🚗 Driver:</strong> {ride.driver}</span>
                      <span><strong>💺 Available:</strong> {ride.seats} seats</span>
                      <span><strong>💰 Price:</strong> ₹{ride.price}</span>
                      <span><strong>⭐ Rating:</strong> {ride.driverRating}/5</span>
                    </div>
                    <button 
                      onClick={() => handleQuickBook(ride)}
                      className="quick-book-btn"
                      disabled={ride.seats < parseInt(quickSearch.passengers || 1)}
                    >
                      ⚡ Book Instantly
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Show search results if user searched */}
        {showResults && (
          <div className="search-results">
            <h3>🔍 Search Results ({quickResults.length})</h3>
            {quickResults.length === 0 ? (
              <div className="no-results">
                <p>😔 No quick rides found matching your criteria.</p>
                <p>Check the "Available Now" section above for other options.</p>
              </div>
            ) : (
              <div className="quick-rides-list">
                {quickResults.map(ride => (
                  <div key={ride.id} className="quick-ride-card">
                    <div className="quick-ride-header">
                      <div className="ride-route">
                        <span className="from">{ride.from}</span>
                        <span className="arrow">→</span>
                        <span className="to">{ride.to}</span>
                      </div>
                      <div className="ride-time-urgent">
                        <span className="time">🕐 {ride.time}</span>
                        <span className="urgent-badge">QUICK</span>
                      </div>
                    </div>
                    <div className="quick-ride-details">
                      <div className="ride-info-quick">
                        <span><strong>🚗 Driver:</strong> {ride.driver}</span>
                        <span><strong>💺 Available:</strong> {ride.seats} seats</span>
                        <span><strong>💰 Price:</strong> ₹{ride.price}</span>
                        <span><strong>⭐ Rating:</strong> {ride.driverRating}/5</span>
                      </div>
                      <button 
                        onClick={() => handleQuickBook(ride)}
                        className="quick-book-btn"
                        disabled={ride.seats < parseInt(quickSearch.passengers || 1)}
                      >
                        ⚡ Book Instantly
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
  const [showQuickRide, setShowQuickRide] = useState(false);
  const [showMyRides, setShowMyRides] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [locationPermissionGuide, setLocationPermissionGuide] = useState(false);
  const [myRideHistory, setMyRideHistory] = useState([
    {
      id: 101,
      from: "City Center",
      to: "University",
      date: "2025-08-05",
      time: "09:30",
      totalPrice: 50,
      passengers: 1,
      driver: "John Doe",
      vehicle: "Honda City (White)",
      bookingDate: "2025-08-05",
      bookingId: "SR890123",
      status: "Completed",
      paymentMethod: "UPI Payment",
      driverPhone: "+91-9876-5432-10",
      reviewed: false
    },
    {
      id: 102,
      from: "Mall",
      to: "Tech Park",
      date: "2025-08-04",
      time: "18:15",
      totalPrice: 75,
      passengers: 2,
      driver: "Jane Smith",
      vehicle: "Toyota Innova (Silver)",
      bookingDate: "2025-08-04",
      bookingId: "SR789456",
      status: "Completed",
      paymentMethod: "Cash on Ride",
      driverPhone: "+91-8765-4321-09",
      reviewed: true
    },
    {
      id: 103,
      from: "Airport",
      to: "City Center",
      date: "2025-08-03",
      time: "12:45",
      totalPrice: 120,
      passengers: 1,
      driver: "Michael Chen",
      vehicle: "Kia Carnival (Black)",
      bookingDate: "2025-08-03",
      bookingId: "SR678234",
      status: "Completed",
      paymentMethod: "Credit Card",
      driverPhone: "+91-7654-3210-98",
      reviewed: false
    }
  ]);
  const [availableRides, setAvailableRides] = useState([
    {
      id: 1,
      from: "City Center",
      to: "University",
      date: "2025-08-06", // Today's date
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
      date: "2025-08-06", // Today's date
      time: "14:32",
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
      date: "2025-08-06", // Today's date
      time: "14:34",
      price: 75,
      seats: 4,
      status: "Upcoming",
      driver: "Michael Chen",
      vehicle: "Kia Carnival (Black) KA-03-ZZ-ZZZZ",
      notes: "Luggage space available, AC vehicle",
      driverRating: 4.7,
      estimatedDuration: "45 mins"
    },
    {
      id: 4,
      from: "Tech Park",
      to: "Mall",
      date: "2025-08-06", // Today's date - Quick ride
      time: "14:31",
      price: 35,
      seats: 2,
      status: "Upcoming",
      driver: "Sarah Wilson",
      vehicle: "Hyundai i20 (Red) KA-04-AA-AAAA",
      notes: "Quick ride, AC, no delays",
      driverRating: 4.9,
      estimatedDuration: "20 mins"
    },
    {
      id: 5,
      from: "University",
      to: "City Center",
      date: "2025-08-06", // Today's date - Quick ride
      time: "14:33",
      price: 45,
      seats: 3,
      status: "Upcoming",
      driver: "Raj Patel",
      vehicle: "Maruti Swift (Blue) KA-05-BB-BBBB",
      notes: "Fast ride available, quick pickup",
      driverRating: 4.6,
      estimatedDuration: "30 mins"
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
      totalPrice: Math.round((ride.price / passengers) * 100) / 100, // Divide total by passengers
      driver: ride.driver,
      vehicle: ride.vehicle,
      driverRating: ride.driverRating,
      estimatedDuration: ride.estimatedDuration,
      seats: ride.seats,
      bookingDate: new Date().toLocaleDateString(),
      bookingId: `SR${Date.now().toString().slice(-6)}`,
      status: "Booked",
      notes: ride.notes || "",
      pickupPoint: `Near ${ride.from}`,
      paymentMethod: "Cash on Ride",
      driverPhone: user.phone || "+91-XXXX-XXXX-XX",
      reviewed: false
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

  const handleQuickBook = (ride, passengers) => {
    console.log("Main handleQuickBook called:", ride.id, passengers);
    
    try {
      // Validate inputs
      if (!ride || !passengers || passengers < 1) {
        console.error("Invalid ride or passenger data");
        return;
      }
      
      // Create booking record (same as handleFindRide but with urgent flag)
      const booking = {
        id: Date.now(),
        rideId: ride.id,
        from: ride.from,
        to: ride.to,
        date: ride.date,
        time: ride.time,
        price: ride.price,
        passengers: passengers,
        totalPrice: Math.round((ride.price / passengers) * 100) / 100, // Divide total by passengers
        driver: ride.driver,
        vehicle: ride.vehicle,
        driverRating: ride.driverRating,
        estimatedDuration: ride.estimatedDuration,
        seats: ride.seats,
        bookingDate: new Date().toLocaleDateString(),
        bookingId: `QR${Date.now().toString().slice(-6)}`, // QR for Quick Ride
        status: "Booked",
        notes: ride.notes + " [QUICK RIDE - Fast Booking]",
        pickupPoint: `Near ${ride.from}`,
        paymentMethod: "Cash on Ride",
        driverPhone: user.phone || "+91-XXXX-XXXX-XX",
        reviewed: false,
        isQuickRide: true // Flag for quick rides
      };
      
      console.log("Creating booking:", booking);
      
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
      
      console.log("Quick ride booking successful!");
      
      // Show success message
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
      setShowQuickRide(false);
    } catch (error) {
      console.error("Error in quick booking:", error);
    }
  };

  const handleCancelRide = (rideId) => {
    const rideToCancel = myRideHistory.find(ride => ride.id === rideId);
    
    // Different cancellation reasons based on ride status
    let cancellationReason = "";
    
    if (rideToCancel?.status === "In Progress") {
      cancellationReason = "Cancelled before pickup";
    } else {
      cancellationReason = "Cancelled by passenger";
    }
    
    // Update ride status to "Cancelled" directly
    setMyRideHistory(prevHistory => 
      prevHistory.map(ride => 
        ride.id === rideId 
          ? { 
              ...ride, 
              status: "Cancelled", 
              cancelledDate: new Date().toLocaleDateString(),
              cancelledTime: new Date().toLocaleTimeString(),
              cancellationReason: cancellationReason
            }
          : ride
      )
    );
    
    // Restore seats to available rides (add back the cancelled seats)
    const cancelledRide = myRideHistory.find(ride => ride.id === rideId);
    if (cancelledRide) {
      setAvailableRides(prevRides => 
        prevRides.map(ride => 
          ride.id === cancelledRide.rideId 
            ? { ...ride, seats: ride.seats + cancelledRide.passengers }
            : ride
        )
      );
    }
    
    // Automatically notify driver if ride was in progress
    if (rideToCancel?.status === "In Progress") {
      handleNotifyDriverOfCancellation(rideToCancel);
    }
    
    // Show success notification
    setCancellationSuccess(true);
    setTimeout(() => setCancellationSuccess(false), 4000);
  };

  const handleNotifyDriverOfCancellation = (ride) => {
    const message = `⚠️ RIDE CANCELLATION NOTICE: Passenger has cancelled the ride from ${ride.from} to ${ride.to} before pickup. Booking ID: ${ride.bookingId}. Passenger: ${user.fullName || user.username}. No penalty for pre-pickup cancellation. Seat is now available for other passengers.`;
    const driverPhone = ride.driverPhone?.replace(/[^0-9]/g, '') || '';
    
    if (driverPhone) {
      const whatsappUrl = `https://wa.me/91${driverPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContactPassenger = (ride) => {
    const message = `Hi! This is ${user.fullName || user.username}, your driver for the ride from ${ride.from} to ${ride.to} scheduled at ${ride.time} today. I'm starting the ride soon. Please be ready at the pickup point: ${ride.pickupPoint}. Booking ID: ${ride.bookingId}`;
    const phoneNumber = ride.driverPhone?.replace(/[^0-9]/g, '') || ''; // Remove non-numeric characters
    
    if (phoneNumber) {
      // Open WhatsApp with pre-filled message
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // NEW: Navigation function for Google Maps
  const handleNavigateToPassenger = (ride) => {
    const pickupLocation = ride.pickupPoint || ride.from;
    
    // Show location permission request notification
    setNotificationMessage('📍 Allow location access for precise navigation!');
    setBookingSuccess(true);
    
    // Get current location and create navigation URLs that auto-start navigation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update notification to show success
        setNotificationMessage('🗺️ Auto-navigation to passenger started!');
        
        // URLs that automatically start navigation from current location to pickup point
        const autoNavUrl1 = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(pickupLocation)}/@${latitude},${longitude},15z/data=!4m2!4m1!3e0?entry=ttu`;
        const autoNavUrl2 = `https://maps.google.com/maps?saddr=${latitude},${longitude}&daddr=${encodeURIComponent(pickupLocation)}&dirflg=d`;
        const autoNavUrl3 = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(pickupLocation)}&travelmode=driving&dir_action=navigate`;
        
        // Try opening Google Maps navigation with auto-start
        const mapWindow = window.open(autoNavUrl1, '_blank', 'noopener,noreferrer');
        
        // Backup methods if first doesn't work
        if (!mapWindow) {
          setTimeout(() => window.open(autoNavUrl2, '_blank'), 500);
          setTimeout(() => window.open(autoNavUrl3, '_blank'), 1000);
        }
        
        // Hide notification after successful navigation
        setTimeout(() => {
          setBookingSuccess(false);
          setNotificationMessage('');
        }, 4000);
      },
      (error) => {
        // Handle different types of location errors with specific messages
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '⚠️ Location blocked! Using destination-only navigation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '⚠️ Location unavailable! Using destination-only navigation.';
            break;
          case error.TIMEOUT:
            errorMessage = '⚠️ Location timeout! Using destination-only navigation.';
            break;
          default:
            errorMessage = '⚠️ Location error! Using destination-only navigation.';
        }
        
        setNotificationMessage(errorMessage);
        
        // Fallback if location access denied - use destination-only URLs
        const mapsUrl1 = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickupLocation)}&travelmode=driving&dir_action=navigate`;
        const mapsUrl2 = `https://maps.google.com/maps?daddr=${encodeURIComponent(pickupLocation)}`;
        
        const mapWindow = window.open(mapsUrl1, '_blank', 'noopener,noreferrer');
        if (!mapWindow) {
          setTimeout(() => window.open(mapsUrl2, '_blank'), 500);
        }
        
        // Hide error notification
        setTimeout(() => {
          setBookingSuccess(false);
          setNotificationMessage('');
        }, 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
    
    // Also send location to passenger via WhatsApp
    const locationMessage = `📍 Hi! I'm heading to pick you up at ${pickupLocation}. You can track my location on Google Maps. I'll reach in approximately ${ride.estimatedDuration || '15-20 minutes'}. Booking ID: ${ride.bookingId}`;
    const phoneNumber = ride.driverPhone?.replace(/[^0-9]/g, '') || '';
    
    if (phoneNumber) {
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(locationMessage)}`;
      // Open WhatsApp in a new tab after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }
  };

  // Track success notification state
  const [notificationMessage, setNotificationMessage] = useState('');

  // NEW: Track Driver function for passengers
  const handleTrackDriver = (ride) => {
    const pickupLocation = ride.pickupPoint || ride.from;
    const destination = ride.to;
    
    // Create multiple Google Maps URL options for better compatibility
    const routeUrl1 = `https://www.google.com/maps/dir/${encodeURIComponent(pickupLocation)}/${encodeURIComponent(destination)}`;
    const routeUrl2 = `https://maps.google.com/maps?saddr=${encodeURIComponent(pickupLocation)}&daddr=${encodeURIComponent(destination)}`;
    
    // Try opening Google Maps route - multiple attempts for compatibility
    const mapWindow1 = window.open(routeUrl1, '_blank', 'noopener,noreferrer');
    
    // Backup method if first doesn't work
    if (!mapWindow1) {
      window.open(routeUrl2, '_blank', 'noopener,noreferrer');
    }
    
    // Send current status message to driver
    const trackingMessage = `📱 Hi! I'm tracking our route from ${pickupLocation} to ${destination}. Please let me know when you're nearby for pickup. Booking ID: ${ride.bookingId}`;
    const phoneNumber = ride.driverPhone?.replace(/[^0-9]/g, '') || '';
    
    if (phoneNumber) {
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(trackingMessage)}`;
      // Open WhatsApp in a new tab after a short delay
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
    }
    
    // Show visual feedback with specific message
    setNotificationMessage('📍 Route tracking opened in Google Maps!');
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setNotificationMessage('');
    }, 3000);
  };

  const handleSendRideStartMessage = (ride) => {
    const message = `🚗 RIDE STARTED! Hi, your ride from ${ride.from} to ${ride.to} has started. Driver: ${user.fullName || user.username}. Vehicle: ${ride.vehicle}. Booking ID: ${ride.bookingId}. Estimated arrival: ${ride.estimatedDuration}. Safe journey!`;
    const phoneNumber = ride.driverPhone?.replace(/[^0-9]/g, '') || '';
    
    if (phoneNumber) {
      // Show loading state
      const originalButton = event?.target;
      if (originalButton) {
        originalButton.textContent = '🔄 Starting Navigation...';
        originalButton.disabled = true;
      }
      
      // Create WhatsApp URL with message
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp immediately
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer,width=800,height=600');
      
      // NEW: Auto-open Google Maps navigation
      const pickupLocation = ride.pickupPoint || ride.from;
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickupLocation)}&travelmode=driving&dir_action=navigate`;
      
      // Open Maps navigation after WhatsApp
      setTimeout(() => {
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
      }, 1500);
      
      // Mark ride as started immediately
      setMyRideHistory(prevHistory => 
        prevHistory.map(r => 
          r.id === ride.id 
            ? { ...r, status: "In Progress", startedAt: new Date().toLocaleTimeString() }
            : r
        )
      );
      
      // Reset button after a delay
      setTimeout(() => {
        if (originalButton) {
          originalButton.textContent = '✅ Navigation Started!';
          setTimeout(() => {
            originalButton.textContent = '🚀 Start Ride & Notify';
            originalButton.disabled = false;
          }, 2000);
        }
      }, 1000);
      
      // Show success notification
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
      
    }
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
        
        {cancellationSuccess && (
          <div className="cancellation-success">
            ✅ Ride cancelled successfully! Your booking has been cancelled.
          </div>
        )}
        
        <div className="main-dashboard">
          {/* Success Notification */}
          {bookingSuccess && (
            <div className="success-notification whatsapp-notification">
              <div className="notification-content">
                <span className="notification-icon">🗺️</span>
                <div className="notification-text">
                  <h3>Maps & WhatsApp Opened!</h3>
                  <p>{notificationMessage || 'Google Maps navigation and WhatsApp message ready to go.'}</p>
                </div>
              </div>
            </div>
          )}
          
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
            
            <div className="action-card quick-ride-card" onClick={() => setShowQuickRide(true)}>
              <div className="card-icon urgent-icon">⚡</div>
              <h3>Quick Ride</h3>
              <p>Rides available today for quick booking</p>
              <span className="urgent-badge-small">QUICK</span>
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
            onCancelRide={handleCancelRide}
            onContactPassenger={handleContactPassenger}
            onSendRideStartMessage={handleSendRideStartMessage}
            onNavigateToPassenger={handleNavigateToPassenger}
            onTrackDriver={handleTrackDriver}
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
        
        {showQuickRide && (
          <QuickRidePage 
            onClose={() => setShowQuickRide(false)}
            onQuickBook={handleQuickBook}
            availableRides={availableRides}
            user={user}
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
      
      {/* Location Permission Guide Modal */}
      {locationPermissionGuide && (
        <div className="overlay">
          <div className="modal-container location-guide-modal">
            <button className="close-btn" onClick={() => setLocationPermissionGuide(false)}>×</button>
            <h2>📍 Location Permission Required</h2>
            <div className="location-guide-content">
              <div className="guide-step">
                <span className="step-icon">🚗</span>
                <div className="step-text">
                  <h3>Why do we need your location?</h3>
                  <p>To provide accurate navigation from your current position to the passenger's pickup point.</p>
                </div>
              </div>
              <div className="guide-step">
                <span className="step-icon">🔒</span>
                <div className="step-text">
                  <h3>Your location is safe</h3>
                  <p>We only use your location for navigation. It's not stored or shared with anyone.</p>
                </div>
              </div>
              <div className="guide-step">
                <span className="step-icon">📱</span>
                <div className="step-text">
                  <h3>How to allow permission:</h3>
                  <p>Click "Allow" when your browser asks for location access. Look for the location icon in your address bar.</p>
                </div>
              </div>
              <button 
                className="action-btn allow-location-btn"
                onClick={() => setLocationPermissionGuide(false)}
              >
                ✓ I Understand, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
