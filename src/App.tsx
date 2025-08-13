import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./user/Login";
import SignUp from "./user/SignUp";
import CaregiverServicesBooking from "./userdashboard/Caregiver";

import NurseDashboard from "./nursedashboard/NurseDashboard";
import ActivePatient from "./nursedashboard/ActivePatient";
import Appointment from "./nursedashboard/Appointment";
import WalletEarnings from "./nursedashboard/Wallet";
import IDCard from "./nursedashboard/IDCard";

import PatientLayout from "./patient/Layout";
import PatientDashboard from "./patient/PatientDashboard";
import PatientHistory from "./patient/PatientHistory";
import PatientProfile from "./patient/Profile";
import PatientMessages from "./patient/Message";
import BookService from "./patient/BookService";
import HealthPractitionersMatching from "./patient/Matching";
import AppointmentReceipt from "./patient/PatientReceipts";
import CaregiverBooking from "./patient/CareGiver";
import InPatientCaregiverService from "./patient/InPatient";
import VerificationFlow from "./user/Verification";

import NurseLayout from "./layout/NurseLayout";
import NurseKycVerification from "./nursedashboard/KYCVerification";


import AdminLayout from "./admin/AdminLayout";
import Overview from "./admin/pages/Overview";

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
        <Route path="/verification" element={<VerificationFlow />} />
        <Route path="/kyc-nurse" element={<NurseKycVerification />} />

        <Route
          path="/dashboard/caregiver"
          element={<CaregiverServicesBooking />}
        />

        {/* admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          {/* <Route path="payments" element={<PaymentManagement />} />
          <Route path="delayed-sessions" element={<DelayedSessions />} />
          <Route path="patients" element={<RegisteredPatients />} />
          <Route path="id-card" element={<IDCard />} /> */}
        </Route>

        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="in-patient" element={<InPatientCaregiverService />} />
          <Route path="caregiver" element={<CaregiverBooking />} />
          <Route path="history" element={<PatientHistory />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="messages" element={<PatientMessages />} />
          <Route path="procedures" element={<BookService />} />
          <Route path="matching" element={<HealthPractitionersMatching />} />
          <Route path="receipt" element={<AppointmentReceipt />} />
        </Route>

        <Route path="/nurse" element={<NurseLayout />}>
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
