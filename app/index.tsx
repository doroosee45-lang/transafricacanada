import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import {colors as c} from '../src/theme';
import {modules} from '../src/modules';
import {useAuth} from '../src/auth/AuthProvider';
import {supabase} from '../src/auth/supabase';
import {brand} from '../src/brand';
import {Body, Button, Notice, Page, Section, Tiles} from '../src/ui';
import type {IconName} from '../src/ui';
import {Carousel, Footer, Hero, Navbar} from '../src/public';
import type {Slide} from '../src/public';

const groups: {title: string; subtitle: string; ids: string[]}[] = [
  {title: 'Espace client', subtitle: 'Vos informations et vos expéditions', ids: ['colis', 'expeditions', 'devis', 'paiements', 'notifications', 'agences', 'profil', 'support']},
  {title: 'Équipes autorisées', subtitle: 'Accès soumis aux permissions du serveur', ids: ['operations', 'scan', 'livraison', 'synchronisation', 'supervision']},
];

const icons: Record<string, IconName> = {
  colis: 'cube-outline', expeditions: 'boat-outline', devis: 'document-text-outline', paiements: 'card-outline', notifications: 'notifications-outline',
  agences: 'business-outline', profil: 'person-outline', support: 'help-buoy-outline', operations: 'construct-outline', scan: 'qr-code-outline',
  livraison: 'bicycle-outline', synchronisation: 'sync-outline', supervision: 'eye-outline',
};

const slides: Slide[] = [
  {image: brand.images.entrepot, title: 'Entrepôt', text: 'Réception, validation et localisation des colis.'},
  {image: brand.images.avion, title: 'Vols', text: 'Suivi des vols associés à vos expéditions.'},
  {image: brand.images.transport, title: 'Transport', text: 'Livraison et preuve de remise sur le terrain.'},
];

function openModule(id: string) {
  const mapping: Record<string, string> = {expeditions: 'shipments', devis: 'quotes', paiements: 'payments', notifications: 'notifications', agences: 'agencies'};
  if (id === 'synchronisation') router.push('/synchronisation');
  else if (id === 'colis') router.push('/parcels');
  else if (mapping[id]) router.push({pathname: '/records', params: {kind: mapping[id]}});
  else router.push({pathname: '/section', params: {id}});
}

export default function Home() {
  const {session, loading, error: sessionError} = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  async function handleAuth() {
    if (!session) { router.push('/auth'); return; }
    if (!supabase || signingOut) return;
    setSignOutError('');
    setSigningOut(true);
    try {
      const {error} = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      setSignOutError('La déconnexion n’a pas pu être confirmée. Vérifiez votre connexion et réessayez.');
    } finally {
      setSigningOut(false);
    }
  }

  const header = (
    <>
      <Hero
        eyebrow="VOTRE ESPACE LOGISTIQUE"
        title="Tout votre parcours,"
        accent="au même endroit."
        text="Colis, expéditions et opérations, réunis dans une expérience mobile simple."
        actions={[
          {label: 'Espace client', onPress: () => router.push({pathname: '/s/[name]', params: {name: 'client-dashboard'}})},
          {label: 'Espace agent', outline: true, onPress: () => router.push({pathname: '/s/[name]', params: {name: 'agent-dashboard'}})},
        ]}
      />
    </>
  );

  return (
    <View style={s.root}>
      <Page nav={<Navbar safeTop />} header={header} footer={<Footer />}>
        <Button label={loading ? 'Chargement de la session…' : signingOut ? 'Déconnexion…' : session ? 'Se déconnecter' : 'Se connecter ou créer un compte'} onPress={() => void handleAuth()} disabled={loading} busy={signingOut} />
        {!!(sessionError || signOutError) && <Text accessibilityRole="alert" style={s.error}>{signOutError || sessionError}</Text>}
        <Button variant="outline" label="Découvrir l’application" onPress={() => router.push({pathname: '/s/[name]', params: {name: 'splash'}})} />
        <Notice>Les données métier seront disponibles après intégration du Core API. Aucun contenu affiché ne représente une opération réelle.</Notice>
        <Section>En images</Section>
        <Carousel slides={slides} />
        <Text style={s.note}>Images d’illustration.</Text>
        {groups.map(g => (
          <View key={g.title}>
            <Section>{g.title}</Section>
            <Body>{g.subtitle}</Body>
            <Tiles items={g.ids.map(id => ({label: modules[id].title, hint: 'Voir le module', icon: icons[id], onPress: () => openModule(id)}))} />
          </View>
        ))}
      </Page>
    </View>
  );
}

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: c.background},
  error: {color: c.rose, lineHeight: 20, marginTop: 10},
  note: {color: c.mutedSoft, fontSize: 12, marginTop: 10},
});
