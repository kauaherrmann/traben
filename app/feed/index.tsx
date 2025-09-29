import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/src/features/comuns/Header';
import CardpostCorrida, { PostRun } from '@/src/features/feed/CardpostCorrida';
import { FOOTER_HEIGHT } from '@/src/features/comuns/Footer';
import { BlurView } from 'expo-blur';

const foto1 = require('@/assets/images/correndo.jpg');
const foto2 = require('@/assets/images/correndo.jpg');
const foto3 = require('@/assets/images/correndo.jpg');

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState('');
  const [searchActive, setSearchActive] = React.useState(false);

  const posts: PostRun[] = [
    {
      id: '1',
      user: { username: '@kauaherrmann' },
      type: 'treino',
      distanceKm: 10.2,
      durationSec: 52 * 60 + 10,
      paceSec: 307,
      elevationGain: 120,
      startedAt: new Date().toISOString(),
      improvementPct: 4.5,
      caption: 'Foco no ritmo constante. Clima perfeito hoje!',
      likes: 12,
      comments: 3,
      youLiked: true,
      photoSource: foto1,
    },
    {
      id: '2',
      user: { username: '@runner' },
      type: 'prova',
      distanceKm: 21.1,
      durationSec: 1 * 3600 + 39 * 60 + 12,
      paceSec: 282,
      elevationGain: 180,
      startedAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
      improvementPct: -1.2,
      caption: 'Metade da prova com vento forte, mas finalizei bem.',
      likes: 45,
      comments: 9,
      photoSource: foto2,
    },
    {
      id: '3',
      user: { username: '@treiner' },
      type: 'intervalado',
      distanceKm: 6.4,
      durationSec: 32 * 60,
      paceSec: 300,
      elevationGain: 40,
      startedAt: new Date(Date.now() - 3600 * 48 * 1000).toISOString(),
      improvementPct: 2.1,
      caption: 'Série de tiros progressivos. Sensação boa nas pernas.',
      likes: 8,
      comments: 1,
      photoSource: foto3,
    },
    {
      id: '4',
      user: { username: '@novo' },
      type: 'longão',
      distanceKm: 18.6,
      durationSec: 1 * 3600 + 28 * 60,
      paceSec: 305,
      elevationGain: 190,
      startedAt: new Date(Date.now() - 3600 * 72 * 1000).toISOString(),
      improvementPct: 1.1,
      caption: 'Longão curtindo a paisagem.',
      likes: 3,
      comments: 0,
      photoSource: foto3,
    },
  ];

  // Animated scroll
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const opacity = scrollY.interpolate({
    inputRange: [0, 20, 70],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  const HEADER_BODY_HEIGHT = 44 + 8;
  const contentOffsetTop = insets.top + 3 + HEADER_BODY_HEIGHT;
  const bottomPad = FOOTER_HEIGHT + insets.bottom + 16;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header + blur animado */}
      <View style={styles.headerWrap}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { opacity, backgroundColor: 'rgba(7,7,5,0.45)' },
            ]}
          />
          <Animated.View
            style={[
              styles.divider,
              { opacity },
            ]}
          />
        </View>

        <Header
          title="Feed"
            showTitle
          showMenu={false}
          showNotifications
          notificationsBadgeCount={2}
          showSearchIcon
          searchActive={searchActive}
          onChangeSearchActive={setSearchActive}
          searchValue={query}
          onChangeSearch={setQuery}
          onSubmitSearch={() => console.log('Buscar:', query)}
        />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: contentOffsetTop + 12,
          paddingBottom: bottomPad,
          gap: 18,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {posts
          .filter(p =>
            !query ||
            p.caption?.toLowerCase().includes(query.toLowerCase()) ||
            p.user.username.toLowerCase().includes(query.toLowerCase())
          )
          .map(p => (
            <CardpostCorrida
              key={p.id}
              post={p}
              containerStyle={{ marginHorizontal: 14 }}
              onPress={() => console.log('Abrir post', p.id)}
              onPressLike={() => console.log('Like', p.id)}
              onPressComment={() => console.log('Comentário', p.id)}
              onPressShare={() => console.log('Share', p.id)}
              onPressUser={(u) => console.log('Perfil de', u)}
            />
          ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  headerWrap: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    zIndex: 20,
  },
  divider: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});