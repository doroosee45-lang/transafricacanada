import {router} from 'expo-router';
import {ports, useAction} from '../../data';
import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Notice, Page} from '../../ui';


type Props = {params: Params};

export function QuoteDecision({params}: Props) {
  const decision = params.decision === 'refuse' || params.decision === 'accept' ? params.decision : null;
  const action = useAction(ports.decideQuote);
  async function confirm() {
    if (!params.id || !decision) return;
    await action.run({id: params.id, decision});
  }
  const done = action.result !== null;
  return (
    <Page title={decision === 'accept' ? 'Accepter le devis' : decision === 'refuse' ? 'Refuser le devis' : 'Décision sur le devis'}
      lead={decision === 'accept' ? 'Votre acceptation engage la suite du traitement. Le paiement sera ensuite demandé.' : decision === 'refuse' ? 'Le refus clôt ce devis. Vous pourrez créer une nouvelle demande.' : undefined}>
      {!params.id && <Notice tone="warning">Aucun devis sélectionné.</Notice>}
      {!decision && <Notice tone="warning">Choisissez explicitement une décision depuis le devis.</Notice>}
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {done && <Notice tone="success">Votre décision a été transmise.</Notice>}
      {!done && decision && <Button variant={decision === 'accept' ? 'primary' : 'danger'} label={decision === 'accept' ? 'Confirmer l’acceptation' : 'Confirmer le refus'} busy={action.busy} disabled={!params.id} onPress={() => void confirm()} />}
      {done && decision === 'accept' && <Button label="Choisir le paiement" onPress={() => goReplace('payment-select', {id: params.id})} />}
      <Button variant="outline" label="Retour" onPress={() => router.back()} />
    </Page>
  );
}
