import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Deliveries = (_: Props) => (
  <ListScreen listKey="deliveries" title="Livraisons à effectuer" lead="Livraisons qui vous sont affectées." empty="Aucune livraison à effectuer."
    itemTarget={id => ({name: 'delivery-detail', params: {id}})} />
);
