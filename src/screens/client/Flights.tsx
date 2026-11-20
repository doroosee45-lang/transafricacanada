import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Flights = (_: Props) => (
  <ListScreen listKey="flights" title="Vols associés" lead="Vols liés à vos expéditions." empty="Aucun vol associé."
    itemTarget={id => ({name: 'flight-detail', params: {id}})} />
);
