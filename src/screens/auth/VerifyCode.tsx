import React, {useState} from 'react';
import {router} from 'expo-router';
import {supabase} from '../../auth/supabase';
import type {Params} from '../../nav';
import {Button, Field, Notice, Page} from '../../ui';

type Props = {params: Params};

export function VerifyCode({params}: Props) {
  const [email, setEmail] = useState(params.email ?? '');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const address = email.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);
  const validCode = /^\d{6,8}$/.test(code.trim());

  async function verify() {
    if (busy || !supabase) return;
    setBusy(true); setMessage(''); setFailed(false);
    try {
      const {error} = await supabase.auth.verifyOtp({email: address, token: code.trim(), type: 'signup'});
      if (error) throw error;
      router.replace('/');
    } catch {
      setFailed(true); setMessage('Code invalide ou expiré. Vérifiez-le ou demandez un nouveau code.');
    } finally { setBusy(false); }
  }
  async function resend() {
    if (busy || !supabase || !validEmail) return;
    setBusy(true); setMessage(''); setFailed(false);
    try {
      const {error} = await supabase.auth.resend({type: 'signup', email: address});
      if (error) throw error;
      setMessage('Si le compte existe, un nouveau code a été envoyé.');
    } catch {
      setFailed(true); setMessage('Impossible d’envoyer un nouveau code pour le moment.');
    } finally { setBusy(false); }
  }
  return (
    <Page title="Vérification du compte" lead="Saisissez le code reçu par email pour confirmer votre compte.">
      {!supabase && <Notice tone="warning">Authentification indisponible : configuration Supabase manquante.</Notice>}
      <Field label="Adresse email" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" editable={!busy} />
      <Field label="Code de vérification" value={code} onChangeText={setCode} keyboardType="number-pad" textContentType="oneTimeCode" maxLength={8} editable={!busy} />
      {!!message && <Notice tone={failed ? 'error' : 'success'}>{message}</Notice>}
      <Button label="Vérifier" busy={busy} disabled={!supabase || !validEmail || !validCode} onPress={() => void verify()} />
      <Button variant="outline" label="Renvoyer le code" disabled={busy || !supabase || !validEmail} onPress={() => void resend()} />
    </Page>
  );
}
