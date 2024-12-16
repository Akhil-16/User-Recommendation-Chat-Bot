import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { PATH_ROUTES } from './constants/Constants';

export const ProtectedRoute = () => {
  const isUserLoggedIn = useSelector((state) => state.auth.loginVerification);  
  return isUserLoggedIn ? <Outlet /> : <Navigate to={PATH_ROUTES.LOGIN} />;
};