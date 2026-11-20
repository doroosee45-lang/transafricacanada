import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react-native';
import {Text, View} from 'react-native';
import {router} from 'expo-router';
import {screens} from '../src/screens';
import {ports, useAction, useDetail} from '../src/data';
import {RequestNew} from '../src/screens/client/RequestNew';
import {RequestConfirm} from '../src/screens/client/RequestConfirm';
import {RequestDetail} from '../src/screens/client/RequestDetail';
import {QuoteDecision} from '../src/screens/client/QuoteDecision';
import {ProfileEdit} from '../src/screens/client/ProfileEdit';
import {Warehouse} from '../src/screens/agent/Warehouse';

jest.mock('expo-router', () => {
  const React = require('react');
  return {
    router: {push: jest.fn(), replace: jest.fn(), navigate: jest.fn(), back: jest.fn()},
    Redirect: () => null,
    useFocusEffect: fn => React.useEffect(fn, [fn]),
  };
});
jest.mock('@expo/vector-icons', () => ({Ionicons: () => null}));
jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: () => [{granted: false, canAskAgain: true}, jest.fn()],
}));
jest.mock('../src/auth/AuthProvider', () => ({useAuth: () => ({session: null, loading: false})}));
jest.mock('../src/auth/supabase', () => ({supabase: null}));
jest.mock('../src/data', () => {
  const actual = jest.requireActual('../src/data');
  return {...actual, useDetail: jest.fn(actual.useDetail)};
});
jest.mock('../src/motion', () => {
  const React = require('react');
  const {View, Pressable} = require('react-native');
  return {
    PageEnter: ({children}) => <View>{children}</View>,
    Reveal: ({children}) => <View>{children}</View>,
    PressableScale: ({children, ...props}) => <Pressable {...props}>{children}</Pressable>,
    ScrollContext: React.createContext(null),
    useReducedMotion: () => false,
    useScrollRegistry: () => ({api: null, notify: () => {}}),
  };
});
jest.mock('../src/screens/auth/Anim', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {FadeIn: ({children}) => <View>{children}</View>, Logo: () => <View />};
});
jest.mock('../src/public', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {Navbar: () => <View />, Footer: () => <View />, Hero: () => <View />, Carousel: () => <View />};
});

afterEach(() => {
  jest.restoreAllMocks();
  useDetail.mockImplementation(jest.requireActual('../src/data').useDetail);
});

test.each(Object.keys(screens))('écran enregistré %s : montage sans service', async name => {
  const Screen = screens[name];
  await render(<Screen params={{}} />);
});

test('un accès direct à la confirmation ne prouve pas l’envoi', async () => {
  await render(<RequestConfirm params={{reference: 'inventee'}} />);
  expect(screen.queryByText('Demande envoyée')).toBeNull();
  expect(screen.getByRole('header', {name: 'Envoi non confirmé'})).toBeTruthy();
});

