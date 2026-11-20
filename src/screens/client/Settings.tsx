import {useState} from 'react';
import {Switch, Text, View} from 'react-native';
import {router} from 'expo-router';
import {useAuth} from '../../auth/AuthProvider';
import {supabase} from '../../auth/supabase';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button, Card, Notice, Page, Section} from '../../ui';


type Props = {params: Params};

export function Settings(_: Props) {
  const {session} = useAuth();
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true); setMessage('');
    try {
      const {error} = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/');
    } catch {
      setMessage('La déconnexion n’a pas pu être confirmée. Réessayez.');
    } finally { setBusy(false); }
  }
  return (
    <Page title="Paramètres et sécurité">
      <Section>Notifications</Section>
      <Card>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{flex: 1}}>Notifications push</Text><Switch accessibilityLabel="Notifications push" value={push} onValueChange={setPush} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14}}>
          <Text style={{flex: 1}}>Notifications par email</Text><Switch accessibilityLabel="Notifications par email" value={email} onValueChange={setEmail} />
        </View>
      </Card>
      <Notice tone="warning">Ces préférences ne sont pas encore enregistrées : l’envoi de notifications nécessite le service.</Notice>
      <Section>Compte</Section>
      <Button variant="outline" label="Langue et pays" onPress={() => go('language')} />
      <Button variant="outline" label="Changer le mot de passe" disabled={!session} onPress={() => router.push({pathname: '/auth', params: {mode: 'reset'}})} />
      {!!message && <Notice tone="error">{message}</Notice>}
      <Button variant="danger" label="Se déconnecter" busy={busy} disabled={!session} onPress={() => void signOut()} />
    </Page>
  );
}
