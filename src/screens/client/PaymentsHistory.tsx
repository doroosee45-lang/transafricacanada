import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const PaymentsHistory = (_: Props) => (
  <ListScreen listKey="payments" title="Historique des paiements" lead="Seuls les paiements confirmés par le service apparaissent comme réglés." empty="Aucun paiement enregistré."
    itemTarget={id => ({name: 'payment-result', params: {id}})} />
);
