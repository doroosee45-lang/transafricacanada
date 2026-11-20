import type {Params} from '../../nav';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export const IncidentDetail = ({params}: Props) => <DetailScreen listKey="incidents" id={params.id} title="Détail de l’incident" />;
