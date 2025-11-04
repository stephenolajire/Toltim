import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import LandingPage from "./pages/LandingPage";

// patient dashboard
import PatientLayout from "./patient/Layout";
import PatientDashboard from "./patient/PatientDashboard";
import PatientProfile from "./patient/Profile";
import PatientMessages from "./patient/Message";
import BookService from "./patient/BookService";
import HealthPractitionersMatching from "./patient/Matching";
import AppointmentReceipt from "./patient/PatientReceipts";
import CaregiverBooking from "./patient/CareGiver";
import InPatientCaregiverService from "./patient/InPatient";
import PatientAppointmentHistory from "./patient/PatientAppointmentHistory";

// admin dashboard
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
// import VerificationHistory from "./admin/pages/VerificationHistory";
import CareGiverBooking from "./admin/pages/CareGiverBooking";
import BedSideBooking from "./admin/pages/BedSideBooking";
// import AdminPaymentLayout from "./admin/components/payment/AdminPaymentLayout";
// import PatientFunding from "./admin/pages/PatientFunding";
// import WalletTransactions from "./admin/pages/WalletTransaction";
// import WithdrawalRequests from "./admin/pages/WithdrawalRequest";
// import SystemCommission from "./admin/pages/SystemCommission";

// Nurse Dashboard
import NurseLayout from "./nurse/NurseLayout";
import NurseKycVerification from "./nurse/pages/KYCVerification";
import NurseDashboard from "./nurse/pages/NurseDashboard";
import ActivePatients from "./nurse/pages/ActivePatient";
import IDCard from "./nurse/pages/IDCard";
import KycStatus from "./nurse/pages/KYCStatus";

// Auth Components
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import PasswordResetVerifyOtp from "./auth/PasswordResetVerifyOtp";
import ChangePassword from "./auth/ChangePassword";
import VerifyEmail from "./auth/VerifyEmail";
import KYCVerification from "./auth/KYCVerification";

// Utilities
import ProtectedRoute from "./constant/ProtectedRoute";
import NotFound from "./pages/NotFound";
import EditUserProfile from "./patient/EditUserProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalProvider } from "./constant/GlobalContext";
import InBedProcedures from "./admin/pages/InBedProcedure";
import NurseProfile from "./nurse/pages/Profile";
import CHWVerification from "./chw/pages/CHWVerification";
import CareProcedures from "./admin/pages/CHWProcedure";
import CareGiving from "./nurse/pages/CareGiving";
import CHWLayout from "./chw/CHWLayout";
import BedsideDashboard from "./chw/pages/BedSideBooking";
import OverviewDashboard from "./chw/pages/Overview";
import NurseOverviewDashboard from "./nurse/pages/Overview";
import WalletComponent from "./patient/Wallet";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
            </Route>

            {/* AUTHENTICATION ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/password-reset/verify-otp"
              element={<PasswordResetVerifyOtp />}
            />
            <Route path="/change-password" element={<ChangePassword />} />

            {/* KYC ROUTES */}
            <Route path="/kyc-verification" element={<KYCVerification />} />
            <Route path="/kyc-nurse" element={<NurseKycVerification />} />
            <Route path="/kyc-chw" element={<CHWVerification />} />

            {/* ADMIN DASHBOARD - Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="payment" element={<WalletComponent />} />

              {/* Users Management */}
              <Route path="users" element={<AdminUserLayout />}>
                <Route index element={<AdminPatients />} />
                <Route path="nurse" element={<AdminNurse />} />
                <Route path="chw" element={<AdminCHW />} />
              </Route>

              {/* Bookings Management */}
              <Route path="bookings" element={<AdminBookingLayout />}>
                <Route index element={<NurseBooking />} />
                <Route path="caregiver" element={<CareGiverBooking />} />
                <Route path="bedside" element={<BedSideBooking />} />
              </Route>

              <Route path="nurse/procedures" element={<Procedures />} />
              <Route path="chw/procedures" element={<CareProcedures />} />
              <Route path="in-bed/procedures" element={<InBedProcedures />} />

              {/* Verifications Management */}
              <Route path="verifications" element={<AdminVerificationLayout />}>
                <Route index element={<PendingNurseVerifications />} />
                <Route path="chw" element={<PendingCHWVerifications />} />
                <Route path="doctor" element={<DoctorPendingVerifications />} />
                {/* <Route path="history" element={<VerificationHistory />} /> */}
              </Route>

              {/* Payments Management */}
              {/* <Route path="payments" element={<AdminPaymentLayout />}>
                <Route index element={<WalletComponent />} />
                <Route path="wallet" element={<WalletTransactions />} />
                <Route path="withdrawal" element={<WithdrawalRequests />} />
                <Route path="commission" element={<SystemCommission />} />
              </Route> */}
            </Route>

            {/* PATIENT DASHBOARD - Protected Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PatientDashboard />} />
              <Route
                path="in-patient"
                element={<InPatientCaregiverService />}
              />
              <Route path="caregiver" element={<CaregiverBooking />} />

              {/* Patient History */}
              <Route path="history" element={<PatientAppointmentHistory />} />

              {/* Patient Profile */}
              <Route path="profile" element={<PatientProfile />} />
              <Route path="wallet" element={<WalletComponent />} />
              <Route path="profile/edit" element={<EditUserProfile />} />

              {/* Patient Services */}
              <Route path="messages" element={<PatientMessages />} />
              <Route path="procedures" element={<BookService />} />
              <Route
                path="matching"
                element={<HealthPractitionersMatching />}
              />
              <Route path="receipt" element={<AppointmentReceipt />} />
            </Route>

            {/* NURSE DASHBOARD - Protected Routes */}
            <Route
              path="/nurse"
              element={
                <ProtectedRoute allowedRoles={["nurse"]}>
                  <NurseLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<NurseOverviewDashboard />} />
              <Route path="active-patients" element={<ActivePatients />} />
              <Route path="procedure" element={<NurseDashboard />} />
              <Route path="wallet" element={<WalletComponent />} />
              <Route path="id-card" element={<IDCard />} />
              <Route path="kyc-status" element={<KycStatus />} />
              <Route path="caregiver" element={<CareGiving />} />
            </Route>
            <Route path="/nurse/profile" element={<NurseProfile />} />

            {/* CHW DASHBOARD - Protected Routes */}
            <Route
              path="/chw"
              element={
                <ProtectedRoute allowedRoles={["chw"]}>
                  <CHWLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OverviewDashboard />} />
              <Route path="caregiver" element={<CareGiving />} />
              <Route path="wallet" element={<WalletComponent />} />
              <Route path="id-card" element={<IDCard />} />
              <Route path="kyc-status" element={<KycStatus />} />
              <Route path="bedside" element={<BedsideDashboard />} />
            </Route>
            <Route path="/chw/profile" element={<NurseProfile />} />

            {/* 404 Route - Must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </GlobalProvider>
  );
};

export default App;
