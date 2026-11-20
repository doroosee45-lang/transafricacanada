import {router} from 'expo-router';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Body, Button, Page} from '../../ui';
import {RightsNotice} from './common';

type Props = {params: Params};

export function AgentProfile(_: Props) {
  return (
    <Page title="Profil agent">
      <RightsNotice />
      <Body>Le rôle, l’agence et les permissions seront fournis par le service.</Body>
      <Button label="Mon profil" onPress={() => go('profile')} />
      <Button variant="outline" label="Opérations hors ligne" onPress={() => router.push('/synchronisation')} />
      <Button variant="outline" label="Paramètres et sécurité" onPress={() => go('settings')} />
    </Page>
  );
}
