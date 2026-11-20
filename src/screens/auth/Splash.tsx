import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {goReplace} from '../../nav';
import type {Params} from '../../nav';
import {colors as c} from '../../theme';
import {FadeIn, Logo} from './Anim';

export function Splash(_: {params: Params}) {
  useEffect(() => {
    const timer = setTimeout(() => goReplace('intro'), 2200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Continuer" style={s.splash} onPress={() => goReplace('intro')}>
      <Logo />
      <FadeIn delay={350}><Text style={s.brand}>TRANS AFRIQUE CANADA</Text></FadeIn>
      <FadeIn delay={700}><Text style={s.hint}>Chargement…</Text></FadeIn>
    </Pressable>
  );
}

const s = StyleSheet.create({
  splash: {flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 24},
  brand: {color: c.navy, fontWeight: '800', letterSpacing: 1.5, marginTop: 22},
  hint: {color: c.mutedSoft, marginTop: 10},
});
