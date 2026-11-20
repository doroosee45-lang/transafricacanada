import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Incidents = (_: Props) => (
  <ListScreen listKey="incidents" title="Incidents" lead="Historique des incidents déclarés." empty="Aucun incident déclaré."
    itemTarget={id => ({name: 'incident-detail', params: {id}})} action={{label: 'Déclarer un incident', target: {name: 'incident-new'}}} />
);
