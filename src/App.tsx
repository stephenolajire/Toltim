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
import HistoryLayout from "./patient/HistoryLayout";
import PatientTransactionHistory from "./patient/PatientTransactionHistory";

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
import VerificationHistory from "./admin/pages/VerificationHistory";
import CareGiverBooking from "./admin/pages/CareGiverBooking";
import BedSideBooking from "./admin/pages/BedSideBooking";
import AdminPaymentLayout from "./admin/components/payment/AdminPaymentLayout";
import PatientFunding from "./admin/pages/PatientFunding";
import WalletTransactions from "./admin/pages/WalletTransaction";
import WithdrawalRequests from "./admin/pages/WithdrawalRequest";
import SystemCommission from "./admin/pages/SystemCommission";

// Nurse Dashboard
import NurseLayout from "./nurse/NurseLayout";
// import CaregiverServicesBooking from "./userdashboard/Caregiver";
import NurseKycVerification from "./nurse/pages/KYCVerification";
import NurseDashboard from "./nurse/pages/NurseDashboard";
import ActivePatients from "./nurse/pages/ActivePatient";
import Appointments from "./nurse/pages/Appointment";
import WalletEarnings from "./nurse/pages/Wallet";
import IDCard from "./nurse/pages/IDCard";
import VerifyEmail from "./auth/VerifyEmail";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";

// auth
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import PasswordResetVerifyOtp from "./auth/PasswordResetVerifyOtp";
import ChangePassword from "./auth/ChangePassword";
import ProtectedRoute from "./constant/ProtectedRoute";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/NotFound";
import EditUserProfile from "./patient/EditUserProfile";
import KYCVerification from "./auth/KYCVerification";



const queryClient = new QueryClient();


const App: React.FC = () => {
  return (
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
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />

          {/* user auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/kyc-nurse" element={<NurseKycVerification />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/password-reset/verify-otp"
            element={<PasswordResetVerifyOtp />}
          />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* <Route
          path="/dashboard/caregiver"
          element={<CaregiverServicesBooking />}
        /> */}

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
          <Route
            path="/patient"
            element={
              <ProtectedRoute>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientDashboard />} />
            <Route
              path="in-patient"
              element={
                <ProtectedRoute>
                  <InPatientCaregiverService />
                </ProtectedRoute>
              }
            />
            <Route
              path="caregiver"
              element={
                <ProtectedRoute>
                  <CaregiverBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <HistoryLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <PatientAppointmentHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="transaction"
                element={
                  <ProtectedRoute>
                    <PatientTransactionHistory />{" "}
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile/edit"
              element={
                <ProtectedRoute>
                  <EditUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="messages"
              element={
                <ProtectedRoute>
                  <PatientMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="procedures"
              element={
                <ProtectedRoute>
                  <BookService />
                </ProtectedRoute>
              }
            />
            <Route
              path="matching"
              element={
                <ProtectedRoute>
                  <HealthPractitionersMatching />
                </ProtectedRoute>
              }
            />
            <Route
              path="receipt"
              element={
                <ProtectedRoute>
                  <AppointmentReceipt />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* nurse dashboard */}
          <Route path="/nurse" element={<NurseLayout />}>
            <Route index element={<NurseDashboard />} />
            <Route path="active-patients" element={<ActivePatients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="wallet" element={<WalletEarnings />} />
            <Route path="id-card" element={<IDCard />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
