import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Requests = (_: Props) => (
  <ListScreen listKey="requests" title="Mes demandes" lead="Suivez l’état de vos demandes d’expédition." empty="Aucune demande pour le moment."
    itemTarget={id => ({name: 'request-detail', params: {id}})} action={{label: 'Nouvelle demande', target: {name: 'request-new'}}} />
);
