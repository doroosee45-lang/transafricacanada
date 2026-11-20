import React, {useEffect, useRef, useState} from 'react';
import {Animated, FlatList, Image, Linking, Pressable, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {router} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {brand} from './brand';
import {colors as c, radius, shadow} from './theme';
import {Float, PressableScale, Reveal, useReducedMotion, useZoomSlow} from './motion';
import {Icon} from './ui';
import type {IconName} from './ui';
import {go} from './nav';

export type NavLink = {label: string; icon: IconName; onPress: () => void};

export const publicLinks: NavLink[] = [
  {label: 'Accueil', icon: 'home-outline', onPress: () => router.navigate('/')},
  {label: 'À propos', icon: 'information-circle-outline', onPress: () => go('about')},
  {label: 'Solutions', icon: 'cube-outline', onPress: () => go('solutions')},
  {label: 'Connexion', icon: 'log-in-outline', onPress: () => router.push({pathname: '/auth', params: {mode: 'login'}})},
];

/** Barre de navigation : logo officiel, menu déroulant animé (comme le menu mobile du WEB). */
export function Navbar({safeTop = false}: {safeTop?: boolean}) {
  const inset = useSafeAreaInsets().top;
  const top = safeTop ? inset : 0;
  const [open, setOpen] = useState(false);
  const [v] = useState(() => new Animated.Value(0));
  const reduced = useReducedMotion();
  useEffect(() => {
    const animation = Animated.timing(v, {toValue: open ? 1 : 0, duration: reduced ? 0 : 240, useNativeDriver: true});
    animation.start();
    return () => animation.stop();
  }, [open, v, reduced]);
  return (
    <View style={[s.nav, {paddingTop: 12 + top}]}>
      <View style={s.navBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Accueil Trans Africa Canada" onPress={() => router.navigate('/')}>
          <Image source={brand.logo} style={s.navLogo} resizeMode="contain" />
        </Pressable>
        <PressableScale accessibilityRole="button" accessibilityLabel={open ? 'Fermer le menu' : 'Ouvrir le menu'} onPress={() => setOpen(o => !o)} style={s.burger}>
          <Icon name={open ? 'close' : 'menu'} size={24} color={c.ink} />
        </PressableScale>
      </View>
      {open && (
        <Animated.View style={[s.menu, {top: 78 + top, opacity: v, transform: [{translateY: v.interpolate({inputRange: [0, 1], outputRange: [-8, 0]})}]}]}>
          {publicLinks.map(l => (
            <Pressable key={l.label} accessibilityRole="button" onPress={() => { setOpen(false); l.onPress(); }} style={({pressed}) => [s.menuItem, pressed && {backgroundColor: c.cream}]}>
              <Icon name={l.icon} size={20} />
              <Text style={s.menuText}>{l.label}</Text>
            </Pressable>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

/** Section d'accueil : image en zoom lent, voile sombre, badge flottant et appels à l'action. */
export function Hero({eyebrow, title, accent, text, image = brand.images.entrepot, actions}: {eyebrow: string; title: string; accent?: string; text: string; image?: number; actions?: {label: string; onPress: () => void; outline?: boolean}[]}) {
  const zoom = useZoomSlow();
  return (
    <View style={s.hero}>
      <Animated.Image source={image} resizeMode="cover" style={[StyleSheet.absoluteFill, {transform: [{scale: zoom}]}]} />
      <View style={s.heroShade} />
      <View style={s.heroBody}>
        <Float><View style={s.badge}><Icon name="airplane" size={14} color={c.goldSoft} /><Text style={s.badgeText}>{eyebrow}</Text></View></Float>
        <Reveal kind="up" delay={80}><Text accessibilityRole="header" style={s.heroTitle}>{title}{accent ? <Text style={s.heroAccent}>{'\n' + accent}</Text> : null}</Text></Reveal>
        <Reveal kind="up" delay={180}><Text style={s.heroText}>{text}</Text></Reveal>
        {!!actions?.length && (
          <Reveal kind="up" delay={280} style={s.heroActions}>
            {actions.map(a => (
              <PressableScale key={a.label} accessibilityRole="button" accessibilityLabel={a.label} onPress={a.onPress} style={[s.cta, a.outline ? s.ctaOutline : shadow.gold, !a.outline && s.ctaFill]}>
                <Text style={[s.ctaText, a.outline && {color: 'white'}]}>{a.label}</Text>
              </PressableScale>
            ))}
          </Reveal>
        )}
      </View>
    </View>
  );
}

export type Slide = {image: number; title: string; text: string};

/** Carrousel paginé avec lecture automatique, points de navigation et zoom d'image. */
export function Carousel({slides, interval = 4500}: {slides: Slide[]; interval?: number}) {
  const {width} = useWindowDimensions();
  const size = Math.min(width, 700) - 44;
  const [index, setIndex] = useState(0);
  const listRef = useRef<{scrollToIndex: (o: {index: number; animated: boolean}) => void} | null>(null);
  const indexRef = useRef(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || paused || slides.length < 2) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      listRef.current?.scrollToIndex({index: next, animated: true});
    }, interval);
    return () => clearInterval(timer);
  }, [paused, slides.length, interval, reduced]);
  return (
    <View>
      <FlatList
        ref={listRef as never}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.title}
        snapToInterval={size + 12}
        decelerationRate="fast"
        getItemLayout={(_, i) => ({length: size + 12, offset: (size + 12) * i, index: i})}
        onScrollBeginDrag={() => setPaused(true)}
        onScrollEndDrag={() => setPaused(false)}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / (size + 12));
          indexRef.current = i;
          setIndex(i);
        }}
        renderItem={({item}) => (
          <View style={[s.slide, {width: size}]}>
            <Image source={item.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={s.slideShade} />
            <View style={s.slideText}>
              <Text style={s.slideTitle}>{item.title}</Text>
              <Text style={s.slideBody}>{item.text}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{width: 12}} />}
      />
      <View style={s.dots}>
        {slides.map((slide, i) => <View key={slide.title} style={[s.dot, i === index && s.dotOn]} />)}
      </View>
    </View>
  );
}

/** Pied de page : navigation, coordonnées (si renseignées) et mention légale. */

/** Footer professionnel - Trans Africa Canada */
export function Footer() {
  const { email, phone, address, website } = brand.contact;

  const contacts: {
    icon: IconName;
    text: string;
    url?: string;
  }[] = [
    ...(email ? [{
      icon: 'mail-outline' as const,
      text: email,
      url: `mailto:${email}`,
    }] : []),
    ...(phone ? [{
      icon: 'call-outline' as const,
      text: phone,
      url: `tel:${phone}`,
    }] : []),
    ...(address ? [{
      icon: 'location-outline' as const,
      text: address,
    }] : []),
    ...(website ? [{
      icon: 'globe-outline' as const,
      text: website,
      url: website,
    }] : []),
  ];


  return (
    <View style={s.footer}>
      <View style={s.footerTop}>
        {/* Identité de l'entreprise */}
        <View style={s.footerBrand}>
          <Image source={brand.logo} style={s.footerLogo} resizeMode="contain" />
          <Text style={s.footerTag}>{brand.tagline}</Text>
          <View style={s.footerAccent} />
        </View>

        {/* Navigation */}
        <View style={s.footerColumn}>
          <Text style={s.footerHead}>NAVIGATION</Text>
          {publicLinks.map(link => (
            <Pressable
              key={link.label}
              accessibilityRole="link"
              onPress={link.onPress}
              hitSlop={8}
              style={s.footerNavItem}
            >
              <Icon name="chevron-forward" size={15} color={c.accent} />
              <Text style={s.footerLink}>{link.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Coordonnées */}
        {contacts.length > 0 && (
          <View style={s.footerColumn}>
            <Text style={s.footerHead}>CONTACTEZ-NOUS</Text>
            {contacts.map(item => (
              <Pressable
                key={item.text}
                accessibilityRole={item.url ? 'link' : undefined}
                disabled={!item.url}
                onPress={() => {
                  if (item.url) void Linking.openURL(item.url);
                }}
                style={s.footerContact}
              >
                <View style={s.footerIcon}>
                  <Icon name={item.icon} size={17} color={c.accentDark} />
                </View>
                <Text style={s.footerLink}>{item.text}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Mentions légales */}
      <View style={s.footerBottom}>
        <Text style={s.copy}>
          © {new Date().getFullYear()} {brand.name}. Tous droits réservés.
        </Text>
        <View style={s.footerBrandMark}>
          <View style={s.footerBlueDot} />
          <Text style={s.footerBrandText}>Trans Africa Canada</Text>
        </View>
      </View>
    </View>
  );
}


const s = StyleSheet.create({
  nav: {paddingHorizontal: 12, paddingTop: 12, zIndex: 20, backgroundColor: c.background},
  navBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.96)', borderColor: c.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, height: 62, ...shadow.card},
  navLogo: {width: 96, height: 46},
  burger: {width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  menu: {position: 'absolute', top: 78, left: 12, right: 12, backgroundColor: c.white, borderColor: c.border, borderWidth: 1, borderRadius: 18, marginTop: 8, padding: 6, ...shadow.lift},
  menuItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, minHeight: 48, borderRadius: 12},
  menuText: {color: c.ink, fontWeight: '700', fontSize: 15},
  hero: {minHeight: 440, marginTop: 10, marginHorizontal: 12, borderRadius: radius.xl, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: c.ink},
  heroShade: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)'},
  heroBody: {padding: 22, paddingBottom: 56, gap: 12},
  badge: {alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(240,219,179,0.5)', borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6},
  badgeText: {color: c.goldSoft, fontSize: 11, fontWeight: '800', letterSpacing: 1.2},
  heroTitle: {color: 'white', fontSize: 32, lineHeight: 39, fontWeight: '800'},
  heroAccent: {color: c.goldSoft},
  heroText: {color: 'rgba(255,255,255,0.88)', fontSize: 15, lineHeight: 23},
  heroActions: {flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4},
  cta: {minHeight: 48, paddingHorizontal: 20, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  ctaFill: {backgroundColor: c.accent},
  ctaOutline: {borderColor: 'rgba(255,255,255,0.7)', borderWidth: 1.5},
  ctaText: {color: 'white', fontWeight: '800', fontSize: 14},
  slide: {height: 220, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: c.ink, justifyContent: 'flex-end'},
  slideShade: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.38)'},
  slideText: {padding: 16, gap: 4},
  slideTitle: {color: 'white', fontSize: 18, fontWeight: '800'},
  slideBody: {color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 19},
  dots: {flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: c.border},
  dotOn: {width: 24, backgroundColor: c.accent},

  // Footer professionnel - Trans Africa Canada
  footer: {
    backgroundColor: '#F3F8FC',
    borderTopColor: '#DCEAF5',
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 24,
    marginTop: 40,
    gap: 28,
  },
  footerTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 28,
    rowGap: 24,
  },
  footerBrand: {
    flexGrow: 1,
    flexBasis: 220,
    gap: 10,
    marginBottom: 4,
  },
  footerLogo: {
    width: 155,
    height: 76,
    alignSelf: 'flex-start',
  },
  footerTag: {
    color: '#596579',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 340,
  },
  footerAccent: {
    width: 46,
    height: 3,
    backgroundColor: '#39A4E2',
    borderRadius: 3,
    marginTop: 5,
  },
  footerColumn: {
    flexGrow: 1,
    flexBasis: 180,
    gap: 13,
  },
  footerHead: {
    color: '#2D378F',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 5,
  },
  footerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: 28,
  },
  footerLink: {
    color: '#39465B',
    fontSize: 13,
    lineHeight: 20,
    flexShrink: 1,
  },
  footerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 32,
  },
  footerIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#DDF1FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBottom: {
    borderTopColor: '#DCEAF5',
    borderTopWidth: 1,
    paddingTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    color: '#7B8798',
    fontSize: 11,
    lineHeight: 18,
  },
  footerBrandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  footerBlueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#39A4E2',
  },
  footerBrandText: {
    color: '#2D378F',
    fontSize: 11,
    fontWeight: '700',
  },
});
