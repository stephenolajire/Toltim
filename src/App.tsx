import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import LandingPage from './pages/LandingPage'
import Login from './user/Login'
import SignUp from './user/SignUp'
import UserLayout from './layout/UserLayout'
import Home from './userdashboard/Home'

const App:React.FC = () => {
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App
