import {useState} from 'react';
import {ports, useAction, useList} from '../../data';
import type {Params} from '../../nav';
import {Body, Button, Field, Notice, Page, Row, Section} from '../../ui';


type Props = {params: Params};

export function Addresses(_: Props) {
  const [form, setForm] = useState({label: '', recipient: '', phone: '', line: '', city: '', country: ''});
  const action = useAction(ports.saveAddress);
  const set = (key: keyof typeof form) => (value: string) => {setForm(old => ({...old, [key]: value})); action.clear();};
  return (
    <Page title="Adresses et destinataires" lead="Enregistrez les adresses utilisées pour vos expéditions.">
      <ListSection />
      <Section>Ajouter une adresse</Section>
      <Field label="Libellé" value={form.label} onChangeText={set('label')} />
      <Field label="Destinataire" value={form.recipient} onChangeText={set('recipient')} autoCapitalize="words" />
      <Field label="Téléphone" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
      <Field label="Adresse" value={form.line} onChangeText={set('line')} />
      <Field label="Ville" value={form.city} onChangeText={set('city')} />
      <Field label="Pays" value={form.country} onChangeText={set('country')} />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Adresse enregistrée.</Notice>}
      <Button label="Enregistrer l’adresse" busy={action.busy} disabled={!form.recipient.trim() || !form.line.trim() || !form.city.trim()} onPress={() => void action.run(form)} />
    </Page>
  );
}

function ListSection() {
  const {items, configured} = useList('addresses');
  if (!configured) return <Notice tone="warning">Service non configuré : vos adresses enregistrées apparaîtront ici.</Notice>;
  return <>{items.map(item => <Row key={item.id} title={item.title} subtitle={item.subtitle} />)}{items.length === 0 && <Body>Aucune adresse enregistrée.</Body>}</>;
}
