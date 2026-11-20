import React, {useEffect, useState} from 'react';
import {Animated, Easing, Image, StyleSheet} from 'react-native';
import {brand} from '../../brand';
import {useReducedMotion} from '../../motion';

/** Apparition progressive avec léger glissement vers le haut. */
export function FadeIn({children, delay = 0}: {children: React.ReactNode; delay?: number}) {
  const [value] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  useEffect(() => {
    const animation = Animated.timing(value, {toValue: 1, duration: reduced ? 0 : 600, delay: reduced ? 0 : delay, easing: Easing.out(Easing.cubic), useNativeDriver: true});
    animation.start();
    return () => animation.stop();
  }, [value, delay, reduced]);
  return (
    <Animated.View style={{opacity: value, transform: [{translateY: value.interpolate({inputRange: [0, 1], outputRange: [18, 0]})}]}}>
      {children}
    </Animated.View>
  );
}

/** Logo officiel : apparition en grossissant puis respiration douce. */
export function Logo() {
  const [pop] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { pop.setValue(1); pulse.setValue(0); return; }
    const entrance = Animated.spring(pop, {toValue: 1, friction: 5, tension: 70, useNativeDriver: true});
    entrance.start();
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, {toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
      Animated.timing(pulse, {toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
    ]));
    loop.start();
    return () => { entrance.stop(); loop.stop(); };
  }, [pop, pulse, reduced]);
  const scale = Animated.multiply(pop, pulse.interpolate({inputRange: [0, 1], outputRange: [1, 1.05]}));
  return (
    <Animated.View style={{opacity: pop, transform: [{scale}]}}>
      <Image accessibilityLabel="Trans Africa Canada" source={brand.logo} style={s.logo} resizeMode="contain" />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  logo: {width: 220, height: 144},
});
