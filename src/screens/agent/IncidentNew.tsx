import {useState} from 'react';
import {ports, useAction} from '../../data';
import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Choices, Field, Notice, Page} from '../../ui';


type Props = {params: Params};

export function IncidentNew({params}: Props) {
  const [reference, setReference] = useState(params.reference ?? '');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const action = useAction(ports.createIncident);
  return (
    <Page title="Déclarer un incident">
      <Field label="Référence concernée" value={reference} onChangeText={value => {setReference(value); action.clear();}} autoCapitalize="characters" autoCorrect={false} />
      <Choices label="Type d’incident" value={type} options={incidentTypes} onChange={value => {setType(value); action.clear();}} />
      <Field label="Description" value={description} onChangeText={value => {setDescription(value); action.clear();}} multiline maxLength={2000} />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Incident transmis.</Notice>}
      <Button label="Déclarer" busy={action.busy} disabled={!reference.trim() || !type || !description.trim()}
        onPress={() => void action.run({reference: reference.trim(), type, description: description.trim()})} />
      <Button variant="outline" label="Historique des incidents" onPress={() => goReplace('incidents')} />
    </Page>
  );
}

const incidentTypes = [{value: 'damage', label: 'Dommage'}, {value: 'loss', label: 'Perte'}, {value: 'delay', label: 'Retard'}, {value: 'refused', label: 'Livraison refusée'}, {value: 'other', label: 'Autre'}];
