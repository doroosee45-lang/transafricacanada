import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getRedirectPath } from './AuthContext';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center',
      justifyContent:'center', background:'#172F50', flexDirection:'column', gap:16,
    }}>
      <div style={{
        width:44, height:44, borderRadius:'50%',
        border:'4px solid rgba(0,212,170,0.2)',
        borderTop:'4px solid #00d4aa',
        animation:'spin 0.8s linear infinite',
      }} />
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.82rem',
        fontFamily:"'Poppins',sans-serif" }}>
        Chargement…
      </p>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  // Déjà connecté → redirection selon le rôle
  if (user) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;