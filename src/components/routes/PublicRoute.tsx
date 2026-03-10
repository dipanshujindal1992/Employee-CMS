import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../../constant/routes";

const PublicRoute: React.FC = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default PublicRoute;
