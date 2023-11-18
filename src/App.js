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
import Integrations from "./pages/integrations";
import Report from "./pages/report";
import Learn from "./pages/learn";
import Onboarding from "./pages/onboarding";
import CreateReports from "./pages/createReports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/landingPage" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/report" element={<Report />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignInSide />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/createReports" element={<CreateReports />} />
      </Routes>
    </Router>
  );
}

export default App;
