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
import AdminUserLayout from "./admin/components/user/AdminUserLayout";
import AdminPatients from "./admin/pages/AdminPatients";
import AdminNurse from "./admin/pages/AdminNurse";
import AdminCHW from "./admin/pages/AdminCHW";
import AdminBookingLayout from "./admin/components/booking/AdminBookingLayout";
import NurseBooking from "./admin/pages/NurseBooking";
import Procedures from "./admin/pages/Procedures";
import AdminVerificationLayout from "./admin/components/verification/AdminVerificationLayout";
import PendingNurseVerifications from "./admin/pages/PendingNurseVerification";
import PendingCHWVerifications from "./admin/pages/CHWVerification";
import DoctorPendingVerifications from "./admin/pages/DoctorsVerification";
import VerificationHistory from "./admin/pages/VerificationHistory";
import CareGiverBooking from "./admin/pages/CareGiverBooking";
import BedSideBooking from "./admin/pages/BedSideBooking";
import AdminPaymentLayout from "./admin/components/payment/AdminPaymentLayout";
import PatientFunding from "./admin/pages/PatientFunding";
import WalletTransactions from "./admin/pages/WalletTransaction";
import WithdrawalRequests from "./admin/pages/WithdrawalRequest";
import SystemCommission from "./admin/pages/SystemCommission";

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
          <Route path="users" element={<AdminUserLayout />}>
            <Route index element={<AdminPatients />} />
            <Route path="nurse" element={<AdminNurse />} />
            <Route path="chw" element={<AdminCHW />} />
          </Route>
          <Route path="bookings" element={<AdminBookingLayout />}>
            <Route index element={<NurseBooking />} />
            <Route path="caregiver" element={<CareGiverBooking />} />
            <Route path="bedside" element={<BedSideBooking />} />
          </Route>

          <Route path="procedures" element={<Procedures />} />
          <Route path="verifications" element={<AdminVerificationLayout />}>
            <Route index element={<PendingNurseVerifications />} />
            <Route path="chw" element={<PendingCHWVerifications />} />
            <Route path="doctor" element={<DoctorPendingVerifications />} />
            <Route path="history" element={<VerificationHistory />} />
          </Route>

          <Route path="payments" element={<AdminPaymentLayout />}>
            <Route index element={<PatientFunding />} />
            <Route path="wallet" element={<WalletTransactions />} />
            <Route path="withdrawal" element={<WithdrawalRequests />} />
            <Route path="commission" element={<SystemCommission />} />
          </Route>
        </Route>

        {/* patient dashboard */}
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
