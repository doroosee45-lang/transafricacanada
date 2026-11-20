import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button} from '../../ui';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export function RequestDetail({params}: Props) {
  return (
    <DetailScreen listKey="requests" id={params.id} title="Détail de la demande">
      {detail => <Button label="Consulter le devis" onPress={() => go('quote', {id: detail?.quoteId})} disabled={!detail?.quoteId} />}
    </DetailScreen>
  );
}
