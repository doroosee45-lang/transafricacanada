import React, {useCallback, useRef, useState} from 'react';
import {AppState, Image, Linking, PanResponder, Text, View} from 'react-native';
import {CameraView, useCameraPermissions} from 'expo-camera';
import {useFocusEffect} from 'expo-router';
import {ports, useAction} from '../../data';
import type {Point} from '../../data';
import type {Params} from '../../nav';
import {Button, Field, Notice, Page} from '../../ui';
import {colors as c} from '../../theme';


type Props = {params: Params};
type Setter = React.Dispatch<React.SetStateAction<Point[][]>>;

export function Proof({params}: Props) {
  const [recipient, setRecipient] = useState('');
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [photo, setPhoto] = useState('');
  const [shooting, setShooting] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const focused = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const action = useAction(ports.submitProof);

  useFocusEffect(useCallback(() => {
    focused.current = true;
    setAppActive(AppState.currentState === 'active');
    const listener = AppState.addEventListener('change', state => {
      setAppActive(state === 'active');
      if (state !== 'active') setShooting(false);
    });
    return () => { focused.current = false; listener.remove(); setShooting(false); };
  }, []));

  async function snap() {
    try {
      const picture = await camera.current?.takePictureAsync({quality: 0.6});
      if (picture?.uri) { setPhoto(picture.uri); action.clear(); setShooting(false); }
      else setCameraError('La photo n’a pas pu être prise. Réessayez.');
    } catch {
      setCameraError('La photo n’a pas pu être prise. Réessayez.');
    }
  }
  const ready = !!params.id && !!recipient.trim() && strokes.length > 0 && !!photo;
  return (
    <Page title="Preuve de livraison" lead="Signature, photo et confirmation sont envoyées ensemble au service.">
      {!params.id && <Notice tone="warning">Ouvrez cet écran depuis une livraison.</Notice>}
      <Field label="Nom de la personne qui reçoit" value={recipient} onChangeText={value => {setRecipient(value); action.clear();}} autoCapitalize="words" />
      <Text style={{color: c.ink, fontWeight: '700', marginTop: 16, marginBottom: 8}}>Signature</Text>
      <SignaturePad strokes={strokes} onChange={value => {setStrokes(value); action.clear();}} />
      <Button variant="outline" label="Effacer la signature" onPress={() => {setStrokes([]); action.clear();}} disabled={strokes.length === 0} />
      <Text style={{color: c.ink, fontWeight: '700', marginTop: 22}}>Photo</Text>
      {!!photo && <Image accessibilityLabel="Photo de livraison" source={{uri: photo}} style={{height: 200, borderRadius: 12, marginTop: 10}} />}
      {shooting && permission?.granted && appActive && (
        <View style={{height: 300, marginTop: 10, borderRadius: 12, overflow: 'hidden'}}>
          <CameraView ref={camera} style={{flex: 1}} facing="back" onMountError={() => { setCameraError('La caméra n’a pas pu démarrer.'); setShooting(false); }} />
        </View>
      )}
      {!!cameraError && <Notice tone="error">{cameraError}</Notice>}
      {shooting && permission?.granted ? <Button label="Prendre la photo" onPress={() => void snap()} /> :
        permission && !permission.granted && !permission.canAskAgain ?
          <Button variant="outline" label="Autoriser la caméra dans les réglages" onPress={() => {
            void Linking.openSettings().catch(() => setCameraError('Impossible d’ouvrir les réglages de l’appareil.'));
          }} /> :
          <Button variant="outline" label={photo ? 'Refaire la photo' : 'Ouvrir la caméra'} onPress={async () => {
            setCameraError('');
            try {
              const granted = permission?.granted ? permission : await requestPermission();
              if (!focused.current) return;
              if (granted.granted) setShooting(true);
              else setCameraError('L’accès à la caméra est nécessaire pour la photo.');
            } catch {
              if (focused.current) setCameraError('Impossible de demander l’accès à la caméra. Réessayez.');
            }
          }} />}
      {!!action.error && <Notice tone="error">{action.error}</Notice>}
      {action.result !== null && <Notice tone="success">Preuve transmise.</Notice>}
      <Button label="Confirmer la livraison" busy={action.busy} disabled={!ready}
        onPress={() => void action.run({deliveryId: params.id as string, recipient: recipient.trim(), signature: strokes, photoUri: photo})} />
    </Page>
  );
}

function SignaturePad({strokes, onChange}: {strokes: Point[][]; onChange: Setter}) {
  const [responder] = useState(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: e => {
      const p = {x: e.nativeEvent.locationX, y: e.nativeEvent.locationY};
      onChange(all => [...all, [p]]);
    },
    onPanResponderMove: e => {
      const p = {x: e.nativeEvent.locationX, y: e.nativeEvent.locationY};
      onChange(all => {
        const last = all[all.length - 1];
        if (!last) return all;
        const prev = last[last.length - 1];
        if (Math.hypot(p.x - prev.x, p.y - prev.y) < 3) return all;
        return [...all.slice(0, -1), [...last, p]];
      });
    },
  }));
  return (
    <View accessibilityLabel="Zone de signature" {...responder.panHandlers}
      style={{height: 180, backgroundColor: 'white', borderColor: c.border, borderWidth: 1, borderRadius: 12, overflow: 'hidden'}}>
      {strokes.flat().map((p, i) => <View key={i} pointerEvents="none" style={{position: 'absolute', left: p.x - 2, top: p.y - 2, width: 4, height: 4, borderRadius: 2, backgroundColor: c.ink}} />)}
      {strokes.length === 0 && <Text pointerEvents="none" style={{color: c.muted, margin: 14}}>Signez ici</Text>}
    </View>
  );
}
