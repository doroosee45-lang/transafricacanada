import {router} from 'expo-router';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Page, Tiles} from '../../ui';
import {RightsNotice} from './common';

type Props = {params: Params};

export function AgentDashboard(_: Props) {
  return (
    <Page title="Espace agent" lead="Opérations de terrain autorisées pour votre profil.">
      <RightsNotice />
      <Tiles items={[
        {label: 'Mes tâches', onPress: () => go('tasks')},
        {label: 'Scanner', hint: 'QR code', onPress: () => router.push('/scan')},
        {label: 'Réception', onPress: () => go('receive')},
        {label: 'Entrepôt', onPress: () => go('warehouse')},
        {label: 'Transfert', onPress: () => go('transfer')},
        {label: 'Livraisons', onPress: () => go('deliveries')},
        {label: 'Incidents', onPress: () => go('incidents')},
        {label: 'Hors ligne', onPress: () => router.push('/synchronisation')},
        {label: 'Profil agent', onPress: () => go('agent-profile')},
      ]} />
    </Page>
  );
}
