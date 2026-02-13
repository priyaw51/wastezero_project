# WasteZero
## Smart Waste Pickup and Recycling Platform

WasteZero is a web application designed to connect households with waste pickup services, NGOs, and volunteers to promote recycling and efficient waste management.

## Project Structure
- **backend/**: Node.js/Express backend API for handling authentication, user management, and pickup requests.
- **frontend/**: React/Vite frontend application for the user interface.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB database (local or cloud).

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
This project uses [React](https://reactjs.org/) + [Vite](https://vitejs.dev/).

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, React Router, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Authentication
