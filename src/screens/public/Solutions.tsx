import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import type {Params} from '../../nav';
import {Body, Button, Card, Icon, Page, Section} from '../../ui';
import type {IconName} from '../../ui';
import {Footer, Hero, Navbar} from '../../public';
import {brand} from '../../brand';
import {colors as c} from '../../theme';

const solutions: {icon: IconName; title: string; text: string}[] = [
  {icon: 'cube-outline', title: 'Suivi du colis', text: 'Historique chronologique de chaque colis.'},
  {icon: 'boat-outline', title: 'Suivi de l’expédition', text: 'Consultation des expéditions et de leur avancement.'},
  {icon: 'airplane-outline', title: 'Suivi du vol', text: 'Vols associés à vos expéditions.'},
  {icon: 'document-text-outline', title: 'Devis et paiements', text: 'Consultation des devis officiels et des paiements confirmés par le serveur.'},
  {icon: 'qr-code-outline', title: 'Scan QR', text: 'Lecture locale ; l’identification du colis nécessite le service.'},
  {icon: 'cloud-offline-outline', title: 'Mode hors ligne', text: 'File chiffrée préparée, non disponible dans Expo Go ; synchronisation non configurée.'},
];

export function Solutions(_: {params: Params}) {
  return (
    <Page nav={<Navbar />} header={<><Hero image={brand.images.avion} eyebrow="SOLUTIONS" title="Une plateforme," accent="toutes vos opérations" text="Des outils pour les clients et pour les agents de terrain." actions={[{label: 'Espace client', onPress: () => router.push({pathname: '/s/[name]', params: {name: 'client-dashboard'}})}, {label: 'Espace agent', outline: true, onPress: () => router.push({pathname: '/s/[name]', params: {name: 'agent-dashboard'}})}]} /></>} footer={<Footer />}>
      <Section>Fonctionnalités</Section>
      {solutions.map(item => (
        <Card key={item.title}>
          <View style={s.line}><View style={s.icon}><Icon name={item.icon} size={22} /></View><Text style={s.title}>{item.title}</Text></View>
          <Body>{item.text}</Body>
        </Card>
      ))}
      <Button label="Se connecter" onPress={() => router.push({pathname: '/auth', params: {mode: 'login'}})} />
    </Page>
  );
}

const s = StyleSheet.create({
  line: {flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {width: 42, height: 42, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center'},
  title: {color: c.ink, fontWeight: '800', fontSize: 16, flex: 1},
});
