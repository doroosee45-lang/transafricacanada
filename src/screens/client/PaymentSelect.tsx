import {useState} from 'react';
import {ports, useAction} from '../../data';
import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {Button, Choices, Notice, Page} from '../../ui';


type Props = {params: Params};

export function PaymentSelect({params}: Props) {
  const [method, setMethod] = useState('');
  const action = useAction(ports.startPayment);
  async function pay() {
    if (!params.id || !method) return;
    const result = await action.run({id: params.id, method});
    if (result) goReplace('payment-result', {id: result.paymentId});
  }
  return (
    <Page title="Paiement" lead="Choisissez un moyen de paiement. Les moyens réellement disponibles seront fournis par le service.">
      {!params.id && <Notice tone="warning">Aucun devis sélectionné.</Notice>}
      <Choices label="Moyen de paiement" value={method} options={methods} onChange={value => {setMethod(value); action.clear();}} />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      <Button label="Lancer le paiement" busy={action.busy} disabled={!params.id || !method} onPress={() => void pay()} />
    </Page>
  );
}

const methods = [{value: 'card', label: 'Carte bancaire'}, {value: 'mobile_money', label: 'Mobile money'}, {value: 'transfer', label: 'Virement'}];
