import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import type { LatLng } from 'react-native-maps';
import RouteMap from '../../src/components/mapa/RouteMap';
import Footer from '../../src/components/comuns/Footer';

const BG_COLOR = '#070705';
const FOOTER_HEIGHT = 65;

export default function MapaScreen() {
  const routeCoords: LatLng[] = [
    { latitude: -23.561414, longitude: -46.655881 },
    { latitude: -23.5618, longitude: -46.6565 },
    { latitude: -23.5622, longitude: -46.6572 },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG_COLOR }]}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      <View style={styles.mapContainer}>
        <RouteMap routeCoords={routeCoords} bottomInset={FOOTER_HEIGHT + 8} />
      </View>
      <View style={{ height: FOOTER_HEIGHT }} />
      <Footer backgroundColor={BG_COLOR} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1 },
});