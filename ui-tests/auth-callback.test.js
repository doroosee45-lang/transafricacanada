import React from 'react';
import {render, screen, waitFor} from '@testing-library/react-native';
import AuthCallback from '../app/auth-callback';
import {useLocalSearchParams} from 'expo-router';
import {supabase} from '../src/auth/supabase';

jest.mock('expo-router', () => ({router: {replace: jest.fn()}, useLocalSearchParams: jest.fn()}));
jest.mock('../src/auth/AuthProvider', () => ({useAuth: () => ({setRecoveryReady: jest.fn()})}));
jest.mock('../src/auth/supabase', () => ({supabase: {auth: {exchangeCodeForSession: jest.fn()}}}));

test('un lien invalide affiche une erreur sans contacter le service', async () => {
  useLocalSearchParams.mockReturnValue({flow: 'confirmation'});
  await render(<AuthCallback />);
  expect(screen.getByText('Lien invalide ou authentification non configurée.')).toBeTruthy();
  expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
});

test('une réponse sans session ne confirme pas le lien', async () => {
  useLocalSearchParams.mockReturnValue({flow: 'confirmation', code: 'code'});
  supabase.auth.exchangeCodeForSession.mockResolvedValue({data: {session: null}, error: null});
  await render(<AuthCallback />);
  await waitFor(() => expect(screen.getByText(/Lien invalide, expiré/)).toBeTruthy());
});
