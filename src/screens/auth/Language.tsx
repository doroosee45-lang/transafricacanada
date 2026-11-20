import React, {useState} from 'react';
import {go} from '../../nav';
import type {Params} from '../../nav';
import {StyleSheet, Text, View} from 'react-native';
import {FadeIn, Logo} from './Anim';
import {colors as c} from '../../theme';
import {Button, Choices, Field, Notice, Page} from '../../ui';

type Props = {params: Params};

export function Language({params}: Props) {
  const [language, setLanguage] = useState<'fr' | 'en'>(params.lang === 'en' ? 'en' : 'fr');
  const [country, setCountry] = useState(params.country ?? '');
  return (
    <Page center>
      <View style={s.logo}><Logo /></View>
      <FadeIn delay={250}>
        <Text accessibilityRole="header" style={s.title}>Langue et pays</Text>
        <Text style={s.lead}>Ces préférences serviront à adapter l’application à votre région.</Text>
      </FadeIn>
      <Choices label="Langue" value={language} onChange={setLanguage} options={[{value: 'fr', label: 'Français'}, {value: 'en', label: 'English'}]} />
      {language === 'en' && <Notice tone="warning">Les textes de l’application sont pour l’instant disponibles uniquement en français.</Notice>}
      <Field label="Pays" value={country} onChangeText={setCountry} placeholder="Votre pays de résidence" autoCapitalize="words" />
      <Button label="Continuer" onPress={() => go('welcome', {lang: language, country: country.trim()})} />
    </Page>
  );
}

const s = StyleSheet.create({
  logo: {alignItems: 'center', marginBottom: 12},
  title: {fontSize: 28, fontWeight: '800', color: c.ink, textAlign: 'center'},
  lead: {color: c.muted, lineHeight: 23, marginTop: 8, fontSize: 15, textAlign: 'center'},
});
