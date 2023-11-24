import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import LandingPage from "./pages/landingPage";
import SignUp from "./pages/signUp";
import SignInSide from "./pages/signIn";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Settings from "./pages/settings";
import Integrations from "./pages/integrations";
import Report from "./pages/report";
import Learn from "./pages/learn";
import CreateReports from "./pages/createReports";
import Docs from "./pages/docs";
import OnboardingDonor from "./pages/onboardingDonor";
import OnboardingCharity from "./pages/onboardingCharity";
import FindCauses from "./pages/findCauses";
import MyCharity from "./pages/myCharity";
import FundPage from "./pages/fund";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/report" element={<Report />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signIn" element={<SignInSide />} />
        <Route path="/onboardingDonor" element={<OnboardingDonor />} />
        <Route path="/onboardingCharity" element={<OnboardingCharity />} />
        <Route path="/createReports" element={<CreateReports />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/findCauses" element={<FindCauses />} />
        <Route path="/myCharity" element={<MyCharity />} />
        <Route path="/fund/:fundId" element={<FundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
