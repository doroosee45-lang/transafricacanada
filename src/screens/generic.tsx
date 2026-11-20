import React from 'react';
import {ActivityIndicator} from 'react-native';
import {useDetail, useList} from '../data';
import type {Detail, ListKey} from '../data';
import {open} from '../nav';
import type {Target} from '../nav';
import {Button, Card, Empty, KeyValue, Notice, Page, Row} from '../ui';
import {colors as c} from '../theme';
import {formatDate} from '../features/parcels/format';

export function ListScreen({listKey, title, lead, empty, itemTarget, action}: {
  listKey: ListKey; title: string; lead: string; empty: string;
  itemTarget?: (id: string) => Target; action?: {label: string; target: Target};
}) {
  const {items, loading, error, configured} = useList(listKey);
  return (
    <Page title={title} lead={lead}>
      {action && <Button label={action.label} onPress={() => open(action.target)} />}
      {!configured && <Notice tone="warning">Service non configuré : la liste sera disponible après intégration du Core API.</Notice>}
      {loading && <ActivityIndicator color={c.blue} style={{margin: 24}} />}
      {!!error && <Notice tone="error">{error}</Notice>}
      {configured && !loading && !error && items.length === 0 && <Empty>{empty}</Empty>}
      {items.map(item => (
        <Row key={item.id} title={item.title} subtitle={[item.subtitle, item.date && `Actualisé : ${formatDate(item.date)}`].filter(Boolean).join(' · ') || undefined}
          meta={item.status} onPress={itemTarget ? () => open(itemTarget(item.id)) : undefined} />
      ))}
    </Page>
  );
}

export function DetailScreen({listKey, id, title, lead, children}: {
  listKey: ListKey; id?: string; title: string; lead?: string; children?: React.ReactNode | ((detail: Detail | null) => React.ReactNode);
}) {
  const {detail, loading, error, configured} = useDetail(listKey, id);
  const item = id && detail?.id === id ? detail : null;
  return (
    <Page title={title} lead={lead}>
      {!id && <Notice tone="warning">Aucun élément sélectionné. Ouvrez cet écran depuis la liste correspondante.</Notice>}
      {!!id && !configured && <Notice tone="warning">Service non configuré : le détail sera fourni par le Core API.</Notice>}
      {loading && <ActivityIndicator color={c.blue} style={{margin: 24}} />}
      {!!error && <Notice tone="error">{error}</Notice>}
      {id && configured && !loading && !error && !item && <Empty>Aucun détail disponible ou élément inaccessible.</Empty>}
      {item && (
        <Card>
          <Row title={item.title} subtitle={item.subtitle} meta={item.status} />
          {item.fields.map((field, index) => <KeyValue key={`${field.label}-${index}`} label={field.label} value={field.value} />)}
        </Card>
      )}
      {typeof children === 'function' ? children(item) : children}
    </Page>
  );
}
