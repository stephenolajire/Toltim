import React, { useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";
import api from "./api";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // Fixed key name
    try {
      const response = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.access); // Fixed key name
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Clear invalid tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthenticated(false);
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
    }
  };

  const auth = async () => {
    const token = localStorage.getItem("accessToken"); // Fixed key name
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const expiryDate = decoded.exp;
      const currentTime = Date.now() / 1000;

      if (currentTime > expiryDate) {
        await refreshToken();
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthenticated(false);
      // Clear invalid tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userType");
    }

    setLoading(false);
  };

  // Call authentication on component mount
  useEffect(() => {
    auth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
