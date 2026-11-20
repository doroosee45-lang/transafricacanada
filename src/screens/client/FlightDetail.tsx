import type {Params} from '../../nav';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export const FlightDetail = ({params}: Props) => (
  <DetailScreen listKey="flights" id={params.id} title="Détail du vol" lead="Le statut du vol est indépendant de celui du colis." />
);
