import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { LuArrowRight, LuRepeat2, LuRoute, LuArrowLeftRight, LuCalendarDays, LuUsers, LuBriefcase, LuSnowflake, LuChevronLeft, LuCar, LuUser, LuSearch, LuLock, LuPencil, LuX } from 'react-icons/lu';
import { FaMotorcycle, FaCarSide, FaTaxi, FaCar, FaShuttleVan, FaBolt } from 'react-icons/fa';
import { TbScooter } from 'react-icons/tb';
import { MdElectricBike } from 'react-icons/md';

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
  icon: 'bike',
    seats: '2 Seats',
    bags: '1 Bag',
    models: 'Royal Enfield, Pulsar',
    basePrice: 80
  },
  {
    id: 'auto',
    name: 'Auto',
  icon: 'auto',
    seats: '3 Seats',
    bags: '2 Bags',
    models: 'Bajaj Auto, TVS King',
    basePrice: 120
  },
  {
    id: 'car',
    name: 'Car',
  icon: 'car',
    seats: '4 Seats',
    bags: '3 Bags',
    models: 'Swift, Indica, Wagon R',
    basePrice: 200
  },
];

// Bike subtype options
const BIKE_TYPES = [
  { id: 'standard', name: 'Standard Bike', icon: FaMotorcycle, note: 'Best value', basePrice: 80 },
  { id: 'scooter', name: 'Scooter', icon: TbScooter, note: 'Easy & comfy', basePrice: 75 },
  { id: 'sports', name: 'Sports Bike', icon: FaMotorcycle, note: 'Fast & stylish', basePrice: 110 },
  { id: 'electric', name: 'Electric Bike', icon: MdElectricBike, note: 'Eco friendly', basePrice: 90 },
];

// Car subtype options
const CAR_TYPES = [
  { id: 'hatchback', name: 'Hatchback', icon: FaCarSide, seats: '4 Seats', bags: '2 Bags', note: 'City-friendly', basePrice: 200 },
  { id: 'sedan', name: 'Sedan', icon: FaCar, seats: '4 Seats', bags: '3 Bags', note: 'Comfort ride', basePrice: 240 },
  { id: 'suv', name: 'SUV', icon: FaShuttleVan, seats: '6 Seats', bags: '4 Bags', note: 'Spacious & powerful', basePrice: 320 },
  { id: 'premium', name: 'Premium', icon: FaCar, seats: '4 Seats', bags: '3 Bags', note: 'Luxury comfort', basePrice: 420 },
];

