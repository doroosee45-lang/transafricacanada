import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button} from '../../ui';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export function Quote({params}: Props) {
  return (
    <DetailScreen listKey="quotes" id={params.id} title="Devis officiel" lead="Seul le montant émis par le service fait foi.">
      <Button label="Accepter le devis" disabled={!params.id} onPress={() => go('quote-decision', {id: params.id, decision: 'accept'})} />
      <Button variant="outline" label="Refuser le devis" disabled={!params.id} onPress={() => go('quote-decision', {id: params.id, decision: 'refuse'})} />
    </DetailScreen>
  );
}
