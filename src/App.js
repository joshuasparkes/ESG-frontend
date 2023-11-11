import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/landingPage";
import SignUp from "./pages/signUp";
import SignInSide from "./pages/signIn";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedRoute"; // Import the ProtectedRoute component
import Settings from "./pages/settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/landingPage" />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignInSide />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
