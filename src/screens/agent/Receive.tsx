import {useState} from 'react';
import {router} from 'expo-router';
import {ports, useAction} from '../../data';
import type {Params} from '../../nav';
import {Button, Choices, Field, Notice, Page} from '../../ui';


type Props = {params: Params};

export function Receive({params}: Props) {
  const [reference, setReference] = useState(params.reference ?? '');
  const [condition, setCondition] = useState('');
  const [note, setNote] = useState('');
  const action = useAction(ports.receiveParcel);
  return (
    <Page title="Réception du colis" lead="Validez la réception physique après contrôle.">
      <Field label="Référence du colis" value={reference} onChangeText={value => {setReference(value); action.clear();}} autoCapitalize="characters" autoCorrect={false} />
      <Choices label="État constaté" value={condition} options={conditions} onChange={value => {setCondition(value); action.clear();}} />
      <Field label="Remarque (facultatif)" value={note} onChangeText={value => {setNote(value); action.clear();}} multiline />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Réception transmise.</Notice>}
      <Button label="Valider la réception" busy={action.busy} disabled={!reference.trim() || !condition}
        onPress={() => void action.run({reference: reference.trim(), condition, note: note.trim()})} />
      <Button variant="outline" label="Scanner" onPress={() => router.push('/scan')} />
    </Page>
  );
}

const conditions = [{value: 'good', label: 'Bon état'}, {value: 'damaged', label: 'Endommagé'}, {value: 'incomplete', label: 'Incomplet'}];