test('la création confirme uniquement une référence retournée par le service', async () => {
  jest.spyOn(ports, 'createRequest').mockResolvedValue({reference: 'REQ-1'});
  await render(<RequestNew params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Origine'), 'Montréal');
  await fireEvent.changeText(screen.getByLabelText('Destination'), 'Dakar');
  await fireEvent.changeText(screen.getByLabelText('Description du contenu'), 'Carton');
  await fireEvent.changeText(screen.getByLabelText('Nom du destinataire'), 'Client');
  await fireEvent.press(screen.getByRole('button', {name: 'Envoyer la demande'}));
  await waitFor(() => expect(screen.getByText('Demande envoyée')).toBeTruthy());
  expect(screen.getByText('REQ-1')).toBeTruthy();
});

test('la création ne confirme pas une réponse sans référence', async () => {
  jest.spyOn(ports, 'createRequest').mockResolvedValue({reference: ''});
  await render(<RequestNew params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Origine'), 'Montréal');
  await fireEvent.changeText(screen.getByLabelText('Destination'), 'Dakar');
  await fireEvent.changeText(screen.getByLabelText('Description du contenu'), 'Carton');
  await fireEvent.changeText(screen.getByLabelText('Nom du destinataire'), 'Client');
  await fireEvent.press(screen.getByRole('button', {name: 'Envoyer la demande'}));
  await waitFor(() => expect(screen.getByText(/référence.*non confirmée/i)).toBeTruthy());
  expect(screen.queryByText('Demande envoyée')).toBeNull();
});

test('le poids rejette la notation exponentielle', async () => {
  const create = jest.spyOn(ports, 'createRequest');
  await render(<RequestNew params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Origine'), 'Montréal');
  await fireEvent.changeText(screen.getByLabelText('Destination'), 'Dakar');
  await fireEvent.changeText(screen.getByLabelText('Description du contenu'), 'Carton');
  await fireEvent.changeText(screen.getByLabelText('Nom du destinataire'), 'Client');
  await fireEvent.changeText(screen.getByLabelText('Poids estimé (kg, facultatif)'), '1e2');
  await fireEvent.press(screen.getByRole('button', {name: 'Envoyer la demande'}));
  expect(screen.getByText('Poids invalide.')).toBeTruthy();
  expect(create).not.toHaveBeenCalled();
});

test.each(['.5', '0,5', '5.'])('le poids décimal %s reste accepté', async weight => {
  const create = jest.spyOn(ports, 'createRequest').mockResolvedValue({reference: 'REQ-1'});
  await render(<RequestNew params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Origine'), 'Montréal');
  await fireEvent.changeText(screen.getByLabelText('Destination'), 'Dakar');
  await fireEvent.changeText(screen.getByLabelText('Description du contenu'), 'Carton');
  await fireEvent.changeText(screen.getByLabelText('Nom du destinataire'), 'Client');
  await fireEvent.changeText(screen.getByLabelText('Poids estimé (kg, facultatif)'), weight);
  await fireEvent.press(screen.getByRole('button', {name: 'Envoyer la demande'}));
  await waitFor(() => expect(create).toHaveBeenCalledWith(expect.objectContaining({weightKg: weight})));
});

test('une demande ne transmet pas son identifiant comme identifiant de devis', async () => {
  useDetail.mockReturnValue({configured: true, loading: false, error: null, detail: {id: 'request-1', title: 'Demande', fields: []}});
  await render(<RequestDetail params={{id: 'request-1'}} />);
  expect(screen.getByRole('button', {name: 'Consulter le devis'}).props.accessibilityState.disabled).toBe(true);
  expect(router.push).not.toHaveBeenCalled();
});

test('le devis associé est ouvert uniquement avec son propre identifiant', async () => {
  useDetail.mockReturnValue({configured: true, loading: false, error: null, detail: {id: 'request-1', title: 'Demande', fields: [], quoteId: 'quote-2'}});
  await render(<RequestDetail params={{id: 'request-1'}} />);
  await fireEvent.press(screen.getByRole('button', {name: 'Consulter le devis'}));
  expect(router.push).toHaveBeenCalledWith({pathname: '/s/[name]', params: {name: 'quote', id: 'quote-2'}});
});

test('une décision absente ou invalide ne devient jamais une acceptation', async () => {
  const decide = jest.spyOn(ports, 'decideQuote');
  await render(<QuoteDecision params={{id: 'quote-1', decision: 'inconnue'}} />);
  expect(screen.getByText(/choisissez explicitement/i)).toBeTruthy();
  expect(screen.queryByRole('button', {name: 'Confirmer l’acceptation'})).toBeNull();
  expect(decide).not.toHaveBeenCalled();
});

test.each(['accept', 'refuse'])('la décision explicite %s est transmise telle quelle', async decision => {
  const decide = jest.spyOn(ports, 'decideQuote').mockResolvedValue(undefined);
  await render(<QuoteDecision params={{id: 'quote-1', decision}} />);
  const label = decision === 'accept' ? 'Confirmer l’acceptation' : 'Confirmer le refus';
  await fireEvent.press(screen.getByRole('button', {name: label}));
  await waitFor(() => expect(decide).toHaveBeenCalledWith({id: 'quote-1', decision}));
  expect(screen.getByText('Votre décision a été transmise.')).toBeTruthy();
});

test('modifier le profil après un succès retire la confirmation périmée', async () => {
  jest.spyOn(ports, 'updateProfile').mockResolvedValue(undefined);
  await render(<ProfileEdit params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Nom complet'), 'Premier nom');
  await fireEvent.press(screen.getByRole('button', {name: 'Enregistrer'}));
  await waitFor(() => expect(screen.getByText('Profil mis à jour.')).toBeTruthy());
  await fireEvent.changeText(screen.getByLabelText('Nom complet'), 'Nouveau nom');
  expect(screen.queryByText('Profil mis à jour.')).toBeNull();
});

test('modifier la référence efface la localisation du colis précédent', async () => {
  jest.spyOn(ports, 'lookupLocation').mockResolvedValue({description: 'Étagère A'});
  await render(<Warehouse params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Référence du colis'), 'A');
  await fireEvent.press(screen.getByRole('button', {name: 'Rechercher'}));
  await waitFor(() => expect(screen.getByText('Étagère A')).toBeTruthy());
  await fireEvent.changeText(screen.getByLabelText('Référence du colis'), 'B');
  expect(screen.queryByText('Étagère A')).toBeNull();
});

test('modifier le profil pendant la sauvegarde ne confirme pas les nouvelles données', async () => {
  let finish;
  jest.spyOn(ports, 'updateProfile').mockImplementation(() => new Promise(resolve => {finish = resolve;}));
  await render(<ProfileEdit params={{}} />);
  await fireEvent.changeText(screen.getByLabelText('Nom complet'), 'Premier nom');
  await fireEvent.press(screen.getByRole('button', {name: 'Enregistrer'}));
  await fireEvent.changeText(screen.getByLabelText('Nom complet'), 'Nouveau nom');
  await act(() => finish());
  expect(screen.queryByText('Profil mis à jour.')).toBeNull();
  expect(screen.getByText(/modifiées pendant l’opération/i)).toBeTruthy();
});

test('une action bloque les doubles soumissions et efface un succès précédent avant une erreur', async () => {
  let resolve;
  const action = jest.fn().mockImplementationOnce(() => new Promise(done => {resolve = done;})).mockRejectedValueOnce(Error('réseau'));
  function Example() {
    const state = useAction(action);
    return <View><Text onPress={() => {void state.run('a'); void state.run('a');}}>Double</Text>
      <Text onPress={() => void state.run('b')}>Reprendre</Text>
      {state.result !== null && <Text>Succès</Text>}
      {!!state.error && <Text>{state.error}</Text>}
    </View>;
  }
  await render(<Example />);
  await fireEvent.press(screen.getByText('Double'));
  expect(action).toHaveBeenCalledTimes(1);
  await act(() => resolve(undefined));
  expect(screen.getByText('Succès')).toBeTruthy();
  await fireEvent.press(screen.getByText('Reprendre'));
  await waitFor(() => expect(screen.getByText(/résultat.*confirmé/i)).toBeTruthy());
  expect(screen.queryByText('Succès')).toBeNull();
});
