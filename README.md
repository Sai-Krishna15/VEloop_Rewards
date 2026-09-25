# VELoop Daily Streak & Rewards System

A full-stack MERN application that implements a robust, gamified Daily Streak & Rewards system, designed with tamper-proof backend security and a premium, responsive glassmorphism frontend.

## Features
- **7-Day Gamified Streak**: Progress resets gracefully if a day is missed.
- **Time-Gated Rewards**: 24-hour exact locking mechanisms verified server-side.
- **Atomic Wallet Layer**: Idempotent ledger updates preventing race conditions or duplicate claims.
- **CPA Demo Flow**: Interactive sponsor-task simulator before claiming rewards.
- **Premium Glassmorphism UI**: Beautiful, fully responsive frontend with CSS-driven micro-animations.
- **Tamper-Proof Backend**: Rate limiting, strict model validation, transaction support (with standalone fallbacks), and detailed audit logging.

## Tech Stack
- **Frontend**: React, Vite, CSS Modules (Design Tokens, Glassmorphism)
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Auth
- **Security**: `express-rate-limit`, `helmet`, global error mapping

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=Your_uri
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```
Run the backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:3000/api
```
Run the frontend:
```bash
npm run dev
```

## Documentation
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Security Architecture](./docs/SECURITY.md)
- [Testing Guide](./docs/TESTING.md)
- [Postman Collection](./VELoop_Postman_Collection.json)
