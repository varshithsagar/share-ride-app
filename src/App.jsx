import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import './App.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different types of markers
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Location data for demo purposes (you can replace with real coordinates)
const locationCoordinates = {
  "City Center": [12.9716, 77.5946],
  "University": [12.9342, 77.6095],
  "Mall": [12.9698, 77.7500],
  "Tech Park": [12.8456, 77.6628],
  "Airport": [13.1986, 77.7066],
  "Hotel Zone": [12.9721, 77.5933],
  "Residential Area": [12.9352, 77.6245],
  "Shopping District": [12.9667, 77.5667],
  "Suburbs": [12.8901, 77.5845],
  "Metro Station": [12.9567, 77.6012],
  "IT Hub": [12.8423, 77.6634],
  "Business District": [12.9716, 77.5946]
};

function MapComponent({ rides, showRoute = false, selectedRide = null }) {
  const centerPosition = [12.9716, 77.5946]; // Bangalore center

  const getCoordinates = (locationName) => {
    return locationCoordinates[locationName] || centerPosition;
  };

  return (
    <div className="map-container">
      <MapContainer center={centerPosition} zoom={11} className="ride-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {rides && rides.map((ride) => {
          const pickupCoords = getCoordinates(ride.from);
          const dropoffCoords = getCoordinates(ride.to);
          
          return (
            <React.Fragment key={ride.id}>
              {/* Pickup Marker */}
              <Marker position={pickupCoords} icon={pickupIcon}>
                <Popup>
                  <div className="map-popup">
                    <h4>🚗 Pickup Location</h4>
                    <p><strong>{ride.from}</strong></p>
                    <p>Driver: {ride.driver}</p>
                    <p>Time: {ride.time}</p>
                    <p>Date: {ride.date}</p>
                    <p>Price: ₹{ride.price}</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Dropoff Marker */}
              <Marker position={dropoffCoords} icon={dropoffIcon}>
                <Popup>
                  <div className="map-popup">
                    <h4>🏁 Drop-off Location</h4>
                    <p><strong>{ride.to}</strong></p>
                    <p>Driver: {ride.driver}</p>
                    <p>Duration: {ride.estimatedDuration || 'N/A'}</p>
                    <p>Seats: {ride.seats} available</p>
                  </div>
                </Popup>
              </Marker>
              
              {/* Route Line */}
              {showRoute && (
                <Polyline 
                  positions={[pickupCoords, dropoffCoords]}
                  color="#3498db"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Selected Ride Route */}
        {selectedRide && (
          <>
            <Polyline 
              positions={[
                getCoordinates(selectedRide.from),
                getCoordinates(selectedRide.to)
              ]}
              color="#e74c3c"
              weight={6}
              opacity={0.8}
            />
          </>
        )}
      </MapContainer>
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
      <h2>📝 Register</h2>
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
              placeholder="Choose a username"
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
              placeholder="Create a password"
            />
          </div>
        </div>
        <div>
          <label>Confirm Password:</label>
          <div className="input-wrapper">
            <span className="input-icon">🔐</span>
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
        <button type="submit" className="login-btn">🎉 Register</button>
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
  console.log("App component is rendering...");
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  
  console.log("User state:", user);
  console.log("Is registering:", isRegistering);
  const [showProfile, setShowProfile] = useState(false);
  const [showOfferRide, setShowOfferRide] = useState(false);
  const [showFindRide, setShowFindRide] = useState(false);
  const [showMyRides, setShowMyRides] = useState(false);
  const [activeRidesTab, setActiveRidesTab] = useState('upcoming');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [issueDetails, setIssueDetails] = useState({
    type: '',
    description: '',
    severity: 'medium'
  });
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
    },
    {
      id: 4,
      from: "Tech Park",
      to: "Residential Area",
      date: "2025-08-05",
      time: "18:00",
      price: 35,
      seats: 3,
      status: "Upcoming",
      driver: "Sarah Wilson",
      vehicle: "Hyundai Venue (Blue) KA-04-AA-AAAA",
      notes: "Ladies only, AC vehicle",
      driverRating: 4.9,
      estimatedDuration: "20 mins"
    },
    {
      id: 5,
      from: "Shopping District",
      to: "Suburbs",
      date: "2025-08-05",
      time: "17:30",
      price: 45,
      seats: 2,
      status: "Upcoming",
      driver: "Alex Thompson",
      vehicle: "Maruti Swift (Red) KA-05-BB-BBBB",
      notes: "AC vehicle, light music",
      driverRating: 4.6,
      estimatedDuration: "35 mins"
    },
    {
      id: 6,
      from: "Metro Station",
      to: "IT Hub",
      date: "2025-08-05",
      time: "09:00",
      price: 30,
      seats: 4,
      status: "Upcoming",
      driver: "Priya Sharma",
      vehicle: "Tata Nexon (Grey) KA-06-CC-CCCC",
      notes: "AC vehicle, phone charging available",
      driverRating: 4.8,
      estimatedDuration: "25 mins"
    },
    {
      id: 7,
      from: "Business District",
      to: "Airport",
      date: "2025-08-05",
      time: "13:45",
      price: 65,
      seats: 3,
      status: "Upcoming",
      driver: "David Miller",
      vehicle: "Toyota Fortuner (Black) KA-07-DD-DDDD",
      notes: "Premium ride, luggage space, AC vehicle",
      driverRating: 4.9,
      estimatedDuration: "40 mins"
    },
    {
      id: 8,
      from: "Residential Area",
      to: "Shopping District",
      date: "2025-08-05",
      time: "11:30",
      price: 35,
      seats: 3,
      status: "Upcoming",
      driver: "Emma Davis",
      vehicle: "Honda WR-V (Silver) KA-08-EE-EEEE",
      notes: "AC vehicle, no smoking",
      driverRating: 4.7,
      estimatedDuration: "30 mins"
    },
    {
      id: 9,
      from: "University",
      to: "Metro Station",
      date: "2025-08-05",
      time: "16:45",
      price: 25,
      seats: 4,
      status: "Upcoming",
      driver: "Raj Patel",
      vehicle: "Maruti Ertiga (White) KA-09-FF-FFFF",
      notes: "Student friendly, AC vehicle",
      driverRating: 4.8,
      estimatedDuration: "20 mins"
    },
    {
      id: 10,
      from: "IT Hub",
      to: "City Center",
      date: "2025-08-05",
      time: "19:15",
      price: 40,
      seats: 3,
      status: "Upcoming",
      driver: "Lisa Anderson",
      vehicle: "MG Astor (Blue) KA-10-GG-GGGG",
      notes: "Premium ride, AC vehicle, water bottles provided",
      driverRating: 4.9,
      estimatedDuration: "30 mins"
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

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !showSearchResults) return;
    
    const interval = setInterval(() => {
      refreshSearchResults();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh, showSearchResults, searchRide, availableRides]);

  // Simulate occasional new rides (for demo purposes)
  useEffect(() => {
    const simulateNewRides = () => {
      // Only simulate when search results are visible
      if (!showSearchResults) return;
      
      // Random chance to add a new ride
      if (Math.random() < 0.3) { // 30% chance
        const newRideTemplates = [
          { from: "City Center", to: "Airport", price: 80, driver: "New Driver 1", vehicle: "Honda Civic (Blue)" },
          { from: "Tech Park", to: "Mall", price: 35, driver: "New Driver 2", vehicle: "Toyota Corolla (Red)" },
          { from: "University", to: "Shopping District", price: 40, driver: "New Driver 3", vehicle: "Hyundai i20 (White)" }
        ];
        
        const template = newRideTemplates[Math.floor(Math.random() * newRideTemplates.length)];
        const newRide = {
          ...template,
          id: Date.now(), // Unique ID
          date: searchRide.date || "2025-08-05",
          time: `${Math.floor(Math.random() * 12) + 9}:${Math.random() < 0.5 ? '00' : '30'}`,
          seats: Math.floor(Math.random() * 3) + 2, // 2-4 seats
          status: "Upcoming",
          notes: "Newly added ride",
          driverRating: 4.5 + Math.random() * 0.4,
          estimatedDuration: `${Math.floor(Math.random() * 20) + 20} mins`
        };
        
        setAvailableRides(prev => [...prev, newRide]);
      }
    };
    
    // Run simulation every 2 minutes
    const simulationInterval = setInterval(simulateNewRides, 120000);
    
    return () => clearInterval(simulationInterval);
  }, [showSearchResults, searchRide.date]);

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
    
    // Filter rides based on search criteria
    const filteredRides = availableRides.filter(ride => {
      // Match origin (case-insensitive partial match)
      const fromMatch = ride.from.toLowerCase().includes(searchRide.from.toLowerCase());
      
      // Match destination (case-insensitive partial match)
      const toMatch = ride.to.toLowerCase().includes(searchRide.to.toLowerCase());
      
      // Match date
      const dateMatch = !searchRide.date || ride.date === searchRide.date;
      
      // Check if enough seats are available
      const seatsMatch = ride.seats >= parseInt(searchRide.passengers);

      return fromMatch && toMatch && dateMatch && seatsMatch;
    });

    // Sort rides by departure time
    filteredRides.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`);
      const timeB = new Date(`${b.date} ${b.time}`);
      return timeA - timeB;
    });

    // Store search results and show them
    setSearchResults(filteredRides);
    setShowSearchResults(true);
    setLastSearchTime(new Date());
    // Keep the Find a Ride form open to show results
  };

  // Function to refresh search results
  const refreshSearchResults = () => {
    if (!showSearchResults || !lastSearchTime) return;
    
    // Re-run the search with current criteria
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

    // Check for changes and notify user
    const currentIds = searchResults.map(r => r.id);
    const newIds = filteredRides.map(r => r.id);
    
    // Check for new rides
    const newRides = filteredRides.filter(r => !currentIds.includes(r.id));
    if (newRides.length > 0) {
      addNotification(`🆕 ${newRides.length} new ride${newRides.length > 1 ? 's' : ''} available!`, 'success');
    }
    
    // Check for seat changes
    const seatChanges = filteredRides.filter(newRide => {
      const oldRide = searchResults.find(r => r.id === newRide.id);
      return oldRide && oldRide.seats !== newRide.seats;
    });
    
    if (seatChanges.length > 0 && seatChanges.some(r => r.seats < searchResults.find(or => or.id === r.id)?.seats)) {
      addNotification(`⚠️ Seat availability updated for some rides`, 'warning');
    }

    setSearchResults(filteredRides);
  };

  // Function to add notifications
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastBookedId, setLastBookedId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchBookingSuccess, setSearchBookingSuccess] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [lastSearchTime, setLastSearchTime] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

  const handleBookRideFromSearch = (ride) => {
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
      passengers: parseInt(searchRide.passengers),
      paymentMethod: "Card",
      bookingDate: new Date().toISOString().split('T')[0]
    };

    // Add to ride history
    setRideHistory([booking, ...rideHistory]);

    // Update available seats in both main rides and search results
    const updatedRides = availableRides.map(r => {
      if (r.id === ride.id) {
        return { ...r, seats: r.seats - parseInt(searchRide.passengers) };
      }
      return r;
    });
    setAvailableRides(updatedRides);
    
    // Update search results as well
    const updatedSearchResults = searchResults.map(r => {
      if (r.id === ride.id) {
        return { ...r, seats: r.seats - parseInt(searchRide.passengers) };
      }
      return r;
    });
    setSearchResults(updatedSearchResults);
    
    // Show success message specific to search booking
    setSearchBookingSuccess(true);
    setTimeout(() => setSearchBookingSuccess(false), 4000);
    
    // Add notification
    addNotification(`🎉 Ride booked successfully! ${ride.from} → ${ride.to} on ${ride.date}`, 'success');
    
    // If ride is now full, notify
    if (ride.seats - parseInt(searchRide.passengers) === 0) {
      addNotification(`ℹ️ This ride is now fully booked`, 'info');
    }
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
    console.log("User is logged in, showing main app");
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
              <div className="welcome-message">
                <h3>🚗 Welcome to Share Ride!</h3>
                <p>Choose an option above to get started with your ride sharing experience.</p>
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
                  <button type="button" className="clear-form-btn" onClick={() => {
                    setSearchRide({
                      from: '',
                      to: '',
                      date: '',
                      passengers: '1'
                    });
                    setShowSearchResults(false);
                    setSearchResults([]);
                    setShowMap(false);
                  }}>Clear Form</button>
                  <button type="button" className="cancel-ride-btn" onClick={() => {
                    setShowFindRide(false);
                    setShowSearchResults(false);
                    setSearchResults([]);
                  }}>Cancel</button>
                </div>
              </form>
              
              {/* Search Results Section */}
              {showSearchResults && (
                <div className="search-results-section">
                  {/* Notifications */}
                  {notifications.length > 0 && (
                    <div className="notifications-container">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`notification notification-${notification.type}`}>
                          <span className="notification-message">{notification.message}</span>
                          <button 
                            className="notification-close"
                            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchBookingSuccess && (
                    <div className="search-booking-success">
                      🎉 Ride booked successfully! Your booking has been confirmed and added to "My Rides"
                    </div>
                  )}
                  
                  <div className="search-results-header">
                    <div className="search-results-info">
                      <h4>🔍 Search Results ({searchResults.length} ride{searchResults.length !== 1 ? 's' : ''} found)</h4>
                      {lastSearchTime && (
                        <p className="last-updated">
                          Last updated: {lastSearchTime.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="search-header-actions">
                      <button 
                        className="refresh-btn"
                        onClick={refreshSearchResults}
                        title="Refresh search results"
                      >
                        🔄 Refresh
                      </button>
                      <label className="auto-refresh-toggle">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        Auto-refresh
                      </label>
                      <div className="map-toggle-container">
                        <button 
                          className="map-toggle-btn"
                          onClick={() => setShowMap(!showMap)}
                        >
                          {showMap ? '📋 Show List' : '🗺️ Show Map'}
                        </button>
                      </div>
                      <button 
                        className="new-search-btn"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchResults([]);
                          setShowMap(false);
                          setNotifications([]);
                          // Keep the Find a Ride form visible for new search
                          setShowFindRide(true);
                        }}
                      >
                        New Search
                      </button>
                    </div>
                  </div>
                  
                  {showMap && searchResults.length > 0 && (
                    <div className="map-container">
                      <MapComponent rides={searchResults} />
                      <div className="route-legend">
                        <div className="legend-item">
                          <span className="legend-dot pickup"></span>
                          <span>Pickup Points</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot dropoff"></span>
                          <span>Drop-off Points</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {searchResults.length > 0 ? (
                    <div className="search-ride-cards">
                      {searchResults.map((ride) => (
                        <div key={ride.id} className="search-ride-card">
                          <div className="ride-card-header">
                            <div className="ride-route">
                              <span className="route-from">{ride.from}</span>
                              <span className="route-arrow">→</span>
                              <span className="route-to">{ride.to}</span>
                            </div>
                            <div className="ride-price-tag">₹{ride.price}</div>
                          </div>
                          
                          <div className="ride-card-details">
                            <div className="detail-row">
                              <span className="detail-icon">📅</span>
                              <span className="detail-text">{new Date(ride.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })} at {ride.time}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-icon">👤</span>
                              <span className="detail-text">{ride.driver}</span>
                              {ride.driverRating && (
                                <span className="driver-rating">⭐ {ride.driverRating}</span>
                              )}
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-icon">🚗</span>
                              <span className="detail-text">{ride.vehicle}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="detail-icon">💺</span>
                              <span className="detail-text">
                                {ride.seats > 0 ? `${ride.seats} seat${ride.seats !== 1 ? 's' : ''} available` : 'Fully booked'}
                              </span>
                              {ride.seats <= 2 && ride.seats > 0 && (
                                <span className="low-seats-warning">⚠️ Few seats left!</span>
                              )}
                            </div>
                            
                            {ride.estimatedDuration && (
                              <div className="detail-row">
                                <span className="detail-icon">⏱️</span>
                                <span className="detail-text">{ride.estimatedDuration}</span>
                              </div>
                            )}
                            
                            {ride.notes && (
                              <div className="detail-row">
                                <span className="detail-icon">📝</span>
                                <span className="detail-text">{ride.notes}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="ride-card-actions">
                            <button 
                              className={`book-ride-btn ${ride.seats <= 0 ? 'disabled' : ''}`}
                              onClick={() => handleBookRideFromSearch(ride)}
                              disabled={ride.seats <= 0}
                            >
                              {ride.seats <= 0 ? 'Fully Booked' : `Book for ${searchRide.passengers} passenger${searchRide.passengers !== '1' ? 's' : ''}`}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-results">
                      <div className="no-results-icon">😔</div>
                      <h4>No rides found</h4>
                      <p>Try adjusting your search criteria or check back later for new rides.</p>
                      <button 
                        className="search-again-btn"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchResults([]);
                          setShowMap(false);
                          // Keep the Find a Ride form visible
                          setShowFindRide(true);
                        }}
                      >
                        🔍 Search Again
                      </button>
                    </div>
                  )}
                </div>
              )}
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

                                {ride.issues && ride.issues.length > 0 && (
                                  <div className="issues">
                                    <h4>Reported Issues</h4>
                                    {ride.issues.map((issue, index) => (
                                      <div key={index} className="issue-item">
                                        <span className={`issue-tag ${issue.severity}`}>
                                          {issue.type}
                                        </span>
                                        <span className={`issue-status ${issue.status}`}>
                                          {issue.status}
                                        </span>
                                        <p>{issue.description}</p>
                                        <small>Reported: {new Date(issue.reportedAt).toLocaleDateString()}</small>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="history-actions">
                                <button className="history-action-btn action-receipt">
                                  <span className="icon">📄</span> Receipt
                                </button>
                                <button 
                                  className="history-action-btn action-report"
                                  onClick={() => {
                                    setSelectedRide(ride);
                                    setShowIssueForm(true);
                                  }}
                                >
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
          {showIssueForm && selectedRide && (
            <div className="profile-overlay">
              <div className="profile-container">
                <button className="close-btn" onClick={() => {
                  setShowIssueForm(false);
                  setSelectedRide(null);
                  setIssueDetails({
                    type: '',
                    description: '',
                    severity: 'medium'
                  });
                }}>×</button>
                <h2>🚩 Report an Issue</h2>
                <div className="issue-details">
                  <div className="ride-summary">
                    <h3>Ride Details</h3>
                    <p><strong>Date:</strong> {selectedRide.date}</p>
                    <p><strong>Route:</strong> {selectedRide.from} → {selectedRide.to}</p>
                    <p><strong>Driver:</strong> {selectedRide.driver}</p>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    // Update ride history with the issue
                    const updatedHistory = rideHistory.map(ride => {
                      if (ride.id === selectedRide.id) {
                        return {
                          ...ride,
                          issues: [...(ride.issues || []), {
                            ...issueDetails,
                            id: Date.now(),
                            reportedAt: new Date().toISOString(),
                            status: 'pending'
                          }]
                        };
                      }
                      return ride;
                    });
                    setRideHistory(updatedHistory);
                    setShowIssueForm(false);
                    setSelectedRide(null);
                    setIssueDetails({
                      type: '',
                      description: '',
                      severity: 'medium'
                    });
                  }} className="issue-form">
                    <div className="form-group">
                      <label>Issue Type:</label>
                      <select
                        required
                        value={issueDetails.type}
                        onChange={(e) => setIssueDetails({...issueDetails, type: e.target.value})}
                      >
                        <option value="">Select issue type</option>
                        <option value="delay">Delay</option>
                        <option value="behavior">Driver Behavior</option>
                        <option value="cleanliness">Vehicle Cleanliness</option>
                        <option value="safety">Safety Concern</option>
                        <option value="payment">Payment Issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Severity:</label>
                      <div className="severity-options">
                        <label>
                          <input
                            type="radio"
                            name="severity"
                            value="low"
                            checked={issueDetails.severity === 'low'}
                            onChange={(e) => setIssueDetails({...issueDetails, severity: e.target.value})}
                          />
                          Low
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="severity"
                            value="medium"
                            checked={issueDetails.severity === 'medium'}
                            onChange={(e) => setIssueDetails({...issueDetails, severity: e.target.value})}
                          />
                          Medium
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="severity"
                            value="high"
                            checked={issueDetails.severity === 'high'}
                            onChange={(e) => setIssueDetails({...issueDetails, severity: e.target.value})}
                          />
                          High
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Please provide detailed information about the issue..."
                        value={issueDetails.description}
                        onChange={(e) => setIssueDetails({...issueDetails, description: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="submit-issue-btn">Submit Report</button>
                      <button 
                        type="button" 
                        className="cancel-issue-btn"
                        onClick={() => {
                          setShowIssueForm(false);
                          setSelectedRide(null);
                          setIssueDetails({
                            type: '',
                            description: '',
                            severity: 'medium'
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
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