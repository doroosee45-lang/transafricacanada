import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/Context/Protectedroute';
import PublicRoute from './components/Context/PublicRoute';

const state = vi.hoisted(() => ({ auth: {} }));
vi.mock('./components/Context/AuthContext', () => ({
  useAuth: () => state.auth,
  getRedirectPath: () => '/app',
}));
function show(element: React.ReactElement, path = '/private') {
  return render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/private" element={element} />
    <Route path="/login" element={<p>Connexion Trans Africa Canada</p>} />
    <Route path="/app" element={<p>Tableau de bord Trans Africa Canada</p>} />
  </Routes></MemoryRouter>);
}
describe('Navigation Trans Africa Canada apres migration Vite', () => {
  it('affiche le chargement avant verification de session', () => {
    state.auth = { loading: true };
    show(<ProtectedRoute><p>Contenu protege</p></ProtectedRoute>);
    expect(screen.getByText('Vérification…')).toBeInTheDocument();
  });
  it('redirige vers la connexion sans session', () => {
    state.auth = { loading: false, isAuthenticated: false };
    show(<ProtectedRoute><p>Contenu protege</p></ProtectedRoute>);
    expect(screen.getByText('Connexion Trans Africa Canada')).toBeInTheDocument();
  });
  it('conserve les pages protegees pour un client authentifie', () => {
    state.auth = { loading: false, isAuthenticated: true, user: { role: 'client' } };
    show(<ProtectedRoute><p>Mes colis Trans Africa Canada</p></ProtectedRoute>);
    expect(screen.getByText('Mes colis Trans Africa Canada')).toBeInTheDocument();
  });
  it('refuse une page administrateur au client', () => {
    state.auth = { loading: false, isAuthenticated: true, user: { role: 'client' } };
    show(<ProtectedRoute roles={['admin']}><p>Administration</p></ProtectedRoute>);
    expect(screen.getByText('Tableau de bord Trans Africa Canada')).toBeInTheDocument();
  });
  it('autorise une page administrateur au bon role', () => {
    state.auth = { loading: false, isAuthenticated: true, user: { role: 'admin' } };
    show(<ProtectedRoute roles={['admin']}><p>Administration</p></ProtectedRoute>);
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });
  it('redirige une session existante hors des pages publiques', () => {
    state.auth = { loading: false, user: { role: 'client' } };
    show(<PublicRoute><p>Inscription</p></PublicRoute>);
    expect(screen.getByText('Tableau de bord Trans Africa Canada')).toBeInTheDocument();
  });
  it('garde la page publique accessible sans session', () => {
    state.auth = { loading: false, user: null };
    show(<PublicRoute><p>Inscription Trans Africa Canada</p></PublicRoute>);
    expect(screen.getByText('Inscription Trans Africa Canada')).toBeInTheDocument();
  });
});
