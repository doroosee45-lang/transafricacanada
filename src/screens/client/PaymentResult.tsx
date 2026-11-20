import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Notice} from '../../ui';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export function PaymentResult({params}: Props) {
  return (
    <DetailScreen listKey="payments" id={params.id} title="Statut du paiement">
      {detail => <>{!detail && <Notice tone="warning">Le statut n’est pas confirmé. Une redirection ou un retour d’application ne prouve pas qu’un paiement a abouti : attendez la confirmation du service.</Notice>}
        <Button label="Historique des paiements" onPress={() => goReplace('payments-history')} /></>}
    </DetailScreen>
  );
}
