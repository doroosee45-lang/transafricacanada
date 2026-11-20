import {useState} from 'react';
import {ports, useAction} from '../../data';
import type {Params} from '../../nav';
import {Button, Field, Notice, Page} from '../../ui';


type Props = {params: Params};

export function Transfer({params}: Props) {
  const [reference, setReference] = useState(params.reference ?? '');
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const action = useAction(ports.transferParcel);
  return (
    <Page title="Transfert et remise" lead="Transférez un colis à un autre agent ou à une agence.">
      <Field label="Référence du colis" value={reference} onChangeText={value => {setReference(value); action.clear();}} autoCapitalize="characters" autoCorrect={false} />
      <Field label="Agent ou agence destinataire" value={target} onChangeText={value => {setTarget(value); action.clear();}} />
      <Field label="Remarque (facultatif)" value={note} onChangeText={value => {setNote(value); action.clear();}} multiline />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Transfert transmis.</Notice>}
      <Button label="Confirmer le transfert" busy={action.busy} disabled={!reference.trim() || !target.trim()}
        onPress={() => void action.run({reference: reference.trim(), target: target.trim(), note: note.trim()})} />
    </Page>
  );
}
