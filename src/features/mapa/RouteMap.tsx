import React from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { LatLng, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

export type RouteMapProps = {
  routeCoords: LatLng[];
  initialRegionPadding?: { latDelta?: number; lngDelta?: number };
  strokeColor?: string;
  strokeWidth?: number;
  showEndpoints?: boolean;
  style?: StyleProp<ViewStyle>;
  bottomInset?: number;
};

export default function RouteMap({
  routeCoords,
  initialRegionPadding,
  strokeColor = '#0a7ea4',
  strokeWidth = 4,
  showEndpoints = true,
  style,
  bottomInset = 0,
}: RouteMapProps) {
  if (routeCoords.length === 0) {
    return <View style={[styles.container, style]} />;
  }

  const first = routeCoords[0];
  const latitudeDelta = initialRegionPadding?.latDelta ?? 0.01;
  const longitudeDelta = initialRegionPadding?.lngDelta ?? 0.01;
  const LEGAL_LABEL_TOP_INSET = 8;

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta,
          longitudeDelta,
        }}
         legalLabelInsets={{ top: LEGAL_LABEL_TOP_INSET, left: 8, right: 8, bottom: bottomInset }}
      >
        <Polyline coordinates={routeCoords} strokeColor={strokeColor} strokeWidth={strokeWidth} />
        {showEndpoints && (
          <>
            <Marker coordinate={routeCoords[0]} title="Início" />
            <Marker coordinate={routeCoords[routeCoords.length - 1]} title="Fim" />
          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});