import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button} from '../../ui';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export const DeliveryDetail = ({params}: Props) => (
  <DetailScreen listKey="deliveries" id={params.id} title="Détail de la livraison">
    <Button label="Preuve de livraison" disabled={!params.id} onPress={() => go('proof', {id: params.id})} />
    <Button variant="outline" label="Déclarer un incident" onPress={() => go('incident-new')} />
  </DetailScreen>
);
