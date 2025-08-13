# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Deploying on Render (Go Live Shortcut)

1. Push this repository to GitHub (already done).
2. Log in to https://render.com and create a new Web Service.
3. Select this repo.
4. Set the following:
	- Environment: Node
	- Build Command: `npm run render-build`
	- Start Command: `npm run render-start`
	- Node Version (optional environment variable): e.g. `NODE_VERSION=20`
5. Leave Root Directory blank (uses repo root).
6. Click Create Web Service.

The server uses `PORT` provided by Render and serves the built SPA from `dist/` with an SPA fallback. After build completes your live URL will be shown in the dashboard.

## Deploying on GitHub Pages (Static Only)
If you just need the static front‑end (no Express server features) you can publish the `dist/` folder.

1. Install the pages helper: `npm i -D gh-pages`
2. In `vite.config.js` set `base: '/<repo-name>/'` (example: `/share-ride-app/`) for correct asset paths.
3. Add scripts to `package.json`:
```
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```
4. Run: `npm run deploy`
5. Enable GitHub Pages (Settings → Pages → Deploy from branch → gh-pages).

Note: Dynamic server code (Express, password overrides) won’t run—only the built static assets.

## Deploying on Netlify (Alternate)
1. Create a new site from Git repo.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add a redirect file for SPA fallback: create `public/_redirects` containing:
```
/* /index.html 200
```
Netlify will auto-detect and deploy.

### Local Production Preview
```
npm run build
npm run serve
```
Serves at http://127.0.0.1:10000 (or the HOST/PORT you export).

### Environment Variables (Optional)
| Name | Purpose | Default |
|------|---------|---------|
| HOST | Bind host | 0.0.0.0 |
| PORT | Runtime port | 10000 |

---
