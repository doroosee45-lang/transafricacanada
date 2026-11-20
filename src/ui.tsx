import React, {useRef, useState} from 'react';
import {ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import type {NativeScrollEvent, NativeSyntheticEvent, TextInputProps} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors as c, radius, shadow} from './theme';
import {brand} from './brand';
import {PageEnter, PressableScale, Reveal, ScrollContext, useReducedMotion, useScrollRegistry} from './motion';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function Icon({name, size = 20, color = c.accent}: {name: IconName; size?: number; color?: string}) {
  return <Ionicons name={name} size={size} color={color} />;
}

/** Page standard : entrée animée, apparition au défilement (Reveal) et bouton de retour en haut comme sur le WEB. */
export function Page({title, lead, children, footer, header, nav, center, watermark}: {title?: string; lead?: string; children?: React.ReactNode; footer?: React.ReactNode; header?: React.ReactNode; nav?: React.ReactNode; center?: boolean; watermark?: boolean}) {
  const {api, notify} = useScrollRegistry();
  const reduced = useReducedMotion();
  const scrollRef = useRef<{scrollTo: (o: {y: number; animated: boolean}) => void} | null>(null);
  const [showTop, setShowTop] = useState(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    notify();
    const past = e.nativeEvent.contentOffset.y > 400;
    setShowTop(prev => (prev === past ? prev : past));
  };
  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollContext.Provider value={api}>
        {watermark && <View pointerEvents="none" style={s.mark}><Image accessible={false} source={brand.logo} style={s.markImage} resizeMode="contain" /></View>}
        {nav}
        <PageEnter>
          <ScrollView ref={scrollRef as never} keyboardShouldPersistTaps="handled" scrollEventThrottle={16} onScroll={onScroll} onMomentumScrollEnd={() => notify(true)}
            contentContainerStyle={[header ? s.contentFlush : undefined, center ? s.centered : undefined]}>
            {header}
            <View style={s.content}>
              {!!title && <Reveal kind="fade"><Text accessibilityRole="header" style={s.title}>{title}</Text></Reveal>}
              {!!lead && <Reveal kind="fade" delay={80}><Text style={s.lead}>{lead}</Text></Reveal>}
              {children}
            </View>
            {footer}
          </ScrollView>
        </PageEnter>
        {showTop && (
          <PressableScale accessibilityRole="button" accessibilityLabel="Retour en haut" onPress={() => scrollRef.current?.scrollTo({y: 0, animated: !reduced})} style={s.top}>
            <Icon name="chevron-up" size={22} color="white" />
          </PressableScale>
        )}
      </ScrollContext.Provider>
    </KeyboardAvoidingView>
  );
}

export function Section({children}: {children: string}) {
  return <Text style={s.section}>{children}</Text>;
}

export function Body({children}: {children: React.ReactNode}) {
  return <Text style={s.body}>{children}</Text>;
}

export function Card({children}: {children: React.ReactNode}) {
  return <Reveal style={s.card}>{children}</Reveal>;
}

const toneIcon = {info: 'information-circle', warning: 'warning', error: 'alert-circle', success: 'checkmark-circle'} as const;
const toneColor = {info: c.accent, warning: c.amber, error: c.rose, success: c.green} as const;

export function Notice({children, tone = 'info'}: {children: React.ReactNode; tone?: 'info' | 'warning' | 'error' | 'success'}) {
  return (
    <Reveal kind="fade">
      <View style={[s.notice, tone === 'warning' && s.noticeWarning, tone === 'error' && s.noticeError, tone === 'success' && s.noticeSuccess]}>
        <Icon name={toneIcon[tone]} size={20} color={toneColor[tone]} />
        <Text accessibilityRole={tone === 'error' ? 'alert' : undefined} style={s.noticeText}>{children}</Text>
      </View>
    </Reveal>
  );
}

export function Empty({children}: {children: string}) {
  return <Text style={s.empty}>{children}</Text>;
}

export function Button({label, onPress, variant = 'primary', disabled, busy}: {label: string; onPress: () => void; variant?: 'primary' | 'outline' | 'danger'; disabled?: boolean; busy?: boolean}) {
  const off = disabled || busy;
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled: !!off}} disabled={off} onPress={onPress}
      style={[s.button, variant === 'primary' && shadow.gold, variant === 'outline' && s.buttonOutline, variant === 'danger' && s.buttonDanger, off && s.disabled]}>
      {busy ? <ActivityIndicator color={variant === 'outline' ? c.accent : 'white'} /> :
        <Text style={[s.buttonText, variant === 'outline' && s.buttonOutlineText]}>{label}</Text>}
    </PressableScale>
  );
}

export function Field({label, error, ...input}: {label: string; error?: string} & TextInputProps) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholderTextColor={c.muted} style={[s.input, input.multiline && s.multiline, !!error && s.inputError]} {...input} />
      {!!error && <Text accessibilityRole="alert" style={s.fieldError}>{error}</Text>}
    </View>
  );
}

