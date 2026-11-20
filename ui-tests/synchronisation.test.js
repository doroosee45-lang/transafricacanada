import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import Synchronisation from '../app/synchronisation';
import {queueStore} from '../src/sync/store';

jest.mock('expo-router', () => {
  const React = require('react');
  return {useFocusEffect: fn => React.useEffect(fn, [fn])};
});
jest.mock('../src/auth/AuthProvider', () => ({useAuth: () => ({session: {user: {id: 'client-1'}}})}));
jest.mock('../src/sync/store', () => ({queueStore: {list: jest.fn()}}));

test('une ancienne lecture de la file ne remplace pas une actualisation récente', async () => {
  let first, second;
  queueStore.list.mockImplementationOnce(() => new Promise(resolve => {first = resolve;}))
    .mockImplementationOnce(() => new Promise(resolve => {second = resolve;}));
  await render(<Synchronisation />);
  await waitFor(() => expect(queueStore.list).toHaveBeenCalledTimes(1));
  await fireEvent.press(screen.getByRole('button', {name: 'Actualiser la liste locale'}));
  const item = reference => ({id: reference, type: 'scan', reference, createdAt: '2026-01-01', status: 'pending'});
  await act(() => second([item('NOUVELLE')]));
  expect(screen.getByText('Référence : NOUVELLE')).toBeTruthy();
  await act(() => first([item('ANCIENNE')]));
  expect(screen.getByText('Référence : NOUVELLE')).toBeTruthy();
  expect(screen.queryByText('Référence : ANCIENNE')).toBeNull();
});
