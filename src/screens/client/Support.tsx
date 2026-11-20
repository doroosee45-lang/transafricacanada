import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Support = (_: Props) => (
  <ListScreen listKey="tickets" title="Assistance" lead="Vos demandes d’assistance." empty="Aucune demande d’assistance."
    itemTarget={id => ({name: 'ticket-detail', params: {id}})} action={{label: 'Nouveau ticket', target: {name: 'ticket-new'}}} />
);
