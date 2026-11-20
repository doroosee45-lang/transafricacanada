import {useState} from 'react';
import {ports, useAction} from '../../data';
import type {Params} from '../../nav';
import {Button, Field, Notice, Page} from '../../ui';


type Props = {params: Params};

export function ProfileEdit(_: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const action = useAction(ports.updateProfile);
  return (
    <Page title="Modifier le profil">
      <Field label="Nom complet" value={name} onChangeText={value => {setName(value); action.clear();}} autoCapitalize="words" textContentType="name" />
      <Field label="Téléphone" value={phone} onChangeText={value => {setPhone(value); action.clear();}} keyboardType="phone-pad" textContentType="telephoneNumber" />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Profil mis à jour.</Notice>}
      <Button label="Enregistrer" busy={action.busy} disabled={!name.trim()} onPress={() => void action.run({name: name.trim(), phone: phone.trim()})} />
    </Page>
  );
}
