# MCP Management Platform

A comprehensive platform for managing Micro Collection Partners (MCP) and Pickup Partners.

## Project Structure

```
mcp-platform/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
├── frontend/               # React.js frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── store/          # State management
│       ├── utils/          # Utility functions
│       └── styles/         # CSS/SCSS files
└── mobile/                 # React Native mobile app
    ├── src/
    │   ├── components/    # Mobile components
    │   ├── screens/       # Screen components
    │   ├── navigation/    # Navigation config
    │   ├── services/      # API services
    │   └── utils/         # Utility functions
    └── assets/            # Mobile assets
```

## Features

- MCP Dashboard with wallet management
- Pickup Partner Management
- Order Management System
- Real-time Notifications
- Wallet System
- Location Tracking
- Analytics and Reporting

## Tech Stack

- Frontend: React.js
- Backend: Node.js + Express
- Database: MongoDB
- Payment Gateway: Razorpay
- Maps: Google Maps API
- Real-time: Socket.io

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install

   # Mobile
   cd mobile
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in backend, frontend, and mobile directories
   - Add required environment variables

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm start

   # Mobile
   cd mobile
   npm start
   ```

## API Documentation

API documentation is available at `/api-docs` when running the backend server.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 