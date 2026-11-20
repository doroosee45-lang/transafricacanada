import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {router} from 'expo-router';
import type {Params} from '../../nav';
import {Body, Button, Page} from '../../ui';
import {colors as c} from '../../theme';
import {FadeIn, Logo} from './Anim';

export function Welcome(_: {params: Params}) {
  return (
    <Page>
      <View style={s.slide}>
        <Logo />
        <FadeIn delay={250}>
          <Text accessibilityRole="header" style={s.title}>Bienvenue</Text>
          <Body>Connectez-vous avec votre identité Trans Afrique ou créez un compte pour accéder à vos services.</Body>
        </FadeIn>
      </View>
      <FadeIn delay={500}>
        <Button label="Se connecter" onPress={() => router.push({pathname: '/auth', params: {mode: 'login'}})} />
        <Button variant="outline" label="Créer un compte" onPress={() => router.push({pathname: '/auth', params: {mode: 'register'}})} />
        <Button variant="outline" label="Explorer sans compte" onPress={() => router.replace('/')} />
      </FadeIn>
    </Page>
  );
}

const s = StyleSheet.create({
  slide: {alignItems: 'center', paddingVertical: 40},
  title: {fontSize: 28, fontWeight: '800', color: c.ink, marginTop: 26, textAlign: 'center'},
});
