import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Dimensions, Easing, Pressable} from 'react-native';
import type {PressableProps, StyleProp, ViewStyle} from 'react-native';

/** Animations reprises du WEB (reveal, hover, float, zoom-slow), pilotées par le moteur natif et compatibles Expo Go. */

let lastReducedMotion: boolean | undefined;
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => lastReducedMotion ?? true);
  useEffect(() => {
    let alive = true;
    let changed = false;
    const update = (value: boolean) => { if (alive) { lastReducedMotion = value; setReduced(value); } };
    AccessibilityInfo.isReduceMotionEnabled().then(v => { if (!changed) update(v); }).catch(error => {
      console.warn('Impossible de lire la préférence de réduction des animations.', error);
      if (!changed) update(true);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', value => { changed = true; update(value); });
    return () => { alive = false; sub.remove(); };
  }, []);
  return reduced;
}

type Watcher = {check: () => void};
type ScrollApi = {register: (w: Watcher) => () => void};
export const ScrollContext = createContext<ScrollApi | null>(null);

/** Registre de Reveal : le conteneur de défilement appelle `notify` (limité) à chaque scroll. */
export function useScrollRegistry() {
  const [watchers] = useState(() => new Set<Watcher>());
  const [api] = useState<ScrollApi>(() => ({register: w => { watchers.add(w); return () => { watchers.delete(w); }; }}));
  const last = useRef(0);
  const notify = useCallback((force = false) => {
    const now = Date.now();
    if (!force && now - last.current < 90) return;
    last.current = now;
    watchers.forEach(w => w.check());
  }, [watchers]);
  return {api, notify};
}

type RevealKind = 'up' | 'left' | 'right' | 'scale' | 'fade';
type Measurable = {measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void};

/** Équivalent de `.reveal` du WEB : apparition une seule fois quand l'élément entre dans l'écran. */
export function Reveal({children, kind = 'up', delay = 0, style}: {children: React.ReactNode; kind?: RevealKind; delay?: number; style?: StyleProp<ViewStyle>}) {
  const scroll = useContext(ScrollContext);
  const reduced = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const [node, setNode] = useState<Measurable | null>(null);
  const done = useRef(false);

  const reveal = useCallback(() => {
    if (done.current) return;
    done.current = true;
    Animated.timing(progress, {toValue: 1, duration: reduced ? 0 : 650, delay: reduced ? 0 : delay, easing: Easing.out(Easing.cubic), useNativeDriver: true}).start();
  }, [progress, delay, reduced]);

  useEffect(() => {
    if (!node) return;
    if (!scroll) { const t = setTimeout(reveal, 0); return () => clearTimeout(t); }
    const watcher: Watcher = {
      check: () => node.measureInWindow((_x, y, _w, h) => {
        if (h === 0 && y === 0) return;
        if (y < Dimensions.get('window').height * 0.94) reveal();
      }),
    };
    const off = scroll.register(watcher);
    const first = setTimeout(watcher.check, 60);
    return () => { clearTimeout(first); off(); };
  }, [node, scroll, reveal]);

  const translate = kind === 'up' ? {translateY: progress.interpolate({inputRange: [0, 1], outputRange: [36, 0]})}
    : kind === 'left' ? {translateX: progress.interpolate({inputRange: [0, 1], outputRange: [-36, 0]})}
    : kind === 'right' ? {translateX: progress.interpolate({inputRange: [0, 1], outputRange: [36, 0]})}
    : kind === 'scale' ? {scale: progress.interpolate({inputRange: [0, 1], outputRange: [0.92, 1]})}
    : {translateY: 0};

  return <Animated.View ref={setNode as never} collapsable={false} style={[style, {opacity: progress, transform: [translate]}]}>{children}</Animated.View>;
}

/** Bouton / carte : réduction au toucher (échelle ressort), équivalent du hover du WEB. */
export function PressableScale({children, style, to = 0.97, lift = false, ...rest}: PressableProps & {style?: StyleProp<ViewStyle>; to?: number; lift?: boolean}) {
  const [v] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  const animate = (value: number) => {
    if (reduced) { v.setValue(0); return; }
    Animated.spring(v, {toValue: value, useNativeDriver: true, speed: 30, bounciness: 6}).start();
  };
  return (
    <Pressable {...rest} onPressIn={e => { animate(1); rest.onPressIn?.(e); }} onPressOut={e => { animate(0); rest.onPressOut?.(e); }}>
      <Animated.View style={[style, {transform: [{scale: v.interpolate({inputRange: [0, 1], outputRange: [1, to]})}, {translateY: lift ? v.interpolate({inputRange: [0, 1], outputRange: [0, -4]}) : 0}]}]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
}

/** Animation `float` du WEB (-7px, 3 s, aller-retour). */
export function Float({children, style, distance = 7}: {children: React.ReactNode; style?: StyleProp<ViewStyle>; distance?: number}) {
  const reduced = useReducedMotion();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(v, {toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(v, {toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ]));
    loop.start();
    return () => loop.stop();
  }, [reduced, v]);
  return <Animated.View style={[style, {transform: [{translateY: v.interpolate({inputRange: [0, 1], outputRange: [0, -distance]})}]}]}>{children}</Animated.View>;
}

/** Animation `zoom-slow` du WEB (1 → 1,06 sur 12 s) pour les images de fond. */
export function useZoomSlow() {
  const reduced = useReducedMotion();
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(v, {toValue: 1, duration: 12000, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
      Animated.timing(v, {toValue: 0, duration: 12000, easing: Easing.inOut(Easing.quad), useNativeDriver: true}),
    ]));
    loop.start();
    return () => loop.stop();
  }, [reduced, v]);
  return v.interpolate({inputRange: [0, 1], outputRange: [1, 1.08]});
}

/** Entrée de page : fondu + glissement léger, déclenchée au montage. */
export function PageEnter({children, style}: {children: React.ReactNode; style?: StyleProp<ViewStyle>}) {
  const [v] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  useEffect(() => {
    const animation = Animated.timing(v, {toValue: 1, duration: reduced ? 0 : 420, easing: Easing.out(Easing.cubic), useNativeDriver: true});
    animation.start();
    return () => animation.stop();
  }, [v, reduced]);
  return <Animated.View style={[{flex: 1}, style, {opacity: v, transform: [{translateY: v.interpolate({inputRange: [0, 1], outputRange: [14, 0]})}]}]}>{children}</Animated.View>;
}
