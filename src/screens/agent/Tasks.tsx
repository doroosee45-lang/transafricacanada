import type {Params} from '../../nav';
import {ListScreen} from '.././generic';


type Props = {params: Params};

export const Tasks = (_: Props) => (
  <ListScreen listKey="tasks" title="Tâches affectées" lead="Tâches qui vous sont attribuées par le service." empty="Aucune tâche affectée."
    itemTarget={id => ({name: 'task-detail', params: {id}})} />
);
