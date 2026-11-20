import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Card, KeyValue, Notice, Page} from '../../ui';


type Props = {params: Params};

export function RequestConfirm({confirmedReference}: Props & {confirmedReference?: string}) {
  return (
    <Page title={confirmedReference ? 'Demande envoyée' : 'Envoi non confirmé'} lead={confirmedReference ? 'La transmission a été confirmée par le service.' : undefined}>
      {confirmedReference ? <Card><KeyValue label="Référence" value={confirmedReference} /></Card> :
        <Notice tone="warning">Envoi non confirmé. Consultez vos demandes pour vérifier leur statut.</Notice>}
      <Button label="Voir mes demandes" onPress={() => goReplace('requests')} />
      <Button variant="outline" label="Retour à l’espace client" onPress={() => goReplace('client-dashboard')} />
    </Page>
  );
}
