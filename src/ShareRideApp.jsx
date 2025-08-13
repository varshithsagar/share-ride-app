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
      window.__notify && window.__notify('Please fill all fields', 'error');
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
      // Persist profile into shared profiles map for cross-user display (best-effort)
      try {
        const mapKey = 'shareride_profiles';
        const profileMap = JSON.parse(localStorage.getItem(mapKey) || '{}');
        profileMap[updated.username] = {
          full_name: updated.full_name,
            username: updated.username,
            email: updated.email,
            phone: updated.phone,
            gender: updated.gender || '',
            birth: updated.birth || '',
            avatar: updated.avatar || ''
        };
        localStorage.setItem(mapKey, JSON.stringify(profileMap));
      } catch {}
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
                  if (!pwData.next || pwData.next !== pwData.confirm) { window.__notify && window.__notify('Passwords do not match','error'); return; }
                  try { const key='shareride_pw_overrides'; const map=JSON.parse(localStorage.getItem(key)||'{}'); map[form.username||user?.username]=pwData.next; localStorage.setItem(key, JSON.stringify(map)); window.__notify && window.__notify('Password updated','success'); setShowPw(false); setPwData({current:'',next:'',confirm:''}); } catch {}
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
  const handleNumberWheel = (e) => { e.preventDefault(); e.currentTarget.blur(); };

  const useMyLocation = async () => {
  if (!navigator.geolocation) return window.__notify && window.__notify('Geolocation not supported','error');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setFromCoords({ lat: latitude, lng: longitude });
      if (!from) setFrom('My current location');
  // ready to set destination next
  }, () => window.__notify && window.__notify('Unable to get location','error'));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date || !time || !seats) {
      window.__notify && window.__notify('Fill From, To, Date, Time & Seats','error');
      return;
    }
    if (!vehicleBase) {
      window.__notify && window.__notify('Select vehicle type','error');
      return;
    }
    if ((vehicleBase === 'bike' || vehicleBase === 'car') && !vehicleSubtype) {
      window.__notify && window.__notify(`Select a ${vehicleBase} subtype`,'error');
      return;
    }
    const ride = {
      id: Date.now(),
      driver: currentUser?.full_name || 'You',
      driverUsername: currentUser?.username || 'you',
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
    window.__notify && window.__notify('Ride offered','success');
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
              <input type="number" min="1" max="6" className="location-input" value={seats} onChange={(e) => setSeats(e.target.value)} onWheel={handleNumberWheel} />
            </div>
            <div className="location-input-group">
              <label className="location-label">Price per Seat (₹)</label>
              <input type="number" min="0" className="location-input" placeholder="Price per seat" value={price} onChange={(e) => setPrice(e.target.value)} onWheel={handleNumberWheel} />
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
                <button type="button" className="btn-outline" onClick={() => window.__notify && window.__notify(`${b.name} – ${b.note}`,'info')}>
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
                <button type="button" className="btn-outline" onClick={() => window.__notify && window.__notify(`${c.name} – ${c.note}`,'info')}>
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
                  onClick={(e) => { e.stopPropagation(); window.__notify && window.__notify(`${vehicle.name}: ${vehicle.seats}, ${vehicle.bags}, AC`,'info'); }}
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
function Dashboard({ user, onLogout, rides, onOfferCreated, onJoinRide, onLeaveRide, onUserUpdate, joinedVersion, setJoinedVersion, onStartRide, onRemovePassenger, onMessagePassengers }) {
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
  const [passengersModalRide, setPassengersModalRide] = useState(null);

  // derive offered rides for user
  const offeredRides = (rides||[]).filter(r => (
    (user?.full_name && r.driver === user.full_name) || (user?.username && r.driverUsername === user.username)
  ));
  // derive joined rides from localStorage
  const joinedRides = (() => {
    try {
      const list = JSON.parse(localStorage.getItem(`shareride_joined_${user?.username || 'me'}`) || '[]');
      if (!Array.isArray(list)) return [];
      // Sort by joinedAt (desc) if present, fallback to id/time
      return [...list].sort((a,b) => (b.joinedAt||0) - (a.joinedAt||0));
    } catch { return []; }
  })();
  const joinedRideIds = new Set(joinedRides.map(r => r.id));

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
      window.__notify && window.__notify('Enter From & To','error');
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
                      if (!navigator.geolocation) return window.__notify && window.__notify('Geolocation not supported','error');
                      navigator.geolocation.getCurrentPosition(() => setQrFrom('My current location'), () => window.__notify && window.__notify('Location unavailable','error'));
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
              {searchResults.map(r => {
                const passengerCount = Array.isArray(r.passengers) ? r.passengers.length : 0;
                const capacity = typeof r.seats === 'number' ? r.seats : undefined;
                const full = capacity !== undefined && passengerCount >= capacity;
                return (
                  <div className="ride-card" key={r.id}>
                    <div className="ride-info">
                      <p><strong>From:</strong> {r.from}</p>
                      <p><strong>To:</strong> {r.to}</p>
                      <p><strong>Date:</strong> {r.date} <strong>Time:</strong> {r.time}</p>
                      {r.vehicle && <p><strong>Vehicle:</strong> {r.vehicle}</p>}
                      <p><strong>Driver:</strong> {r.driver}</p>
                      {capacity !== undefined && (
                        <p><strong>Seats:</strong> {capacity - passengerCount > 0 ? `${capacity - passengerCount} left / ${capacity}` : `Full (${capacity})`}</p>
                      )}
                      {typeof r.price !== 'undefined' && <p><strong>Price:</strong> ₹{r.price}</p>}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {!joinedRideIds.has(r.id) && !full && (
                        <button className="join-btn" type="button" onClick={() => onJoinRide?.(r)}>Join</button>
                      )}
                      {!joinedRideIds.has(r.id) && full && (
                        <button className="join-btn" type="button" disabled style={{ background:'#9ca3af', cursor:'not-allowed' }}>Full</button>
                      )}
                      {joinedRideIds.has(r.id) && (
                        <>
                          <button type="button" className="join-btn" style={{ background:'#6366f1' }} onClick={()=> setPassengersModalRide(r)}>View Passengers</button>
                          <button type="button" className="join-btn" style={{ background:'#dc2626' }} onClick={()=> onLeaveRide?.(r)}>Leave Ride</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* External My Rides section */}
      <div className="available-rides" style={{ marginTop: 24 }}>
        <div className="rides-header">
          <h3>My Rides</h3>
          <button className="reset-search-btn" type="button" onClick={()=>setJoinedVersion(v=>v+1)}>Refresh</button>
        </div>
        <div className="ride-cards" style={{ gap: 12 }}>
          <div style={{ flex: 1, minWidth: '100%' }}>
            <h4 style={{ margin: '4px 0 8px', fontSize: 14, textTransform:'uppercase', letterSpacing:'.5px', color:'#374151' }}>Offered</h4>
            {offeredRides.length === 0 ? <div className="history-empty" style={{ padding: 16 }}>No offered rides</div> : (
              <div className="ride-cards" style={{ padding:0 }}>
                {offeredRides.map(r => {
                  const passengerCount = Array.isArray(r.passengers) ? r.passengers.length : 0;
                  const capacity = typeof r.seats === 'number' ? r.seats : undefined;
                  return (
                    <div key={r.id} className="ride-card" style={{ margin:0 }}>
                      <div className="ride-info">
                        <p><strong>{r.from}</strong> → <strong>{r.to}</strong></p>
                        <p>{r.date} • {r.time}</p>
                        {r.vehicle && <p>{r.vehicle}</p>}
                        {capacity !== undefined && (
                          <p><strong>Seats:</strong> {capacity - passengerCount > 0 ? `${capacity - passengerCount} left / ${capacity}` : `Full (${capacity})`}</p>
                        )}
                        {r.startedAt && <p style={{ color:'#059669', fontWeight:600 }}>Status: In Progress</p>}
                      </div>
                      {user?.username && r.driverUsername === user.username && (
                        <div style={{ display:'flex', flexDirection:'column', gap:8, width:'100%' }}>
                          <button type="button" className="join-btn" onClick={()=> setPassengersModalRide(r)}>View Passengers</button>
                          <button type="button" className="join-btn" style={{ background:'linear-gradient(135deg,#10b981,#059669)' }} onClick={()=> onStartRide?.(r)}>
                            {r.startedAt ? 'Ride Started' : 'Start Ride & WhatsApp'}
                          </button>
                          <button type="button" className="join-btn" style={{ background:'#2563eb' }} onClick={()=> onMessagePassengers?.(r)}>Message Passengers</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <h4 style={{ margin: '20px 0 8px', fontSize: 14, textTransform:'uppercase', letterSpacing:'.5px', color:'#374151' }}>Joined</h4>
            {joinedRides.length === 0 ? <div className="history-empty" style={{ padding: 16 }}>No joined rides</div> : (
              <div className="ride-cards" style={{ padding:0 }}>
                {joinedRides.map((r, idx) => {
                  const passengerCount = Array.isArray(r.passengers) ? r.passengers.length : 0;
                  const capacity = typeof r.seats === 'number' ? r.seats : undefined;
                  // Use authoritative ride (may have more recent passengers) if available
                  const liveRide = (rides||[]).find(x => x.id === r.id) || r;
                  const livePassengers = Array.isArray(liveRide.passengers) ? liveRide.passengers : [];
                  return (
                    <div key={r.id || idx} className="ride-card" style={{ margin:0 }}>
                      <div className="ride-info">
                        <p><strong>{r.from}</strong> → <strong>{r.to}</strong></p>
                        <p>{r.date} • {r.time}</p>
                        {r.vehicle && <p>{r.vehicle}</p>}
                        <p style={{ fontSize:12, color:'#6b7280' }}>Driver: {r.driver}</p>
                        {capacity !== undefined && (
                          <p><strong>Seats:</strong> {capacity - passengerCount > 0 ? `${capacity - passengerCount} left / ${capacity}` : `Full (${capacity})`}</p>
                        )}
                        {livePassengers.length > 0 && (
                          <div style={{ marginTop:6 }}>
                            <div style={{ fontSize:12, fontWeight:600, color:'#111827', marginBottom:4 }}>Passengers:</div>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                              {livePassengers.map(p => (
                                <span key={p.username + (p.joinedAt||'')} style={{ background:'#eef2ff', color:'#3730a3', padding:'4px 8px', borderRadius:20, fontSize:11, fontWeight:500 }}>
                                  {(p.name || p.username || '').split(' ').slice(0,2).join(' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        <button type="button" className="join-btn" style={{ background:'#6366f1' }} onClick={()=> setPassengersModalRide(r)}>View Passengers</button>
                        <button type="button" className="join-btn" style={{ background:'#dc2626' }} onClick={()=> onLeaveRide?.(r)}>Leave Ride</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
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
      {passengersModalRide && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth:480 }}>
            <div className="modal-header">
              <h3 style={{ marginBottom:0 }}>Passengers ({passengersModalRide.passengers?.length||0})</h3>
              {passengersModalRide.driverUsername === user?.username && passengersModalRide.passengers?.length > 0 && (
                <button type="button" className="join-btn" style={{ background:'#2563eb', padding:'6px 12px', fontSize:12 }} onClick={()=> onMessagePassengers?.(passengersModalRide)}>Message</button>
              )}
            </div>
            <div className="modal-body" style={{ maxHeight:320, overflowY:'auto' }}>
              {(!passengersModalRide.passengers || passengersModalRide.passengers.length===0) && (
                <div style={{ padding:16, fontSize:14, color:'#6b7280' }}>No passengers yet.</div>
              )}
              {passengersModalRide.passengers && passengersModalRide.passengers.map(p => {
                const showPhone = (passengersModalRide.driverUsername && passengersModalRide.driverUsername === user?.username) || p.username === user?.username;
                // Attempt to enrich with mock profile data (or any future persisted profile info)
                // Merge from stored profiles map, snapshot on passenger record, or mock fallback
                let storedProfile = {};
                try {
                  const map = JSON.parse(localStorage.getItem('shareride_profiles')||'{}');
                  storedProfile = map[p.username] || {};
                } catch {}
                const profile = { ...(p.profile||{}), ...storedProfile };
                const fullName = p.name || profile.full_name || p.username;
                const initials = (fullName||'?').split(/\s+/).map(s=>s[0]).join('').slice(0,2).toUpperCase();
                const isDriver = passengersModalRide.driverUsername && passengersModalRide.driverUsername === user?.username;
                return (
                  <div key={p.username + p.joinedAt} style={{ border:'1px solid #e5e7eb', borderRadius:12, padding:14, marginBottom:14, background:'#f9fafb' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      {profile.avatar ? (
                        <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
                          <img src={profile.avatar} alt={fullName} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </div>
                      ) : (
                        <div style={{ width:44, height:44, borderRadius:'50%', background:'#2563eb', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:14, flexShrink:0 }} aria-hidden="true">{initials}</div>
                      )}
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:15, color:'#111827' }}>{fullName}</div>
                        <div style={{ fontSize:12, color:'#6b7280' }}>@{p.username}</div>
                      </div>
                      {isDriver && (
                        <button type="button" onClick={() => {
                          if (!window.confirm(`Remove passenger ${fullName}?`)) return;
                          const updatedRide = onRemovePassenger?.(passengersModalRide.id, p.username);
                          if (updatedRide) setPassengersModalRide(updatedRide);
                        }} className="join-btn" style={{ background:'#dc2626', padding:'4px 10px', fontSize:12 }}>
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ marginTop:10, display:'grid', gap:6 }}>
                      {profile.email && (<div style={{ fontSize:12, color:'#374151' }}>Email: <strong>{profile.email}</strong></div>)}
                      {profile.gender && (<div style={{ fontSize:12, color:'#374151' }}>Gender: <strong>{profile.gender}</strong></div>)}
                      {profile.birth && (<div style={{ fontSize:12, color:'#374151' }}>Birth: <strong>{profile.birth}</strong></div>)}
                      {showPhone && p.phone && (
                        <div style={{ fontSize:12, color:'#374151' }}>Phone: <strong>{p.phone}</strong></div>
                      )}
                      {!showPhone && p.phone && (
                        <div style={{ fontSize:12, color:'#374151' }}>Phone: <strong style={{ letterSpacing:'1px' }}>•••• Hidden</strong></div>
                      )}
                      <div style={{ fontSize:11, color:'#6b7280' }}>Joined: {new Date(p.joinedAt).toLocaleString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={()=> setPassengersModalRide(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component
function ShareRideApp() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rides, setRides] = useState([]);
  const [apiReady,setApiReady] = useState(false);
  const apiBase = '';

  // Initial fetch from API (fallback to local mock if fails)
  useEffect(() => {
    const syncLocalRidesToAPI = async (serverRides=[]) => {
      // Push any locally stored rides not present on server (best-effort)
      try {
        const local = JSON.parse(localStorage.getItem('shareride_offered_rides') || '[]');
        if (!Array.isArray(local) || !local.length) return;
        const serverIds = new Set((serverRides||[]).map(r => r.id));
        const missing = local.filter(r => !serverIds.has(r.id));
        for (const ride of missing) {
          try { await fetch(`${apiBase}/api/rides`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(ride) }); } catch {}
        }
      } catch {}
    };

    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/rides`);
        if(!res.ok) throw new Error('net');
        const data = await res.json();
        if (Array.isArray(data.rides)) setRides(data.rides);
        setApiReady(true);
        // Try to sync any local-only rides once API is reachable
        await syncLocalRidesToAPI(data.rides || []);
      } catch {
        // fallback to local storage / mock
        try {
          const stored = JSON.parse(localStorage.getItem('shareride_offered_rides') || '[]');
          if (Array.isArray(stored) && stored.length) setRides(stored); else setRides([...MOCK_RIDES]);
        } catch { setRides([...MOCK_RIDES]); }
        setApiReady(false);
      }
    };
    load();
    const id = setInterval(load, 15000); // poll every 15s for multi-device sync
    return () => clearInterval(id);
  }, []);
  const [joinedVersion,setJoinedVersion] = useState(0);
  const [joiningRide, setJoiningRide] = useState(null); // ride object user is attempting to join
  const [joinForm, setJoinForm] = useState({ phoneDigits:'' });
  const joinPhoneRef = useRef(null);
  const [joinPhoneError, setJoinPhoneError] = useState('');

  // Auto-focus pickup field when opening join modal
  useEffect(() => {
    if (joiningRide) {
      setTimeout(() => { try { joinPhoneRef.current && joinPhoneRef.current.focus(); } catch {} }, 30);
    }
  }, [joiningRide]);

  // Helper to parse a ride's scheduled Date object (local time)
  const getRideDateTime = (ride) => {
    try {
      if (!ride.date) return null;
      const [year, month, day] = ride.date.split('-').map(n => parseInt(n,10));
      if (!year || !month || !day) return null;
      let hours = 0, minutes = 0;
      if (ride.time) {
        const parts = ride.time.split(':');
        hours = parseInt(parts[0],10) || 0;
        minutes = parseInt(parts[1],10) || 0;
      }
      const d = new Date(year, month - 1, day, hours, minutes, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
  };

  // Cleanup expired rides (those strictly before now)
  const cleanupExpiredRides = React.useCallback(() => {
    setRides(prev => {
      const now = new Date();
      const filtered = prev.filter(r => {
        const dt = getRideDateTime(r);
        if (!dt) return true; // keep if cannot parse
        return dt >= now; // keep only future or current time rides
      });
      if (filtered.length !== prev.length) {
        try { localStorage.setItem('shareride_offered_rides', JSON.stringify(filtered)); } catch {}
      }
      return filtered;
    });
  }, []);

  // Run cleanup on mount and every 60s
  useEffect(() => {
    cleanupExpiredRides();
    const id = setInterval(cleanupExpiredRides, 60 * 1000);
    return () => clearInterval(id);
  }, [cleanupExpiredRides]);

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

  const handleOfferCreated = async (ride) => {
    // Try API first
    try {
      const res = await fetch(`${apiBase}/api/rides`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(ride) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.rides)) { setRides(data.rides); return; }
      }
      throw new Error('api fail');
    } catch {
      // Fallback to local store
      setRides(r => { const updated=[ride,...r]; try{localStorage.setItem('shareride_offered_rides', JSON.stringify(updated));}catch{} return updated; });
    }
  };

  const handleJoinRide = (ride) => {
    // Pre-fill digits from stored user phone if Indian format
    let digits = '';
    if (user?.phone) {
      const cleaned = user.phone.replace(/[^\d]/g,'');
      // If contains country code 91 and total length >=12, take last 10 digits
      if (cleaned.startsWith('91') && cleaned.length >= 12) digits = cleaned.slice(-10);
      else if (cleaned.length === 10) digits = cleaned; // already 10 digits
    }
    setJoinForm({ phoneDigits: digits });
    setJoiningRide(ride);
  };

  const submitJoinRide = async () => {
    if (!joiningRide) return;
    try {
      const username = user?.username || 'me';
      const key = `shareride_joined_${username}`;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const arr = Array.isArray(list) ? list : [];
      if (arr.some(r => r.id === joiningRide.id)) {
        window.__notify && window.__notify('Already joined this ride','info');
        setJoiningRide(null);
        return;
      }
      // Indian phone handling: optional field; if entered must be 10 digits starting 6-9
      const digits = (joinForm.phoneDigits||'').replace(/\D/g,'');
      let fullPhone = '';
      if (digits) {
        const valid = /^[6-9]\d{9}$/.test(digits);
        if (!valid) {
          setJoinPhoneError('Enter 10-digit Indian mobile (starts 6-9)');
          window.__notify && window.__notify('Invalid phone number','error');
          return;
        }
        setJoinPhoneError('');
        fullPhone = `+91 ${digits}`;
      } else {
        setJoinPhoneError('');
      }
      // capacity check
      const baseRide = rides.find(r => r.id === joiningRide.id);
      const passengerCount = baseRide && Array.isArray(baseRide.passengers) ? baseRide.passengers.length : 0;
      const capacity = baseRide && typeof baseRide.seats === 'number' ? baseRide.seats : undefined;
      if (capacity !== undefined && passengerCount >= capacity) {
        window.__notify && window.__notify('Ride is full','error');
        setJoiningRide(null);
        return;
      }
      const joinedAt = Date.now();
      const enriched = { ...joiningRide, joinedAt };
      const updated = [enriched, ...arr];
      localStorage.setItem(key, JSON.stringify(updated));
      const applyLocal = () => setRides(prev => {
        const next = prev.map(r => {
          if (r.id === joiningRide.id) {
            const passengers = Array.isArray(r.passengers) ? [...r.passengers] : [];
            // snapshot basic profile fields for later viewer display
            let profileSnapshot = null;
            try {
              profileSnapshot = {
                full_name: user?.full_name,
                email: user?.email,
                phone: (fullPhone || user?.phone || ''),
                gender: user?.gender || '',
                birth: user?.birth || '',
                avatar: user?.avatar || localStorage.getItem(`shareride_avatar_${username}`) || ''
              };
            } catch {}
            passengers.push({ username, name: user?.full_name, phone: fullPhone, joinedAt, profile: profileSnapshot });
            return { ...r, passengers };
          }
          return r;
        });
        try { localStorage.setItem('shareride_offered_rides', JSON.stringify(next)); } catch {}
        return next;
      });
      try {
        const res = await fetch(`${apiBase}/api/rides/${joiningRide.id}/join`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, name: user?.full_name, phone: fullPhone }) });
        const data = await res.json();
        if (res.ok && Array.isArray(data.rides)) setRides(data.rides); else applyLocal();
      } catch { applyLocal(); }
      window.__notify && window.__notify(`Successfully joined ride ${joiningRide.from} → ${joiningRide.to}`,'success');
      setJoiningRide(null);
      setJoinedVersion(v=>v+1);
    } catch {
      window.__notify && window.__notify('Could not join ride','error');
      setJoiningRide(null);
    }
  };

  const handleLeaveRide = (ride) => {
    try {
      const username = user?.username || 'me';
      const key = `shareride_joined_${username}`;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const arr = Array.isArray(list) ? list : [];
      if (!arr.some(r => r.id === ride.id)) { window.__notify && window.__notify('Not in this ride','info'); return; }
      const updatedJoined = arr.filter(r => r.id !== ride.id);
      localStorage.setItem(key, JSON.stringify(updatedJoined));
      // Remove passenger from offered ride passenger list
      const applyLocal = () => setRides(prev => {
        const next = prev.map(r => {
          if (r.id === ride.id && Array.isArray(r.passengers)) {
            return { ...r, passengers: r.passengers.filter(p => p.username !== username) };
          }
          return r;
        });
        try { localStorage.setItem('shareride_offered_rides', JSON.stringify(next)); } catch {}
        return next;
      });
      fetch(`${apiBase}/api/rides/${ride.id}/leave`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username }) })
        .then(r=>r.json().then(data => ({ ok:r.ok, data })))
        .then(({ok,data}) => { if (ok && Array.isArray(data.rides)) setRides(data.rides); else applyLocal(); })
        .catch(()=> applyLocal());
      window.__notify && window.__notify('Left ride','success');
      setJoinedVersion(v=>v+1);
    } catch {
      window.__notify && window.__notify('Could not leave ride','error');
    }
  };

  // Start ride: mark started and open WhatsApp with passenger list
  const handleStartRide = (ride) => {
    setRides(prev => {
      const next = prev.map(r => r.id === ride.id ? { ...r, startedAt: Date.now() } : r);
      try { localStorage.setItem('shareride_offered_rides', JSON.stringify(next)); } catch {}
      return next;
    });
    fetch(`${apiBase}/api/rides/${ride.id}/start`, { method:'POST' }).catch(()=>{});
    const passengers = Array.isArray(ride.passengers) ? ride.passengers : [];
    if (!passengers.length) {
      window.__notify && window.__notify('Ride started (no passengers yet)','success');
      return;
    }
    // New multiline formatted message for WhatsApp
    const blocks = passengers.map((p,i) => {
      const nameLine = `${i+1}. ${(p.name||p.username||'').toUpperCase()}`;
      const lines = [nameLine];
      if (p.pickup) lines.push(`Pickup: ${p.pickup}`);
      if (p.drop) lines.push(`Drop: ${p.drop}`);
      return lines.join('\n');
    }).join('\n\n');
    const message = `Ride starting now!\nRoute: ${ride.from} -> ${ride.to}\nDeparture: ${ride.date} ${ride.time}\nPassengers:\n${blocks}`;
    const text = encodeURIComponent(message);
    // If only one passenger with phone, direct send, else use share link (multi-select manual send)
    let url = `https://wa.me/?text=${text}`;
    if (passengers.length === 1 && passengers[0].phone) {
      const phoneClean = passengers[0].phone.replace(/[^+\d]/g,'');
      url = `https://wa.me/${phoneClean.replace(/^\+/,'')}?text=${text}`;
    }
    window.open(url, '_blank');
    window.__notify && window.__notify('WhatsApp message prepared','success');
  };

  // Driver broadcast message to passengers (simple first passenger target; driver can forward inside WhatsApp)
  const handleMessagePassengers = (ride) => {
    if (!ride) return;
    if (!user || ride.driverUsername !== user.username) {
      window.__notify && window.__notify('Only the driver can message passengers','error');
      return;
    }
    const passengers = Array.isArray(ride.passengers) ? ride.passengers.filter(p => p.phone) : [];
    if (!passengers.length) {
      window.__notify && window.__notify('No passenger phone numbers to message','error');
      return;
    }
    const remaining = typeof ride.seats === 'number' && Array.isArray(ride.passengers) ? (ride.seats - ride.passengers.length) : undefined;
    const lines = [
      'Ride Update',
      `Route: ${ride.from} -> ${ride.to}`,
      `Schedule: ${ride.date} ${ride.time}`,
      remaining !== undefined ? `Seats Left: ${remaining < 0 ? 0 : remaining}` : null,
      `Driver: @${ride.driverUsername}`
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join('\n'));
    const target = passengers[0].phone.replace(/[^+\d]/g,'').replace(/^\+/,'');
    const url = `https://wa.me/${target}?text=${text}`;
    window.open(url,'_blank');
    window.__notify && window.__notify('WhatsApp message draft opened','success');
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
  <SuccessBanner />
      <ToastHost />
      <Dashboard
        user={user}
        onLogout={handleLogout}
        rides={rides}
        onOfferCreated={handleOfferCreated}
        onJoinRide={handleJoinRide}
        onLeaveRide={handleLeaveRide}
        onUserUpdate={handleUserUpdate}
        joinedVersion={joinedVersion}
        setJoinedVersion={setJoinedVersion}
        onStartRide={handleStartRide}
  onMessagePassengers={handleMessagePassengers}
        onRemovePassenger={(rideId, passengerUsername) => {
          let updatedRef = null;
          setRides(prev => {
            const next = prev.map(r => {
              if (r.id === rideId && Array.isArray(r.passengers)) {
                const filtered = r.passengers.filter(p => p.username !== passengerUsername);
                const updated = { ...r, passengers: filtered };
                if (!updatedRef) updatedRef = updated;
                return updated;
              }
              return r;
            });
            try { localStorage.setItem('shareride_offered_rides', JSON.stringify(next)); } catch {}
            return next;
          });
          // Remove passenger's joined record for that user if reachable (best-effort)
          try {
            const key = `shareride_joined_${passengerUsername}`;
            const list = JSON.parse(localStorage.getItem(key)||'[]');
            if (Array.isArray(list) && list.some(r => r.id === rideId)) {
              const filtered = list.filter(r => r.id !== rideId);
              localStorage.setItem(key, JSON.stringify(filtered));
            }
          } catch {}
          window.__notify && window.__notify('Passenger removed','success');
          return updatedRef;
        }}
      />
      {joiningRide && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal" style={{ maxWidth:500 }}>
            <div className="modal-header">
              <h3 style={{ marginBottom:0 }}>Join Ride</h3>
            </div>
            <form onSubmit={(e)=>{ e.preventDefault(); submitJoinRide(); }}>
              <div className="modal-body" style={{ display:'grid', gap:14 }}>
                <div style={{ fontSize:13, background:'#f3f4f6', padding:10, borderRadius:8 }}>
                  <strong>Route:</strong> {joiningRide.from} → {joiningRide.to}<br />
                  <strong>Schedule:</strong> {joiningRide.date} • {joiningRide.time}
                </div>
                <div className="location-input-group">
                  <label className="location-label">WhatsApp Phone (India) <span style={{ fontWeight:400, fontSize:11, color:'#6b7280' }}>(optional)</span></label>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ background:'#e5e7eb', padding:'8px 10px', borderRadius:8, fontSize:14, fontWeight:500, color:'#111827' }}>+91</div>
                    <input ref={joinPhoneRef} maxLength={10} inputMode="numeric" className="location-input" style={{ flex:1, ...(joinPhoneError?{borderColor:'#dc2626'}:{}) }} placeholder="10-digit mobile" value={joinForm.phoneDigits} onChange={(e)=> {
                      const raw = e.target.value.replace(/\D/g,'');
                      setJoinForm(f=>({...f, phoneDigits: raw}));
                      if(!raw){ setJoinPhoneError(''); return; }
                      if(!/^[6-9]\d{9}$/.test(raw)) setJoinPhoneError('Invalid number'); else setJoinPhoneError('');
                    }} />
                  </div>
                  <div style={{ fontSize:11, color: joinPhoneError? '#dc2626':'#6b7280', marginTop:4 }}>
                    {joinPhoneError || 'Enter 10 digits (e.g. 9014068542). Stored as +91 XXXXX XXXXX'}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={()=> setJoiningRide(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={!!joinPhoneError}>Confirm Join</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareRideApp;

// Toast system host component (must be after default export to avoid hoist issues for earlier usage)
function ToastHost(){
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{
    window.__notify = (msg, type='info', duration=3000) => {
      const id = Date.now()+Math.random();
      setToasts(t=>[...t,{id,msg,type}]);
      try { window.dispatchEvent(new CustomEvent('app:notify',{ detail:{ id, msg, type }})); } catch {}
      setTimeout(()=>{ setToasts(t=> t.filter(x=>x.id!==id)); }, duration);
    };
    return ()=>{ delete window.__notify; };
  },[]);
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

// Prominent success banner for better visibility of successful actions
function SuccessBanner(){
  const [visible,setVisible]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>{
    const handler = (e)=>{
      const { msg, type } = e.detail || {};
      if(type==='success'){
        setMessage(msg);
        setVisible(true);
        const timer = setTimeout(()=> setVisible(false), 4000);
        return () => clearTimeout(timer);
      }
    };
    window.addEventListener('app:notify', handler);
    return ()=> window.removeEventListener('app:notify', handler);
  },[]);
  if(!visible) return null;
  return (
    <div className="success-banner" role="status" aria-live="polite">
      <span className="success-banner-text">✅ {message}</span>
      <button type="button" className="success-banner-close" onClick={()=>setVisible(false)} aria-label="Dismiss success message">×</button>
    </div>
  );
}
