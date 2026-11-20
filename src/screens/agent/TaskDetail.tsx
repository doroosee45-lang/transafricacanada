import {router} from 'expo-router';
import type {Params} from '../../nav';
import {Button} from '../../ui';
import {DetailScreen} from '.././generic';


type Props = {params: Params};

export const TaskDetail = ({params}: Props) => (
  <DetailScreen listKey="tasks" id={params.id} title="Détail de la tâche">
    <Button label="Scanner un colis" onPress={() => router.push('/scan')} />
  </DetailScreen>
);
