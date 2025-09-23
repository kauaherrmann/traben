import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import type { LatLng } from 'react-native-maps';
import RouteMap from '../../src/components/mapa/RouteMap';
import { FOOTER_HEIGHT } from '../../src/components/comuns/Footer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/components/comuns/Header'; // <- add
import { useRouter } from 'expo-router';

const routeCoords: LatLng[] = [
  { latitude: -23.561414, longitude: -46.655881 },
  { latitude: -23.5618, longitude: -46.6565 },
  { latitude: -23.5622, longitude: -46.6572 },
];

const router = useRouter();

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = FOOTER_HEIGHT + insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header sobreposto ao mapa */}
      <View pointerEvents="box-none" style={styles.headerOverlay}>
        <Header
          title="Mapa"
          showTitle
          showSearch
          showNotifications
          notificationsBadgeCount={2}
          onPressNotifications={() => router.push('/notificacoes')} 
          onSubmitSearch={(q) => console.log('Buscar:', q)}
          // opcional: ajustar intensidade do blur
          blurIntensity={40}
        />
      </View>

      <View style={StyleSheet.absoluteFill}>
        <RouteMap routeCoords={routeCoords} bottomInset={bottomInset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  headerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
});