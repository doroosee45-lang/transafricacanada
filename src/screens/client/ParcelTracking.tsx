import {Text} from 'react-native';
import {router} from 'expo-router';
import type {Params} from '../../nav';
import {Body, Button, Card, Notice, Page} from '../../ui';


type Props = {params: Params};

export function ParcelTracking({params}: Props) {
  const layers = [
    ['Suivi du colis', 'Étapes physiques confirmées (réception, transfert, livraison).'],
    ['Suivi de l’expédition', 'Regroupement et acheminement du lot contenant le colis.'],
    ['Position GPS', 'Dernière position transmise par un appareil autorisé, jamais déduite.'],
    ['Suivi du vol', 'Statut du vol associé : l’arrivée du vol ne confirme pas la réception du colis.'],
  ];
  return (
    <Page title="Suivi chronologique" lead="Quatre suivis distincts, chacun alimenté par sa propre source.">
      {layers.map(([title, text]) => <Card key={title}><Text style={{fontWeight: '800'}}>{title}</Text><Body>{text}</Body></Card>)}
      <Button label="Voir la chronologie du colis" disabled={!params.id} onPress={() => router.push({pathname: '/parcel-detail', params: {id: params.id}})} />
      {!params.id && <Notice tone="warning">Ouvrez cet écran depuis le détail d’un colis.</Notice>}
    </Page>
  );
}
