import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signInAdmin, signOutAdmin } from './firebaseAdminAuth';
import AdminPageContent from './AdminPageContent';
import './admin.css';

/**
 * ProtectedAdminPage wraps AdminPageContent with Firebase authentication.
 * Users must log in with email/password to access the admin panel.
 */
export default function ProtectedAdminPage() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  if (loading) {
    return (
      <div className="admin">
        <div className="admin-login">
          <div className="admin-login__card">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // User is not authenticated - show login form
  if (!user) {
    const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      setLoggingIn(true);

      const { success, error: loginError } = await signInAdmin(email, password);
      if (success) {
        setEmail('');
        setPassword('');
      } else {
        setError(loginError || 'Login failed');
      }
      setLoggingIn(false);
    };

    return (
      <div className="admin">
        <div className="admin-login">
          <form className="admin-login__card" onSubmit={handleLogin}>
            <h1 className="admin-login__title">Admin Sign In</h1>
            <p className="admin-login__text">Enter your Firebase credentials</p>
            
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            
            <label className="admin-login__label">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loggingIn}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </label>

            <label className="admin-login__label" style={{ marginTop: '1rem' }}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loggingIn}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </label>

            <button type="submit" disabled={loggingIn} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // User is authenticated - show admin page with logout button
  return (
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <button
          onClick={async () => {
            await signOutAdmin();
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout ({user.email})
        </button>
      </div>
      <AdminPageContent />
    </div>
  );
}
