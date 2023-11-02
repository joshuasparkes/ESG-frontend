import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import SignUp from "./pages/signUp";
import SignInSide from "./pages/signIn";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/landingPage" />} /> {/* Redirect from root to /landingPage */}
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignInSide />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
