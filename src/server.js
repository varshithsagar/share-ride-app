// Simple production server for Share Ride
// Serves the built dist/ folder on 127.0.0.1:10000 by default

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Config (Render/Cloud friendly)
// On platforms like Render, only PORT is provided and binding 0.0.0.0 is required.
const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 10000);
const DIST_DIR = path.resolve(__dirname, '../dist');

// Basic security headers and caching for static assets
app.use((req, res, next) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'SAMEORIGIN');
	res.setHeader('Referrer-Policy', 'same-origin');
	next();
});

// In-memory rides store (persisted to JSON file)
const DATA_FILE = path.resolve(__dirname, '../rides-data.json');
let rides = [];
try {
	if (fs.existsSync(DATA_FILE)) {
		const raw = fs.readFileSync(DATA_FILE, 'utf8');
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) rides = parsed;
	}
} catch (e) {
	console.error('Failed to load rides-data.json', e);
}
const saveRides = () => {
	try { fs.writeFileSync(DATA_FILE, JSON.stringify(rides, null, 2)); } catch(e){ console.error('saveRides failed', e); }
};

// Helper: parse ride date/time to Date
const rideDateTime = (r) => {
	try {
		if(!r.date) return null;
		const [y,m,d] = r.date.split('-').map(n=>parseInt(n,10));
		if(!y||!m||!d) return null;
		let hh=0, mm=0; if(r.time){ const [H,M]=r.time.split(':'); hh=parseInt(H,10)||0; mm=parseInt(M,10)||0; }
		return new Date(y, m-1, d, hh, mm, 0, 0);
	} catch { return null; }
};

// Prune expired rides (strictly before now)
const pruneExpired = () => {
	const now = new Date();
	const orig = rides.length;
	rides = rides.filter(r => { const dt = rideDateTime(r); return !dt || dt >= now; });
	if (rides.length !== orig) saveRides();
};

// API: list rides
app.get('/api/rides', (req,res) => {
	pruneExpired();
	res.json({ rides });
});

// API: offer ride
app.post('/api/rides', (req,res) => {
	const body = req.body || {};
	if(!body.from || !body.to || !body.date || !body.time || typeof body.seats === 'undefined' || !body.driver || !body.driverUsername){
		return res.status(400).json({ error: 'Missing required fields' });
	}
	const ride = {
		id: Date.now(),
		driver: body.driver,
		driverUsername: body.driverUsername,
		from: body.from,
		to: body.to,
		date: body.date,
		time: body.time,
		seats: Number(body.seats),
		price: body.price,
		vehicle: body.vehicle,
		vehicleType: body.vehicleType,
		vehicleSubtype: body.vehicleSubtype,
		rating: 5.0,
		pickup: body.pickup || 'As arranged',
		passengers: [],
	};
	rides.unshift(ride);
	saveRides();
	res.json({ ride, rides });
});

// API: join ride
app.post('/api/rides/:id/join', (req,res) => {
	const id = Number(req.params.id);
	const { username, name, phone } = req.body || {};
	const ride = rides.find(r => r.id === id);
	if(!ride) return res.status(404).json({ error: 'Ride not found' });
	if(!username) return res.status(400).json({ error: 'Username required' });
	ride.passengers = Array.isArray(ride.passengers) ? ride.passengers : [];
	if (ride.passengers.some(p => p.username === username)) {
		return res.json({ ride, rides });
	}
	if (typeof ride.seats === 'number' && ride.passengers.length >= ride.seats) {
		return res.status(409).json({ error: 'Ride full' });
	}
	ride.passengers.push({ username, name, phone, joinedAt: Date.now() });
	saveRides();
	res.json({ ride, rides });
});

// API: leave ride
app.post('/api/rides/:id/leave', (req,res) => {
	const id = Number(req.params.id);
	const { username } = req.body || {};
	const ride = rides.find(r => r.id === id);
	if(!ride) return res.status(404).json({ error: 'Ride not found' });
	if(!username) return res.status(400).json({ error: 'Username required' });
	if(Array.isArray(ride.passengers)) {
		ride.passengers = ride.passengers.filter(p => p.username !== username);
	}
	saveRides();
	res.json({ ride, rides });
});

// API: start ride
app.post('/api/rides/:id/start', (req,res) => {
	const id = Number(req.params.id);
	const ride = rides.find(r => r.id === id);
	if(!ride) return res.status(404).json({ error: 'Ride not found' });
	ride.startedAt = Date.now();
	saveRides();
	res.json({ ride, rides });
});

// Health check
app.get('/health', (req,res)=> res.json({ ok:true }));

// Serve static assets
app.use(
	express.static(DIST_DIR, {
		extensions: ['html'],
		maxAge: '1d',
		setHeaders: (res, filePath) => {
			if (/\.(html)$/.test(filePath)) {
				res.setHeader('Cache-Control', 'no-cache');
			}
		},
	})
);

// SPA fallback to index.html (regex catch-all for compatibility)
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
	console.log(`Share Ride server listening on ${HOST}:${PORT}`);
});