// Profile Overlay Component (Professional, full user details)
function ProfileOverlay({ user, onClose, onSave, rides = [] }) {
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    countryCode: '+91',
    birth: user?.birth || '',
    gender: user?.gender || ''
  });
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwData, setPwData] = useState({ current: '', next: '', confirm: '' });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const fileRef = useRef(null);

  const initials = (user?.full_name || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.full_name || !form.username || !form.email || !form.phone) {
      alert('Please fill all fields');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const updated = { ...user, ...form };
      if (form.countryCode && !form.phone.startsWith(form.countryCode)) {
        updated.phone = `${form.countryCode} ${form.phone}`.trim();
      }
      // attach avatar and persist locally for this user
      if (avatarUrl) {
        updated.avatar = avatarUrl;
        try { localStorage.setItem(`shareride_avatar_${form.username || user?.username || 'me'}`, avatarUrl); } catch {}
      }
      onSave?.(updated);
      setSaving(false);
    }, 300);
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    // Lock scrolling on both body and html for stronger effect
    document.body.classList.add('no-scroll');
    document.documentElement && document.documentElement.classList.add('no-scroll');
    // Additionally fix the body to prevent iOS/Android bounce (blank gaps)
    const scrollY = window.scrollY || window.pageYOffset || 0;
    try {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } catch {}
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      document.documentElement && document.documentElement.classList.remove('no-scroll');
      // Restore body scroll position
      try {
        const top = parseInt((document.body.style.top || '0').replace('px',''), 10);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        if (!Number.isNaN(top)) {
          window.scrollTo(0, Math.abs(top));
        }
      } catch {}
    };
  }, [onClose]);

  // Load avatar from localStorage if present
  useEffect(() => {
    try {
      const key = `shareride_avatar_${form.username || user?.username || 'me'}`;
      const saved = localStorage.getItem(key);
      if (!avatarUrl && saved) setAvatarUrl(saved);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const first = form.full_name.split(' ').slice(0, -1).join(' ') || form.full_name.split(' ')[0] || '';
  const last = form.full_name.split(' ').slice(-1).join(' ');

  // derive compact My Rides lists
  const offeredRides = (rides || []).filter(r => (user?.full_name && r.driver === user.full_name)).slice(0, 2);
  let joinedRides = [];
  try {
    const jr = JSON.parse(localStorage.getItem(`shareride_joined_${user?.username || 'me'}`) || '[]');
    if (Array.isArray(jr)) joinedRides = jr.slice(0, 2);
  } catch {}

  return (
    <div className="profile-overlay" role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target?.classList?.contains('profile-overlay')) onClose?.(); }}>
      <div className="profile-container profile-sheet" role="document">
        <div className="sheet-top">
          <button className="back-btn close-btn-red" onClick={onClose} aria-label="Close profile">
            <LuX aria-hidden="true" />
          </button>
          <div className="profile-hero" aria-hidden="true" />
          <div className="profile-avatar-lg" aria-hidden onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" />
            ) : (
              <span>{initials}</span>
            )}
            <span className="avatar-badge" title="Change photo"><LuPencil /></span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => {
                const data = String(reader.result || '');
                setAvatarUrl(data);
              };
              reader.readAsDataURL(f);
            }} />
          <h2 className="profile-title">Profile</h2>
        </div>

        <form className="sheet-form" onSubmit={(e)=>e.preventDefault()}>
          <div className="sheet-grid">
            <div className="location-input-group">
              <label className="location-label">First Name</label>
              <input className="location-input" value={first}
                onChange={(e)=>{ const f=e.target.value; setForm(x=>({ ...x, full_name:`${f} ${last}`.trim() })); }} placeholder="First name" />
            </div>
            <div className="location-input-group">
              <label className="location-label">Last Name</label>
              <input className="location-input" value={last}
                onChange={(e)=>{ const l=e.target.value; setForm(x=>({ ...x, full_name:`${first} ${l}`.trim() })); }} placeholder="Last name" />
            </div>
            <div className="location-input-group">
              <label className="location-label">Username</label>
              <input name="username" className="location-input" value={form.username} onChange={handleChange} placeholder="@username" />
            </div>
            <div className="location-input-group">
              <label className="location-label">Email</label>
              <input name="email" type="email" className="location-input" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <div className="location-input-group">
              <label className="location-label">Country</label>
              <select className="location-input" value={form.countryCode} onChange={(e)=>setForm(f=>({...f,countryCode:e.target.value}))}>
                {['+91','+1','+44','+61','+81','+234'].map(cc => (<option key={cc} value={cc}>{cc}</option>))}
              </select>
            </div>
            <div className="location-input-group">
              <label className="location-label">Phone</label>
              <input name="phone" type="tel" className="location-input" value={form.phone.replace(/^\+\d+\s*/, '')}
                onChange={(e)=>setForm(f=>({...f, phone:e.target.value }))} placeholder="Phone number" />
            </div>
            <div className="location-input-group">
              <label className="location-label">Birth</label>
              <input type="date" className="location-input" value={form.birth} onChange={(e)=>setForm(f=>({...f,birth:e.target.value}))} />
            </div>
            <div className="location-input-group">
              <label className="location-label">Gender</label>
              <select className="location-input" value={form.gender} onChange={(e)=>setForm(f=>({...f, gender:e.target.value}))}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="sheet-actions">
            <button type="button" className="cancel-profile-btn" onClick={()=>{
              setForm({
                full_name: user?.full_name || '', username: user?.username || '', email: user?.email || '',
                phone: user?.phone || '', countryCode: '+91', birth: user?.birth || '', gender: user?.gender || ''
              });
              setAvatarUrl(user?.avatar || '');
            }}>Cancel</button>
            <button type="button" className="save-profile-btn" disabled={saving} onClick={handleSave}>{saving?'Saving...':'Save Changes'}</button>
          </div>

          <div className="sheet-divider" />
          <div className="myrides-section">
            <h3 className="myrides-title">My Rides</h3>
            <div className="mini-ride-rows">
              <div className="mini-ride-col">
                <div className="mini-ride-heading">Offered</div>
                <div className="mini-ride-list">
                  {offeredRides.length === 0 ? (
                    <div className="mini-empty">No rides yet</div>
                  ) : (
                    offeredRides.map(r => (
                      <div key={r.id} className="mini-ride-card" title={`${r.from} → ${r.to}`}>
                        <div className="mini-route">{r.from} → {r.to}</div>
                        <div className="mini-meta">{r.date} • {r.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="mini-ride-col">
                <div className="mini-ride-heading">Joined</div>
                <div className="mini-ride-list">
                  {joinedRides.length === 0 ? (
                    <div className="mini-empty">No rides yet</div>
                  ) : (
                    joinedRides.map((r, idx) => (
                      <div key={r.id || idx} className="mini-ride-card" title={`${r.from} → ${r.to}`}>
                        <div className="mini-route">{r.from} → {r.to}</div>
                        <div className="mini-meta">{r.date} • {r.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="sheet-divider" />
          <button type="button" className="change-pass-btn" onClick={()=>setShowPw(s=>!s)}>
            <LuLock className="icon" aria-hidden="true" /> Change Password
          </button>
          {showPw && (
            <div className="pw-grid">
              <div className="location-input-group"><label className="location-label">Current Password</label>
                <input type="password" className="location-input" value={pwData.current} onChange={(e)=>setPwData({...pwData,current:e.target.value})} /></div>
              <div className="location-input-group"><label className="location-label">New Password</label>
                <input type="password" className="location-input" value={pwData.next} onChange={(e)=>setPwData({...pwData,next:e.target.value})} /></div>
              <div className="location-input-group"><label className="location-label">Confirm New Password</label>
                <input type="password" className="location-input" value={pwData.confirm} onChange={(e)=>setPwData({...pwData,confirm:e.target.value})} /></div>
              <div className="sheet-actions" style={{marginTop:8}}>
                <button type="button" className="cancel-profile-btn" onClick={()=>{ setPwData({current:'',next:'',confirm:''}); setShowPw(false);} }>Cancel</button>
                <button type="button" className="save-profile-btn" onClick={()=>{
                  if (!pwData.next || pwData.next !== pwData.confirm) { alert('Passwords do not match'); return; }
                  try { const key='shareride_pw_overrides'; const map=JSON.parse(localStorage.getItem(key)||'{}'); map[form.username||user?.username]=pwData.next; localStorage.setItem(key, JSON.stringify(map)); alert('Password updated for this device'); setShowPw(false); setPwData({current:'',next:'',confirm:''}); } catch {}
                }}>Save Password</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Offer Ride Form
function OfferRideForm({ onBack, onOfferCreated, currentUser }) {
  const [tripType, setTripType] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [vehicleBase, setVehicleBase] = useState('car'); // bike | auto | car
  const [vehicleSubtype, setVehicleSubtype] = useState(null); // for bike/car

  const useMyLocation = async () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setFromCoords({ lat: latitude, lng: longitude });
      if (!from) setFrom('My current location');
  // ready to set destination next
    }, () => alert('Unable to get location'));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date || !time || !seats) {
      alert('Please fill From, To, Date, Time, and Seats');
      return;
    }
    if (!vehicleBase) {
      alert('Please select vehicle type');
      return;
    }
    if ((vehicleBase === 'bike' || vehicleBase === 'car') && !vehicleSubtype) {
      alert(`Please select a ${vehicleBase} type`);
      return;
    }
    const ride = {
      id: Date.now(),
      driver: currentUser?.full_name || 'You',
      from,
      to,
      date,
      time,
      seats: Number(seats),
      price: price ? Number(price) : undefined,
      vehicle: vehicleInfo || `${vehicleBase}${vehicleSubtype ? ' - ' + vehicleSubtype.name : ''}`,
      vehicleType: vehicleBase,
      vehicleSubtype: vehicleSubtype ? vehicleSubtype.id : undefined,
      rating: 5.0,
      pickup: 'As arranged',
    };
    onOfferCreated?.(ride);
    alert('Ride offered!\n' + JSON.stringify(ride, null, 2));
    onBack?.();
  };

  return (
    <div className="booking-section" style={{ paddingTop: 'var(--space-6)' }}>
      <div className="booking-container">
  <div className="multi-city-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Offer a Ride</h2>
          <button type="button" className="btn-outline" onClick={onBack}>{'← Back'}</button>
        </div>

        <div className="trip-type-selector" style={{ marginTop: 'var(--space-4)' }}>
          <button className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`} type="button" onClick={() => setTripType('one-way')}>
            <LuArrowRight className="icon" aria-hidden="true" />
            <span>One Way</span>
          </button>
          <button className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`} type="button" onClick={() => setTripType('round-trip')}>
            <LuRepeat2 className="icon" aria-hidden="true" />
            <span>Round Trip</span>
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ marginTop: 'var(--space-6)' }}>
          <h3>Route Information</h3>
          <div className="location-inputs">
            <div className="location-input-group">
              <label className="location-label">📍 From</label>
              <input type="text" className="location-input" placeholder="Pickup location" value={from} onChange={(e) => setFrom(e.target.value)} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="button" className="btn-outline" onClick={useMyLocation}>Use my location</button>
              </div>
              {fromCoords && <div style={{ fontSize: 12, color: 'var(--text-gray)', marginTop: 6 }}>Lat: {fromCoords.lat.toFixed(5)} Lng: {fromCoords.lng.toFixed(5)}</div>}
            </div>
            <div className="location-input-group">
              <label className="location-label">🎯 To</label>
              <input type="text" className="location-input" placeholder="Destination" value={to} onChange={(e) => setTo(e.target.value)} />
              {toCoords && <div style={{ fontSize: 12, color: 'var(--text-gray)', marginTop: 6 }}>Lat: {toCoords.lat.toFixed(5)} Lng: {toCoords.lng.toFixed(5)}</div>}
            </div>
          </div>


          <h3 style={{ marginTop: 'var(--space-6)' }}>Schedule</h3>
          <div className="date-inputs">
            <div className="date-input-group">
              <label className="date-label"><LuCalendarDays className="icon" aria-hidden="true" />Departure Date</label>
              <input type="date" className="date-input" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="date-input-group">
              <label className="date-label">Departure Time</label>
              <input type="time" className="date-input" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <h3 style={{ marginTop: 'var(--space-6)' }}>Vehicle Type</h3>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['bike','auto','car'].map(v => (
              <button type="button" key={v} className={`chip ${vehicleBase===v?'active':''}`} onClick={() => { setVehicleBase(v); setVehicleSubtype(null); }}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>
          {(vehicleBase === 'bike') && (
            <div style={{ marginTop:12 }}>
              <label className="location-label" style={{ display:'block', marginBottom:8 }}>Select Bike Type</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {BIKE_TYPES.map(b => (
                  <button type="button" key={b.id} className={`chip ${vehicleSubtype?.id===b.id?'active':''}`} onClick={() => setVehicleSubtype(b)}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(vehicleBase === 'car') && (
            <div style={{ marginTop:12 }}>
              <label className="location-label" style={{ display:'block', marginBottom:8 }}>Select Car Type</label>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {CAR_TYPES.map(c => (
                  <button type="button" key={c.id} className={`chip ${vehicleSubtype?.id===c.id?'active':''}`} onClick={() => setVehicleSubtype(c)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ marginTop: 'var(--space-6)' }}>Ride Details</h3>
          <div className="location-inputs">
            <div className="location-input-group">
              <label className="location-label">Available Seats</label>
              <input type="number" min="1" max="6" className="location-input" value={seats} onChange={(e) => setSeats(e.target.value)} />
            </div>
            <div className="location-input-group">
              <label className="location-label">Price per Seat (₹)</label>
              <input type="number" min="0" className="location-input" placeholder="Price per seat" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div className="location-inputs">
            <div className="location-input-group" style={{ flex: 1 }}>
              <label className="location-label">Vehicle Details</label>
              <input type="text" className="location-input" placeholder="Car model, color, and license plate" value={vehicleInfo} onChange={(e) => setVehicleInfo(e.target.value)} />
            </div>
          </div>

          <div className="booking-actions" style={{ marginTop: 'var(--space-6)' }}>
            <button className="btn-primary" type="submit" style={{ width: '100%', padding: 'var(--space-4)' }}>
              Share Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Vehicle Selection Component
function BikeTypeSelection({ onBack, onSelect, distance }) {
  return (
    <div className="bike-types">
      <button type="button" className="btn-back" onClick={onBack} aria-label="Back to vehicles">
        <LuChevronLeft className="icon" aria-hidden="true" /> Back to vehicles
      </button>
      <h3 className="bike-title">Select Bike Type</h3>
      <div className="subtype-grid">
        {BIKE_TYPES.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.id} className="subtype-card">
              <div className="subtype-head">
                <div className="vehicle-icon"><Icon aria-hidden="true" /></div>
                <div className="subtype-name">{b.name}</div>
              </div>
              <div className="vehicle-details">
                <span className="vehicle-feature"><LuUsers className="feature-icon seats" aria-hidden="true" /> 2 Seats</span>
                <span className="vehicle-feature"><LuBriefcase className="feature-icon bags" aria-hidden="true" /> 1 Bag</span>
                <span className="vehicle-feature"><LuSnowflake className="feature-icon ac" aria-hidden="true" /> AC</span>
              </div>
              <div className="vehicle-actions">
                <button type="button" className="btn-choose" onClick={() => onSelect(b)}>
                  Select
                </button>
                <button type="button" className="btn-outline" onClick={() => alert(`${b.name} - ${b.note}`)}>
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CarTypeSelection({ onBack, onSelect, distance }) {
  return (
    <div className="bike-types">
      <button type="button" className="btn-back" onClick={onBack} aria-label="Back to vehicles">
        <LuChevronLeft className="icon" aria-hidden="true" /> Back to vehicles
      </button>
      <h3 className="bike-title">Select Car Type</h3>
      <div className="subtype-grid">
        {CAR_TYPES.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.id} className="subtype-card">
              <div className="subtype-head">
                <div className="vehicle-icon"><Icon aria-hidden="true" /></div>
                <div className="subtype-name">{c.name}</div>
              </div>
              <div className="vehicle-details">
                <span className="vehicle-feature"><LuUsers className="feature-icon seats" aria-hidden="true" /> {c.seats}</span>
                <span className="vehicle-feature"><LuBriefcase className="feature-icon bags" aria-hidden="true" /> {c.bags}</span>
                <span className="vehicle-feature"><LuSnowflake className="feature-icon ac" aria-hidden="true" /> AC</span>
              </div>
              <div className="vehicle-actions">
                <button type="button" className="btn-choose" onClick={() => onSelect(c)}>
                  Select
                </button>
                <button type="button" className="btn-outline" onClick={() => alert(`${c.name} - ${c.note}`)}>
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VehicleSelection({ selectedVehicle, onVehicleSelect, distance = 25 }) {
  const [showBikeTypes, setShowBikeTypes] = useState(false);
  const [showCarTypes, setShowCarTypes] = useState(false);

  if (showBikeTypes) {
    return (
      <BikeTypeSelection
        distance={distance}
        onBack={() => setShowBikeTypes(false)}
        onSelect={(bikeType) => {
          // augment selected vehicle with subtype and update selection
          const baseBike = VEHICLE_TYPES.find(v => v.id === 'bike');
          onVehicleSelect({ ...baseBike, subtype: bikeType });
          setShowBikeTypes(false);
        }}
      />
    );
  }

  if (showCarTypes) {
    return (
      <CarTypeSelection
        distance={distance}
        onBack={() => setShowCarTypes(false)}
        onSelect={(carType) => {
          const baseCar = VEHICLE_TYPES.find(v => v.id === 'car');
          onVehicleSelect({ ...baseCar, subtype: carType });
          setShowCarTypes(false);
        }}
      />
    );
  }

  return (
    <div className="vehicle-selection">
      <h3 style={{ marginBottom: 'var(--space-6)', color: 'var(--text-dark)', textAlign: 'center' }}>
        Select Vehicle Type
      </h3>
      <div className="vehicle-grid">
  {VEHICLE_TYPES.map(vehicle => {
          const VehicleIcon = vehicle.icon === 'bike' ? FaMotorcycle : vehicle.icon === 'auto' ? FaTaxi : FaCarSide;
          const onCardClick = () => {
            if (vehicle.id === 'bike') {
              setShowBikeTypes(true);
              onVehicleSelect(vehicle);
            } else if (vehicle.id === 'car') {
              setShowCarTypes(true);
              onVehicleSelect(vehicle);
            } else {
              onVehicleSelect(vehicle);
            }
          };
          return (
            <div
              key={vehicle.id}
              className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
              data-vehicle-id={vehicle.id}
              onClick={onCardClick}
            >
              <div className="vehicle-card-top">
                <div className="vehicle-icon"><VehicleIcon aria-hidden="true" /></div>
                <div className="vehicle-name">{vehicle.name}</div>
              </div>
              <div className="vehicle-details">
                <span className="vehicle-feature"><LuUsers className="feature-icon seats" aria-hidden="true" /> {vehicle.seats}</span>
                <span className="vehicle-feature"><LuBriefcase className="feature-icon bags" aria-hidden="true" /> {vehicle.bags}</span>
                <span className="vehicle-feature"><LuSnowflake className="feature-icon ac" aria-hidden="true" /> AC</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-gray)', marginBottom: 'var(--space-3)' }}>
                {vehicle.models}
              </div>
              <div className="vehicle-actions">
                <button
                  type="button"
                  className="btn-choose"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (vehicle.id === 'bike') {
                      setShowBikeTypes(true);
                      onVehicleSelect(vehicle);
                    } else if (vehicle.id === 'car') {
                      setShowCarTypes(true);
                      onVehicleSelect(vehicle);
                    } else {
                      onVehicleSelect(vehicle);
                    }
                  }}
                  aria-label={`Choose ${vehicle.name}`}
                >
                  {vehicle.id === 'bike' ? 'Choose Bike Type' : vehicle.id === 'car' ? 'Choose Car Type' : 'Choose'}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={(e) => { e.stopPropagation(); alert(`${vehicle.name}: ${vehicle.seats}, ${vehicle.bags}, AC`); }}
                  aria-label={`${vehicle.name} details`}
                >
                  Details
                </button>
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
      // Check overrides saved in localStorage via Change Password
      let overridePw = undefined;
      try {
        const map = JSON.parse(localStorage.getItem('shareride_pw_overrides') || '{}');
        overridePw = map[username];
      } catch {}

      const userRecord = MOCK_USERS.find(u => u.username === username);
      const ok = userRecord && (
        (overridePw && password === overridePw) || password === userRecord.password
      );

      if (ok) {
        onLogin(userRecord);
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
function Dashboard({ user, onLogout, rides, onOfferCreated, onJoinRide, onUserUpdate }) {
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
  const bookingRef = useRef(null);
  const fromInputRef = useRef(null);
  const [showOffer, setShowOffer] = useState(false);
  const [showQuickRide, setShowQuickRide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [qrFrom, setQrFrom] = useState('');
  const [qrTo, setQrTo] = useState('');
  const [qrVehicle, setQrVehicle] = useState('auto'); // bike | auto | car
  const [qrBusy, setQrBusy] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quickRideMode, setQuickRideMode] = useState(false);
  const [quickRideWindow, setQuickRideWindow] = useState(null); // { start: Date, end: Date }

  const startQuickRide = () => {
    setShowQuickRide(true);
    // try to set current location text if not set
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        if (!qrFrom) setQrFrom('My current location');
      });
    }
  };

  const confirmQuickRide = async () => {
    if (!qrFrom || !qrTo) {
      alert('Please enter From and To');
      return;
    }
    setQrBusy(true);
    // Prefill main booking form for immediate search
    setTripType('one-way');
    setFromLocation(qrFrom);
    setToLocation(qrTo);
    const base = VEHICLE_TYPES.find(v => v.id === qrVehicle);
    setSelectedVehicle(base || null);
    const now = new Date();
    setDepartureDate(now.toISOString().split('T')[0]);
    // Quick ride accepts rides within next 10-20 minutes only
    const start = new Date(now.getTime() + 10 * 60 * 1000);
    const end = new Date(now.getTime() + 20 * 60 * 1000);
    setQuickRideMode(true);
    setQuickRideWindow({ start, end });
    setShowQuickRide(false);
    setQrBusy(false);
    // Scroll to the search button and focus From
    bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => fromInputRef.current?.focus(), 300);
    // Auto-run search for convenience
    setTimeout(() => runSearch(true), 50);
  };

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

  const runSearch = (fromQuick = false) => {
    // Simple client-side match using rides list
    const norm = (s) => (s||'').toLowerCase().trim();
    const fromN = norm(fromLocation);
    const toN = norm(toLocation);
    const dateN = departureDate;
    let results = (rides||[]).filter(r =>
      (!fromN || norm(r.from).includes(fromN)) &&
      (!toN || norm(r.to).includes(toN)) &&
      (!dateN || r.date === dateN)
    );
    // If quick ride mode, tighten to rides departing within [start,end]
    if (quickRideMode && quickRideWindow && dateN) {
      const makeDateTime = (dStr, tStr) => {
        try {
          const [hh, mm] = (tStr||'00:00').split(':').map(n => parseInt(n,10));
          const d = new Date(dStr + 'T00:00:00');
          d.setHours(hh || 0, mm || 0, 0, 0);
          return d;
        } catch { return null; }
      };
      results = results.filter(r => {
        const dt = makeDateTime(r.date, r.time);
        return dt && dt >= quickRideWindow.start && dt <= quickRideWindow.end;
      });
    }
    setSearchResults(results);
    setShowResults(true);
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
                Welcome!
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      
      {showOffer ? (
  <OfferRideForm onBack={() => setShowOffer(false)} onOfferCreated={onOfferCreated} currentUser={user} />
      ) : (
      <>
      <div className="booking-section" ref={bookingRef}>
        <div className="booking-container">
          <h2 style={{ margin: '0 0 var(--space-4)', color: '#111827' }}>Find a Ride</h2>
          {/* Trip Type Selector */}
          <div className="trip-type-selector">
            <button 
              className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('one-way')}
              type="button"
              role="tab"
              aria-selected={tripType === 'one-way'}
            >
              <LuArrowRight className="icon" aria-hidden="true" />
              <span>One Way</span>
            </button>
            <button 
              className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('round-trip')}
              type="button"
              role="tab"
              aria-selected={tripType === 'round-trip'}
            >
              <LuRepeat2 className="icon" aria-hidden="true" />
              <span>Round Trip</span>
            </button>
            <button 
              className={`trip-type-btn ${tripType === 'multi-city' ? 'active' : ''}`}
              onClick={() => handleTripTypeChange('multi-city')}
              type="button"
              role="tab"
              aria-selected={tripType === 'multi-city'}
            >
              <LuRoute className="icon" aria-hidden="true" />
              <span>Multi City</span>
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
                    ref={fromInputRef}
                  />
                </div>
                
                <div className="swap-button-container">
                  <button className="swap-btn" onClick={swapLocations} type="button" aria-label="Swap locations">
                    <LuArrowLeftRight className="icon" aria-hidden="true" />
                  </button>
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
                  <label className="date-label">
                    <LuCalendarDays className="icon" aria-hidden="true" />
                    Departure Date
                  </label>
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
                    <label className="date-label">
                      <LuRepeat2 className="icon" aria-hidden="true" />
                      Return Date
                    </label>
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
                      <label className="date-label">
                        <LuCalendarDays className="icon" aria-hidden="true" />
                        Date
                      </label>
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
              onClick={(e) => { e.preventDefault(); runSearch(); }}
            >
              {tripType === 'one-way' && '🔍 Search One Way Rides'}
              {tripType === 'round-trip' && '🔍 Search Round Trip Rides'}
              {tripType === 'multi-city' && '🔍 Search Multi-City Rides'}
            </button>
          </div>
        </div>
    </div>

  <div className="quick-actions">
        <div className="quick-action-card" data-action="quick">
          <div className="quick-action-icon" aria-hidden="true"><FaBolt /></div>
          <div className="quick-action-content">
            <h3>Quick Ride</h3>
            <p>Emergency fast booking</p>
          </div>
          <button
            type="button"
            className="qa-btn"
            aria-label="Quick ride"
            onClick={startQuickRide}
          >
            Start Now <LuArrowRight className="qa-btn-icon" aria-hidden="true" />
          </button>
        </div>
        <div className="quick-action-card" data-action="offer">
          <div className="quick-action-icon" aria-hidden="true"><LuCar /></div>
          <div className="quick-action-content">
            <h3>Offer a Ride</h3>
            <p>Share your journey and earn money</p>
          </div>
          <button
            type="button"
            className="qa-btn"
            aria-label="Offer a ride"
    onClick={() => setShowOffer(true)}
          >
            Offer Ride <LuArrowRight className="qa-btn-icon" aria-hidden="true" />
          </button>
        </div>


        <div className="quick-action-card" data-action="profile">
          <div className="quick-action-icon" aria-hidden="true"><LuUser /></div>
          <div className="quick-action-content">
            <h3>Profile</h3>
            <p>Manage your account settings</p>
          </div>
          <button
            type="button"
            className="qa-btn"
            aria-label="Open profile"
            onClick={() => setShowProfile(true)}
          >
            Profile <LuArrowRight className="qa-btn-icon" aria-hidden="true" />
          </button>
        </div>
  </div>

      {showQuickRide && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Quick Ride (Emergency)</h3>
              <button className="btn-outline" onClick={() => setShowQuickRide(false)} aria-label="Close quick ride">✕</button>
            </div>
            <div className="modal-body">
              <div className="location-inputs">
                <div className="location-input-group">
                  <label className="location-label">📍 From</label>
                  <input type="text" className="location-input" placeholder="Your pickup" value={qrFrom} onChange={(e)=>setQrFrom(e.target.value)} />
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    <button type="button" className="btn-outline" onClick={() => {
                      if (!navigator.geolocation) return alert('Geolocation not supported');
                      navigator.geolocation.getCurrentPosition(() => setQrFrom('My current location'), () => alert('Location unavailable'));
                    }}>Use my location</button>
                  </div>
                </div>
                <div className="location-input-group">
                  <label className="location-label">🎯 To</label>
                  <input type="text" className="location-input" placeholder="Destination" value={qrTo} onChange={(e)=>setQrTo(e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop:12 }}>
                <label className="location-label" style={{ display:'block', marginBottom:8 }}>Preferred Vehicle</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {['bike','auto','car'].map(v => (
                    <button key={v} type="button" className={`chip ${qrVehicle===v?'active':''}`} onClick={()=>setQrVehicle(v)}>
                      {v.charAt(0).toUpperCase()+v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={()=>setShowQuickRide(false)}>Cancel</button>
              <button className="btn-primary" onClick={confirmQuickRide} disabled={qrBusy}>
                {qrBusy? 'Preparing...' : 'Request Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="available-rides">
          <div className="rides-header">
            <h3>Available Rides</h3>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              {quickRideMode && quickRideWindow && (
                <div style={{ fontSize:12, color:'#374151', background:'#F3F4F6', padding:'6px 10px', borderRadius:8 }}>
                  Quick Ride window: {quickRideWindow.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {quickRideWindow.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              <button className="reset-search-btn" type="button" onClick={() => { setShowResults(false); setQuickRideMode(false); setQuickRideWindow(null); }}>Reset</button>
            </div>
          </div>
          {searchResults.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">🗂️</div>
              No rides found. Try different locations or date.
            </div>
          ) : (
            <div className="ride-cards">
              {searchResults.map(r => (
                <div className="ride-card" key={r.id}>
                  <div className="ride-info">
                    <p><strong>From:</strong> {r.from}</p>
                    <p><strong>To:</strong> {r.to}</p>
                    <p><strong>Date:</strong> {r.date} <strong>Time:</strong> {r.time}</p>
                    {r.vehicle && <p><strong>Vehicle:</strong> {r.vehicle}</p>}
                    <p><strong>Driver:</strong> {r.driver}</p>
                    {typeof r.price !== 'undefined' && <p><strong>Price:</strong> ₹{r.price}</p>}
                  </div>
                  <button className="join-btn" type="button" onClick={() => onJoinRide?.(r)}>Join</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showProfile && (
        <ProfileOverlay
          user={user}
          rides={rides}
          onClose={() => setShowProfile(false)}
          onSave={(updated) => {
            onUserUpdate?.(updated);
            setShowProfile(false);
          }}
        />
      )}
  </>
  )}
    </div>
  );
}

// Main App Component
function ShareRideApp() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rides, setRides] = useState([...MOCK_RIDES]);

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

  const handleOfferCreated = (ride) => {
    setRides((prev) => [ride, ...prev]);
  };

  const handleJoinRide = (ride) => {
    try {
      const username = user?.username || 'me';
      const key = `shareride_joined_${username}`;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = Array.isArray(list) ? [...list, ride] : [ride];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
    alert(`Ride joined!\n${ride.from} → ${ride.to} on ${ride.date} at ${ride.time}`);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('shareride_user', JSON.stringify(updatedUser));
    } catch {}
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
  rides={rides}
  onOfferCreated={handleOfferCreated}
  onJoinRide={handleJoinRide}
  onUserUpdate={handleUserUpdate}
      />
    </div>
  );
}

export default ShareRideApp;
