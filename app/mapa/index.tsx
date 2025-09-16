import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import type { LatLng } from 'react-native-maps';
import RouteMap from '../../src/components/mapa/RouteMap';
import { FOOTER_HEIGHT } from '../../src/components/comuns/Footer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const routeCoords: LatLng[] = [
  { latitude: -23.561414, longitude: -46.655881 },
  { latitude: -23.5618, longitude: -46.6565 },
  { latitude: -23.5622, longitude: -46.6572 },
];

export default function MapaScreen() {
  const insets = useSafeAreaInsets();
  const bottomInset = FOOTER_HEIGHT + insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={StyleSheet.absoluteFill}>
        <RouteMap
          routeCoords={routeCoords}
          bottomInset={bottomInset}
        />
      </View>
      {/* Se quiser colocar um Header depois, basta adicionar aqui como overlay */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});