import React from 'react';
import AdminDadhboard from './admin-dashboard/AdminDashboard';
import { useSelector } from 'react-redux';
import UserDashboard from './user-dashboard/UserDashboard';
function Dashboard(props) {
  const role = useSelector(({ auth }) => auth.user.role);
  return role === 'admin' ? <AdminDadhboard /> : <UserDashboard />;
}

export default Dashboard;

// export default withStyles(styles, { withTheme: true })(Example);
