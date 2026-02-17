# WasteZero ♻️

**Smart Waste Pickup & Recycling Platform**

WasteZero connects households, NGOs, and volunteers to promote efficient waste management and recycling.

---

## 🚀 Quick Start Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/priyaw5/wastezero_project.git
cd wastezero_project
```

### 2️⃣ Backend Setup (Server)
The backend runs on **Node.js + Express** with **MongoDB**.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory:
   ```env
   # Server Configuration
   PORT=3000
   MONGO_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_super_secret_key_here

   # Email Service (Required for OTP)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```
   > **Note:** For Gmail, use an **App Password** if 2-Step Verification is enabled.

4. Start the server:
   ```bash
   npm run dev
   ```
   *(Server should run on http://localhost:3000)*

---

### 3️⃣ Frontend Setup (Client)
The frontend is built with **React + Vite + TailwindCSS**.

1. Open a new terminal and navigate to the `frontend` folder:
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
   *(App checks backend at http://localhost:3000/api)*

---

## 📂 Project Structure

### Backend (`/backend`)
- **`models/`**: Mongoose schemas (User, PickupRequest).
- **`controllers/`**: Logic for authentication and features.
- **`routes/`**: API endpoints (e.g., `/api/auth`, `/api/pickups`).
- **`middlewares/`**: 
  - `auth.js`: Verifies JWT tokens.
  - `role.js`: Checks user roles (Admin, NGO, User).
  - `validation.js`: Joi validation schemas.
  - `errorHandler.js`: Centralized error handling.
- **`utils/`**: Helper functions (Email Service).

### Frontend (`/frontend`)
- **`src/context/`**:
  - `AuthContext.jsx`: Manages user login state.
  - `ThemeContext.jsx`: Handles Dark/Light mode.
- **`src/services/`**: API calls (Axios setup).
- **`src/pages/`**:
  - `Login.jsx` / `Registration.jsx`: Auth pages.
  - `Dashboards/`: Role-specific dashboards.
- **`src/components/`**: Reusable UI components (Navbar, Sidebar).
- **`src/routes/`**: `ProtectedRoute.jsx` for securing pages.

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, TailwindCSS, React Context API
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT (JSON Web Tokens), BCrypt, Nodemailer (OTP)
- **Validation:** Joi

## 🤝 Contribution Workflow
1. Pull the latest changes: `git pull origin pawnesh-dev` (or `git pull origin main`)
2. Create a new branch (Optional): `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added feature X"`
4. Push to GitHub: `git push origin feature-name`
5. Create a Pull Request (PR) for review.
