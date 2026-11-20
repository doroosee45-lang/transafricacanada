import React from 'react';
import {Stack, useLocalSearchParams} from 'expo-router';
import {screens} from '../../src/screens';
import {Notice, Page} from '../../src/ui';

export default function ScreenRoute() {
  const raw = useLocalSearchParams();
  const params = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const Screen = typeof params.name === 'string' && Object.hasOwn(screens, params.name) ? screens[params.name] : undefined;
  return (
    <>
      <Stack.Screen options={{headerShown: params.name !== 'splash'}} />
      {Screen ? <Screen params={params} /> : <Page title="Écran introuvable"><Notice tone="warning">Cet écran n’existe pas.</Notice></Page>}
    </>
  );
}
