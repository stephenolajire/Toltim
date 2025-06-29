import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./user/Login";
import SignUp from "./user/SignUp";
import UserLayout from "./layout/UserLayout";
import Home from "./userdashboard/Home";
import MedicalProfileForm from "./userdashboard/Profile";
import HealthAssessmentForm from "./userdashboard/HealthAssessment";
import TestAssessment from "./userdashboard/Test";
import NursingProcedures from "./userdashboard/Nursing";
import CaregiverServicesBooking from "./userdashboard/Caregiver";
import PaymentHistory from "./userdashboard/Payments";
import PatientFundingPayments from "./userdashboard/Funding";
import NurseLayout from "./layout/NurseLayout";
import NurseDashboard from "./nursedashboard/NurseDashboard";
import ActivePatient from "./nursedashboard/ActivePatient";
import Appointment from "./nursedashboard/Appointment"
import WalletEarnings from "./nursedashboard/Wallet";
import IDCard from "./nursedashboard/IDCard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* user auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        {/* user dashboard */}
        <Route path="/dashboard" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<MedicalProfileForm />} />
          <Route path="health" element={<HealthAssessmentForm />} />
          <Route path="test" element={<TestAssessment />} />
          <Route path="nursing" element={<NursingProcedures />} />
          <Route path="payment" element={<PaymentHistory />} />
          <Route
            path="funding"
            element={<PatientFundingPayments />}
          />
        </Route>

        <Route
          path="/dashboard/caregiver"
          element={<CaregiverServicesBooking />}
        />

        {/* nurse dashboard */}
        <Route path="/nurse/dashboard" element={<NurseLayout />}>
          <Route index element={<NurseDashboard />} />
          <Route path="active-patient" element={<ActivePatient />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="wallet" element={<WalletEarnings />} />
          <Route path="id-card" element={<IDCard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
