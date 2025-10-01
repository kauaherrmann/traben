import React from 'react';
import { View, StyleSheet, StatusBar, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '@/src/features/comuns/Header';
import ActionBarTraben, { ACTION_BAR_HEIGHT } from '@/src/features/traben/ActionBarTraben';
import { FOOTER_HEIGHT } from '@/src/features/comuns/Footer';
import { BlurView } from 'expo-blur';
import CardHistoricoTreinoHorizontal, { TreinoHistorico } from '@/src/features/traben/CardTreinoHistorico';

export default function TrabenScreen() {
  const insets = useSafeAreaInsets();

  const HEADER_ROW_HEIGHT = 44 + 8;
  const headerTopPadding = insets.top + 3;
  const actionsTop = headerTopPadding + HEADER_ROW_HEIGHT + 8;
  const contentTopPad = actionsTop + ACTION_BAR_HEIGHT + 16;
  const bottomPad = FOOTER_HEIGHT + insets.bottom + 16;

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerBlurOpacity = scrollY.interpolate({
    inputRange: [0, 20, 70],
    outputRange: [0, 0.4, 1],
    extrapolate: 'clamp',
  });

  const treinos: TreinoHistorico[] = [
  {
    id: 't1',
    titulo: 'Morning Run',
    dataISO: new Date().toISOString(),
    tipo: 'treino',
    distanciaKm: 10.08,
    duracaoSec: 47 * 60 + 6,
    paceSec: 280,
    improvementPct: 4.5,
  },
  {
    id: 't2',
    titulo: 'Intervalado Progressivo',
    dataISO: new Date(Date.now() - 1000*60*60*20).toISOString(),
    tipo: 'intervalado',
    distanciaKm: 6.4,
    duracaoSec: 32 * 60,
    paceSec: 300,
    improvementPct: 2.1,
  },
  {
    id: 't3',
    titulo: 'Longão Domingo',
    dataISO: new Date(Date.now() - 1000*60*60*48).toISOString(),
    tipo: 'longão',
    distanciaKm: 18.6,
    duracaoSec: 1*3600 + 28*60,
    paceSec: 305,
    improvementPct: -1.2,
  },
  {
    id: 't4',
    titulo: 'Recuperação Leve',
    dataISO: new Date(Date.now() - 1000*60*60*72).toISOString(),
    tipo: 'recuperação',
    distanciaKm: 5.0,
    duracaoSec: 30 * 60,
    paceSec: 360,
    improvementPct: 1.0,
  },
  {
    id: 't5',
    titulo: 'Prova 10K Cidade',
    dataISO: new Date(Date.now() - 1000*60*60*96).toISOString(),
    tipo: 'prova',
    distanciaKm: 10.0,
    duracaoSec: 42 * 60,
    paceSec: 252,
    improvementPct: 5.0,
  },
  {
    id: 't6',
    titulo: 'Corrida Livre Tarde',
    dataISO: new Date(Date.now() - 1000*60*60*120).toISOString(),
    tipo: 'treino',
    distanciaKm: 12.0,
    duracaoSec: 60 * 60,
    paceSec: 300,
    improvementPct: 3.0,
  },
  {
    id: 't7',
    titulo: 'Treino de Força',
    dataISO: new Date(Date.now() - 1000*60*60*144).toISOString(),
    tipo: 'treino',
    distanciaKm: 0,
    duracaoSec: 45 * 60,
    paceSec: 0,
    improvementPct: 2.0,
  }
];
 
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.headerWrap}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: headerBlurOpacity }]}>
              <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            </Animated.View>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: headerBlurOpacity, backgroundColor: 'rgba(7,7,5,0.45)' },
              ]}
            />
            <Animated.View style={[styles.divider, { opacity: headerBlurOpacity }]} />
        </View>
        <Header
          title="Traben"
          showTitle
          showNotifications
          notificationsBadgeCount={3}
          showMenu={false}
        />
      </View>

      <ActionBarTraben
        top={actionsTop}
        onPressCriarRota={() => console.log('Criar rota')}
        onPressCorridaLivre={() => console.log('Corrida livre')}
      />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: contentTopPad,
          paddingBottom: bottomPad,
          gap: 18,
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {treinos.map(t => (
           <CardHistoricoTreinoHorizontal
             key={t.id}
             treino={t}
             onPress={(x) => console.log('Abrir treino', x.id)}
             style={{ marginHorizontal: 16 }}
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
    top: 0, left: 0, right: 0,
    zIndex: 20,
  },
  divider: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});