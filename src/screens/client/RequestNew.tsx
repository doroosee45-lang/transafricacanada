import {useState} from 'react';
import {ports, useAction} from '../../data';
import type {Params} from '../../nav';
import {Button, Field, Notice, Page} from '../../ui';
import {RequestConfirm} from './RequestConfirm';


type Props = {params: Params};

export function RequestNew(_: Props) {
  const [draft, setDraft] = useState({origin: '', destination: '', description: '', weightKg: '', recipientName: '', recipientPhone: ''});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState('');
  const [uncertain, setUncertain] = useState(false);
  const action = useAction(ports.createRequest);
  const set = (key: keyof typeof draft) => (value: string) => {setDraft(old => ({...old, [key]: value})); action.clear();};

  async function submit() {
    const next: Record<string, string> = {};
    if (!draft.origin.trim()) next.origin = 'Indiquez l’origine.';
    if (!draft.destination.trim()) next.destination = 'Indiquez la destination.';
    if (!draft.description.trim()) next.description = 'Décrivez le contenu.';
    const weight = draft.weightKg.trim();
    if (weight && (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(weight) || !Number.isFinite(Number(weight.replace(',', '.'))) || Number(weight.replace(',', '.')) <= 0)) next.weightKg = 'Poids invalide.';
    if (!draft.recipientName.trim()) next.recipientName = 'Indiquez le destinataire.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const result = await action.run(draft);
    if (result) {
      if (typeof result.reference === 'string' && result.reference.trim()) setReference(result.reference.trim());
      else setUncertain(true);
    }
  }
  if (reference) return <RequestConfirm params={{}} confirmedReference={reference} />;
  return (
    <Page title="Nouvelle demande" lead="Le prix n’est pas calculé ici : un devis officiel vous sera transmis par le service.">
      <Field label="Origine" value={draft.origin} onChangeText={set('origin')} error={errors.origin} />
      <Field label="Destination" value={draft.destination} onChangeText={set('destination')} error={errors.destination} />
      <Field label="Description du contenu" value={draft.description} onChangeText={set('description')} multiline error={errors.description} />
      <Field label="Poids estimé (kg, facultatif)" value={draft.weightKg} onChangeText={set('weightKg')} keyboardType="decimal-pad" error={errors.weightKg} />
      <Field label="Nom du destinataire" value={draft.recipientName} onChangeText={set('recipientName')} error={errors.recipientName} />
      <Field label="Téléphone du destinataire" value={draft.recipientPhone} onChangeText={set('recipientPhone')} keyboardType="phone-pad" />
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {uncertain && <Notice tone="error">Référence non confirmée. Vérifiez l’historique avant toute nouvelle tentative.</Notice>}
      <Button label="Envoyer la demande" busy={action.busy} disabled={uncertain} onPress={() => void submit()} />
    </Page>
  );
}
