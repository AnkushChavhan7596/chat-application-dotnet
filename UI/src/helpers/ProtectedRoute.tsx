import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // or any auth state you use

  if (!token) {
    // user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // user is logged in, show the children component
  return <>{children}</>;
};

export default ProtectedRoute;
