import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {router} from 'expo-router';
import type {Params} from '../../nav';
import {Body, Button, Card, Icon, Page, Section} from '../../ui';
import type {IconName} from '../../ui';
import {Carousel, Footer, Hero, Navbar} from '../../public';
import type {Slide} from '../../public';
import {brand} from '../../brand';
import {colors as c} from '../../theme';

const slides: Slide[] = [
  {image: brand.images.entrepot, title: 'Entrepôt', text: 'Réception, validation et localisation des colis.'},
  {image: brand.images.avion, title: 'Vols', text: 'Suivi des vols associés à vos expéditions.'},
  {image: brand.images.transport, title: 'Transport', text: 'Livraison et preuve de remise sur le terrain.'},
];

const values: {icon: IconName; title: string; text: string}[] = [
  {icon: 'person-outline', title: 'Pour les clients', text: 'Suivre ses demandes, ses colis et ses expéditions, consulter les devis et les paiements.'},
  {icon: 'people-outline', title: 'Pour les agents', text: 'Réaliser les opérations de terrain autorisées : scan, réception, transfert, livraison.'},
  {icon: 'shield-checkmark-outline', title: 'Fiabilité', text: 'Devis et paiements confirmés par le serveur, historique des actions et rôles contrôlés.'},
];

export function About(_: {params: Params}) {
  return (
    <Page nav={<Navbar />} header={<><Hero eyebrow="À PROPOS" title={brand.name} accent="au service de vos envois" text={brand.tagline} actions={[{label: 'Créer un compte', onPress: () => router.push({pathname: '/auth', params: {mode: 'register'}})}]} /></>} footer={<Footer />}>
      <Section>Notre mission</Section>
      <Body>Trans Africa Canada regroupe les opérations logistiques et commerciales de l’entreprise dans une seule application, pour les clients comme pour les agents de terrain.</Body>
      {values.map(v => (
        <Card key={v.title}>
          <View style={s.line}><View style={s.icon}><Icon name={v.icon} size={22} /></View><Text style={s.title}>{v.title}</Text></View>
          <Body>{v.text}</Body>
        </Card>
      ))}
      <Section>En images</Section>
      <Carousel slides={slides} />
      <Text style={s.note}>Images d’illustration.</Text>
      <Button label="Découvrir les solutions" variant="outline" onPress={() => router.push({pathname: '/s/[name]', params: {name: 'solutions'}})} />
    </Page>
  );
}

const s = StyleSheet.create({
  line: {flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {width: 42, height: 42, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center'},
  title: {color: c.ink, fontWeight: '800', fontSize: 16, flex: 1},
  note: {color: c.mutedSoft, fontSize: 12, marginTop: 10},
});
