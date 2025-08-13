// Simple production server for Share Ride
// Serves the built dist/ folder on 127.0.0.1:10000 by default

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Config
const HOST = process.env.HOST || '127.0.0.1';
const PORT = Number(process.env.PORT || 10000);
const DIST_DIR = path.resolve(__dirname, '../dist');

// Basic security headers and caching for static assets
app.use((req, res, next) => {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'SAMEORIGIN');
	res.setHeader('Referrer-Policy', 'same-origin');
	next();
});

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
	console.log(`Share Ride server running at http://${HOST}:${PORT}`);
});
