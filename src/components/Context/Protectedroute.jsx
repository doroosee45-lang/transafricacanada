import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#0d1f2d', flexDirection:'column', gap:16,
    }}>
      <div style={{
        width:44, height:44, borderRadius:'50%',
        border:'4px solid rgba(0,212,170,0.2)',
        borderTop:'4px solid #00d4aa',
        animation:'spin 0.8s linear infinite',
      }} />
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem',
        fontFamily:"'Poppins',sans-serif" }}>
        Vérification…
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // Non authentifié → login (avec mémorisation de la page voulue)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rôle insuffisant → dashboard
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default ProtectedRoute;