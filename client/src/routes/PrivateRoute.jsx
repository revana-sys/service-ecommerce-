import { Navigate } from 'react-router-dom';
import { isAdmin, isCustomer, getUser } from '../utils/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/customer/login" />;
  }

  const hasAccess = allowedRoles.some(role => {
    if (role === 'admin') return isAdmin();
    if (role === 'customer') return isCustomer();
    return false;
  });

  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;