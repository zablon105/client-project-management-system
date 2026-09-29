import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#08090d',
        color: '#9ca3af',
        fontSize: '1rem',
        fontWeight: 600
      }}>
        Loading session authorization...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        color: '#fff',
        textAlign: 'center',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
          Access Restricted
        </h2>
        <p style={{ color: '#9ca3af', maxWidth: '400px', marginBottom: '20px' }}>
          Your current account role (<b>{user.role}</b>) does not have authorization to view this endpoint.
        </p>
        <button
          onClick={() => window.history.back()}
          className="v-btn v-btn-secondary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return <Outlet />;
}
