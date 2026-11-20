import {router} from 'expo-router';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button, Card, KeyValue, Notice, Page} from '../../ui';


type Props = {params: Params};

export function ScanResult({params}: Props) {
  const code = params.code?.trim();
  const actions = (
    <>
      <Button label="Réceptionner" onPress={() => go('receive', {reference: code})} />
      <Button variant="outline" label="Transférer" onPress={() => go('transfer', {reference: code})} />
      <Button variant="outline" label="Emplacement en entrepôt" onPress={() => go('warehouse', {reference: code})} />
      <Button variant="outline" label="Déclarer un incident" onPress={() => go('incident-new', {reference: code})} />
    </>
  );
  return (
    <Page title="Résultat du scan" lead="Le code lu n’identifie le colis qu’après vérification par le service.">
      {!code ? <Notice tone="warning">Aucun code scanné.</Notice> : (
        <>
          <Card><KeyValue label="Code lu" value={code} /></Card>
          <Notice tone="warning">Colis non identifié : la correspondance avec un colis sera fournie par le service.</Notice>
          {actions}
        </>
      )}
      <Button variant="outline" label="Scanner à nouveau" onPress={() => router.replace('/scan')} />
    </Page>
  );
}
