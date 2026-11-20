import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import {AppState} from 'react-native';
import {Camera} from 'expo-camera';
import {router} from 'expo-router';
import ScanScreen from '../app/scan';

jest.mock('expo-router', () => {
  const React = require('react');
  return {router: {push: jest.fn()}, useFocusEffect: fn => React.useEffect(fn, [fn])};
});
jest.mock('expo-camera', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    Camera: {getCameraPermissionsAsync: jest.fn(), requestCameraPermissionsAsync: jest.fn()},
    CameraView: ({onBarcodeScanned}) => <Text onPress={() => onBarcodeScanned({data: 'QR-1'})}>Lire un QR</Text>,
  };
});

beforeEach(() => {
  Object.defineProperty(AppState, 'currentState', {value: 'active', configurable: true});
});

test('permission demandée puis lecture et nouveau scan', async () => {
  Camera.getCameraPermissionsAsync.mockResolvedValue({granted: false, canAskAgain: true});
  Camera.requestCameraPermissionsAsync.mockResolvedValue({granted: true, canAskAgain: true});
  await render(<ScanScreen />);
  await fireEvent.press(await screen.findByRole('button', {name: 'Autoriser la caméra'}));
  await waitFor(() => expect(screen.getByText('Lire un QR')).toBeTruthy());
  await fireEvent.press(screen.getByText('Lire un QR'));
  expect(screen.getByText('QR-1')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', {name: 'Identifier le colis'}));
  expect(router.push).toHaveBeenCalledWith({pathname: '/s/[name]', params: {name: 'scan-result', code: 'QR-1'}});
  Camera.getCameraPermissionsAsync.mockResolvedValue({granted: true, canAskAgain: true});
  await fireEvent.press(screen.getByRole('button', {name: 'Scanner un autre code'}));
  await waitFor(() => expect(screen.getByText('Lire un QR')).toBeTruthy());
});

test('permission refusée définitivement : réglages proposés', async () => {
  Camera.getCameraPermissionsAsync.mockResolvedValue({granted: false, canAskAgain: false});
  await render(<ScanScreen />);
  expect(await screen.findByRole('button', {name: 'Ouvrir les réglages'})).toBeTruthy();
  expect(screen.queryByText('Lire un QR')).toBeNull();
});

test('erreur de lecture de permission affichée', async () => {
  Camera.getCameraPermissionsAsync.mockRejectedValue(Error('caméra'));
  await render(<ScanScreen />);
  expect(await screen.findByText(/Impossible de vérifier l’autorisation/)).toBeTruthy();
  expect(screen.getByRole('button', {name: 'Réessayer'})).toBeTruthy();
});
