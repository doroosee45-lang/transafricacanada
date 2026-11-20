import {router} from 'expo-router';
import {useAuth} from '../../auth/AuthProvider';
import {go, open} from '../../nav';
import type {Params} from '../../nav';
import {Button, Notice, Page, Tiles} from '../../ui';


type Props = {params: Params};

export function ClientDashboard(_: Props) {
  const {session} = useAuth();
  return (
    <Page title="Espace client" lead={session?.user.email ? `Connecté : ${session.user.email}` : 'Connectez-vous pour accéder à vos services.'}>
      {!session && <Button label="Se connecter" onPress={() => router.push('/auth')} />}
      <Tiles items={[
        {label: 'Nouvelle demande', hint: 'Demander une expédition', onPress: () => go('request-new')},
        {label: 'Mes demandes', onPress: () => go('requests')},
        {label: 'Mes colis', onPress: () => router.push('/parcels')},
        {label: 'Mes expéditions', onPress: () => open(rec('shipments'))},
        {label: 'Mes vols', onPress: () => go('flights')},
        {label: 'Notifications', onPress: () => open(rec('notifications'))},
        {label: 'Paiements', onPress: () => go('payments-history')},
        {label: 'Assistance', onPress: () => go('support')},
        {label: 'Mon profil', onPress: () => go('profile')},
        {label: 'Paramètres', onPress: () => go('settings')},
      ]} />
      <Notice>Chaque information affichée provient du service : le suivi du colis, de l’expédition, la position GPS et le vol sont distincts.</Notice>
    </Page>
  );
}

const rec = (kind: string) => ({href: {pathname: '/records', params: {kind}}} as const);
