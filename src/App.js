import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landingPage";
import SignUp from "./pages/signUp";
import SignInSide from "./pages/signIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignInSide />} />
      </Routes>
    </Router>
  );
}

export default App;
