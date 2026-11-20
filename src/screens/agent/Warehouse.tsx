import {useState} from 'react';
import {ports, useAction} from '../../data';
import type {Params} from '../../nav';
import {Button, Card, Field, KeyValue, Notice, Page} from '../../ui';


type Props = {params: Params};

export function Warehouse({params}: Props) {
  const [reference, setReference] = useState(params.reference ?? '');
  const action = useAction(ports.lookupLocation);
  return (
    <Page title="Emplacement en entrepôt" lead="Consultez où se trouve un colis.">
      <Field label="Référence du colis" value={reference} onChangeText={value => {setReference(value); action.clear();}} autoCapitalize="characters" autoCorrect={false} />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {!!action.result && <Card><KeyValue label="Emplacement" value={action.result.description} /></Card>}
      <Button label="Rechercher" busy={action.busy} disabled={!reference.trim()} onPress={() => void action.run({reference: reference.trim()})} />
    </Page>
  );
}
