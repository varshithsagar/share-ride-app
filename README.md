# 🚗 Share Ride - Frontend Only Application

A beautiful and modern ride-sharing application built with React, styled to match the demo at https://share-ride-app.onrender.com/

## ✨ Features

- **🔐 User Authentication** - Login and Registration with mock data
- **🚗 Offer a Ride** - Create ride offers with details
- **🔍 Find a Ride** - Search and book available rides
- **📊 My Rides** - View ride history and bookings
- **👤 Profile Management** - Manage user profile
- **💾 Local Storage** - Session persistence across browser sessions

## 🎯 Demo Credentials

**Login with these demo accounts:**
- Username: `demo_user` | Password: `demo123`
- Username: `john_doe` | Password: `password123`
- Username: `jane_smith` | Password: `password123`

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:5173`

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 🎨 Technology Stack

- **Frontend:** React 19.1.0
- **Build Tool:** Vite 7.0.4
- **Styling:** CSS3 with Glass-morphism design
- **Data:** Mock data (no backend required)
- **Storage:** Browser localStorage for session management

## 📱 Application Flow

1. **Landing Page** - Beautiful login/register interface
2. **Dashboard** - Main navigation with action buttons
3. **Offer Ride** - Form to create new ride offers
4. **Find Ride** - Search and browse available rides
5. **Profile** - View and manage user information
6. **My Rides** - Track ride history and bookings

## 🔧 Features Overview

### Authentication
- Mock authentication system
- Session persistence with localStorage
- User registration with form validation

### Ride Management
- Create ride offers with full details
- Search rides by location
- Book rides with confirmation
- View ride history

### User Interface
- Professional glass-morphism design
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive navigation

## 📂 Project Structure

```
src/
├── ShareRideApp.jsx    # Main application component
├── main.jsx           # React entry point
├── App.css           # Professional styling
├── index.css         # Base styles
└── assets/           # Static assets
```

## 🌟 Mock Data

The application includes pre-populated mock data:
- **3 Demo Users** with different credentials
- **3 Sample Rides** from various locations
- **Realistic ride details** including pricing, timing, and vehicle info

## 🔄 No Backend Required

This is a **frontend-only** application that:
- Uses mock data instead of real API calls
- Stores data in browser localStorage
- Simulates real backend interactions
- Perfect for demos and prototyping

## 🎉 Ready to Use

Your Share Ride application is now:
- ✅ **Fully functional** - All features working
- ✅ **Database-free** - No backend complexity
- ✅ **Beautiful UI** - Professional glass-morphism design
- ✅ **Mobile-ready** - Responsive on all devices
- ✅ **Demo-ready** - Perfect for showcasing

Enjoy your clean, modern Share Ride application! 🚗✨+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
