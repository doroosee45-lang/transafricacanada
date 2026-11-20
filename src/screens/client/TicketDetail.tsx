import type {Params} from '../../nav';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export const TicketDetail = ({params}: Props) => <DetailScreen listKey="tickets" id={params.id} title="Détail du ticket" />;