export function Choices<T extends string>({label, value, options, onChange}: {label: string; value: T | ''; options: {value: T; label: string}[]; onChange: (value: T) => void}) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <View style={s.chips}>
        {options.map(option => (
          <Pressable key={option.value} accessibilityRole="radio" accessibilityState={{selected: option.value === value}} onPress={() => onChange(option.value)}
            style={[s.chip, option.value === value && s.chipOn]}>
            <Text style={[s.chipText, option.value === value && s.chipTextOn]}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function Row({title, subtitle, meta, onPress}: {title: string; subtitle?: string; meta?: string; onPress?: () => void}) {
  const content = (
    <>
      <View style={{flex: 1}}>
        <Text style={s.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={s.small}>{subtitle}</Text>}
        {!!meta && <Text style={s.badge}>{meta}</Text>}
      </View>
      {!!onPress && <Icon name="chevron-forward" size={20} color={c.mutedSoft} />}
    </>
  );
  return onPress ?
    <Reveal kind="right"><PressableScale accessibilityRole="button" accessibilityLabel={title} onPress={onPress} to={0.985} style={s.row}>{content}</PressableScale></Reveal> :
    <Reveal kind="right"><View style={s.row}>{content}</View></Reveal>;
}

export function Tiles({items}: {items: {label: string; hint?: string; icon?: IconName; onPress: () => void}[]}) {
  return (
    <View style={s.tiles}>
      {items.map((item, i) => (
        <Reveal key={item.label} kind="up" delay={(i % 2) * 90} style={s.tileWrap}>
          <PressableScale accessibilityRole="button" accessibilityLabel={item.label} onPress={item.onPress} lift to={0.98} style={s.tile}>
            <View style={s.tileIcon}><Icon name={item.icon ?? 'apps-outline'} size={20} /></View>
            <Text style={s.tileTitle}>{item.label}</Text>
            {!!item.hint && <Text style={s.small}>{item.hint}</Text>}
          </PressableScale>
        </Reveal>
      ))}
    </View>
  );
}

export function KeyValue({label, value}: {label: string; value: string}) {
  return (
    <View style={{marginTop: 12}}>
      <Text style={s.small}>{label}</Text>
      <Text style={s.body}>{value}</Text>
    </View>
  );
}

export const ui = {colors: c};

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: c.background},
  content: {padding: 22, paddingBottom: 48, maxWidth: 700, width: '100%', alignSelf: 'center'},
  contentFlush: {paddingBottom: 0},
  mark: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'},
  markImage: {width: '88%', maxWidth: 520, aspectRatio: 900 / 589, opacity: 0.1},
  centered: {flexGrow: 1, justifyContent: 'center'},
  title: {fontSize: 28, lineHeight: 35, fontWeight: '800', color: c.ink},
  lead: {color: c.muted, lineHeight: 23, marginTop: 8, fontSize: 15},
  section: {fontSize: 17, fontWeight: '800', color: c.ink, marginTop: 28, marginBottom: 10},
  body: {color: c.muted, lineHeight: 23, marginTop: 6, fontSize: 15},
  small: {color: c.muted, fontSize: 12, lineHeight: 18, marginTop: 3},
  card: {backgroundColor: c.white, borderColor: c.border, borderWidth: 1.5, borderRadius: radius.lg, padding: 18, marginTop: 18, ...shadow.card},
  notice: {flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: c.cream, borderColor: c.goldSoft, borderWidth: 1, borderRadius: radius.md, padding: 14, marginTop: 18},
  noticeWarning: {backgroundColor: '#FFF3DD', borderColor: '#F5D9A0'},
  noticeError: {backgroundColor: '#FDEBEB', borderColor: '#F6C3C3'},
  noticeSuccess: {backgroundColor: '#E5F6EE', borderColor: '#B7E4CF'},
  noticeText: {flex: 1, color: c.ink, lineHeight: 20, fontSize: 13},
  empty: {color: c.muted, lineHeight: 22, marginVertical: 26, textAlign: 'center'},
  button: {backgroundColor: c.accent, borderRadius: radius.md, minHeight: 52, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', marginTop: 18},
  buttonOutline: {backgroundColor: 'transparent', borderColor: c.accent, borderWidth: 1.5},
  buttonDanger: {backgroundColor: c.rose},
  buttonText: {color: 'white', fontWeight: '800', fontSize: 15},
  buttonOutlineText: {color: c.accentDark},
  disabled: {opacity: 0.5},
  label: {color: c.ink, fontWeight: '700', marginTop: 16, marginBottom: 8},
  input: {backgroundColor: c.white, borderColor: c.border, borderWidth: 1.5, borderRadius: radius.md, padding: 12, minHeight: 50, color: c.ink},
  inputError: {borderColor: c.rose},
  multiline: {minHeight: 110, textAlignVertical: 'top'},
  fieldError: {color: c.rose, marginTop: 6, fontSize: 12},
  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {borderColor: c.border, borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: c.white},
  chipOn: {backgroundColor: c.accent, borderColor: c.accent},
  chipText: {color: c.ink, fontWeight: '600'},
  chipTextOn: {color: 'white'},
  row: {flexDirection: 'row', alignItems: 'center', backgroundColor: c.white, borderColor: c.border, borderWidth: 1.5, borderRadius: radius.md, padding: 14, marginTop: 10, ...shadow.card},
  rowTitle: {color: c.ink, fontWeight: '800'},
  badge: {color: c.accentDark, fontWeight: '700', fontSize: 12, marginTop: 6},
  tiles: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10, marginTop: 16},
  tileWrap: {width: '48.5%'},
  tile: {minHeight: 120, backgroundColor: c.white, borderColor: c.border, borderWidth: 1.5, borderRadius: radius.lg, padding: 14, ...shadow.card},
  tileIcon: {width: 40, height: 40, borderRadius: 12, backgroundColor: c.cream, alignItems: 'center', justifyContent: 'center'},
  tileTitle: {color: c.ink, fontWeight: '700', marginTop: 10},
  top: {position: 'absolute', right: 18, bottom: 24, width: 46, height: 46, borderRadius: 23, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', ...shadow.gold},
});

