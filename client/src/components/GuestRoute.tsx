import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

const GuestRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default GuestRoute;
