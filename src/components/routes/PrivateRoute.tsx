import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../../constant/routes";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const PrivateRoute: React.FC = () => {
  const isAuthenticated=useSelector((state:RootState)=>state.auth.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.SIGNIN} replace />;
};

export default PrivateRoute;
