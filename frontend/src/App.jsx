import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Registration";
import Dashboard from "./pages/Dashboards/Dashboard";
import Profile from "./pages/Profile";

import OpportunityList from "./pages/Opportunities/OpportunityList";
import OpportunityForm from "./pages/Opportunities/OpportunityForm";

import ProtectedRoute from "./routes/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              {/* Opportunities */}
              <Route path="/opportunities" element={<OpportunityList />} />
              <Route path="/opportunities/create" element={<OpportunityForm />} />
              <Route path="/opportunities/edit/:id" element={<OpportunityForm />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Login />} />

          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;