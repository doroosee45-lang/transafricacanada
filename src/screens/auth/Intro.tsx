import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {Body, Button, Page} from '../../ui';
import {colors as c} from '../../theme';
import {FadeIn, Logo} from './Anim';

const slides = [
  {title: 'Suivez vos colis', text: 'Consultez les étapes confirmées de vos colis, expéditions et vols, avec une distinction claire entre chaque type de suivi.'},
  {title: 'Demandez et payez', text: 'Créez une demande, consultez le devis officiel et suivez le statut de votre paiement, confirmé par le service.'},
  {title: 'Opérations terrain', text: 'Les parcours de scan, réception, transfert et livraison nécessitent les services et autorisations à intégrer.'},
];

export function Intro(_: {params: Params}) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const last = index === slides.length - 1;
  return (
    <Page>
      <View style={s.slide}>
        <Logo />
        {/* key relance l'animation à chaque diapositive */}
        <FadeIn key={index}>
          <Text accessibilityRole="header" style={s.title}>{slide.title}</Text>
          <Body>{slide.text}</Body>
        </FadeIn>
        <View style={s.dots}>{slides.map((_, i) => <View key={i} style={[s.dot, i === index && s.dotOn]} />)}</View>
      </View>
      <Button label={last ? 'Commencer' : 'Suivant'} onPress={() => (last ? go('language') : setIndex(index + 1))} />
      {!last && <Button variant="outline" label="Passer" onPress={() => go('language')} />}
    </Page>
  );
}

const s = StyleSheet.create({
  slide: {alignItems: 'center', paddingVertical: 40},
  title: {fontSize: 28, fontWeight: '800', color: c.ink, marginTop: 26, textAlign: 'center'},
  dots: {flexDirection: 'row', gap: 8, marginTop: 26},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: c.border},
  dotOn: {width: 24, backgroundColor: c.blue},
});
