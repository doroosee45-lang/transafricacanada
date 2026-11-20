import {useAuth} from '../../auth/AuthProvider';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Button, Card, KeyValue, Notice, Page} from '../../ui';


type Props = {params: Params};

export function Profile(_: Props) {
  const {session} = useAuth();
  return (
    <Page title="Mon profil">
      {!session ? <Notice tone="warning">Connectez-vous pour consulter votre profil.</Notice> : (
        <Card>
          <KeyValue label="Email" value={session.user.email ?? 'Non renseigné'} />
          <KeyValue label="Identifiant" value={session.user.id} />
        </Card>
      )}
      <Button label="Modifier le profil" onPress={() => go('profile-edit')} disabled={!session} />
      <Button variant="outline" label="Adresses et destinataires" onPress={() => go('addresses')} />
      <Button variant="outline" label="Paramètres et sécurité" onPress={() => go('settings')} />
    </Page>
  );
}
