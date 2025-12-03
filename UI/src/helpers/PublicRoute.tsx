import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // User already logged in — send them to home/dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
