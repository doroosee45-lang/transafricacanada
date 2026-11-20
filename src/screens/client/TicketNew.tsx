import {useState} from 'react';
import {ports, useAction} from '../../data';
import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Choices, Field, Notice, Page} from '../../ui';


type Props = {params: Params};

export function TicketNew(_: Props) {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [reference, setReference] = useState('');
  const [message, setMessage] = useState('');
  const action = useAction(ports.createTicket);
  async function submit() {
    const result = await action.run({subject: subject.trim(), category, message: message.trim(), reference: reference.trim()});
    if (result) goReplace('ticket-detail', {id: result.id});
  }
  const ready = !!category && !!subject.trim() && !!message.trim();
  return (
    <Page title="Nouveau ticket" lead="Décrivez votre problème ; n’envoyez jamais de mot de passe ou de code.">
      <Choices label="Catégorie" value={category} options={categories} onChange={value => {setCategory(value); action.clear();}} />
      <Field label="Objet" value={subject} onChangeText={value => {setSubject(value); action.clear();}} maxLength={120} />
      <Field label="Référence concernée (facultatif)" value={reference} onChangeText={value => {setReference(value); action.clear();}} autoCapitalize="characters" />
      <Field label="Message" value={message} onChangeText={value => {setMessage(value); action.clear();}} multiline maxLength={2000} />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      <Button label="Envoyer" busy={action.busy} disabled={!ready} onPress={() => void submit()} />
    </Page>
  );
}

const categories = [{value: 'parcel', label: 'Colis'}, {value: 'payment', label: 'Paiement'}, {value: 'account', label: 'Compte'}, {value: 'other', label: 'Autre'}];
