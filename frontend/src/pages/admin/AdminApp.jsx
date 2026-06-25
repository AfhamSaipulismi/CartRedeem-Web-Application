import { useState } from 'react';
import { isAdminAuthenticated, getAdminUser, adminLogout } from '../../api/admin';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

/**
 * Self-contained admin experience: shows the admin login until authenticated,
 * then the dashboard. Kept separate from the customer app (its own token + state)
 * and reached via the "#admin" URL hash from App.js.
 */
const AdminApp = () => {
  const [authed, setAuthed] = useState(() => isAdminAuthenticated());
  const [admin, setAdmin]   = useState(() => getAdminUser());

  if (!authed) {
    return (
      <div className="app-shell">
        <AdminLogin
          onSuccess={() => {
            setAdmin(getAdminUser());
            setAuthed(true);
          }}
        />
      </div>
    );
  }

  return (
    <AdminDashboard
      admin={admin}
      onLogout={() => {
        adminLogout();
        setAdmin(null);
        setAuthed(false);
      }}
    />
  );
};

export default AdminApp;
