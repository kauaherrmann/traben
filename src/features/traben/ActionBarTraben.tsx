import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export type ActionBarTrabenProps = {
  top: number; // posição Y (já incluindo safe area + header)
  onPressCriarRota?: () => void;
  onPressCorridaLivre?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const ACTION_BAR_HEIGHT = 64;

export default function ActionBarTraben({
  top,
  onPressCriarRota,
  onPressCorridaLivre,
  containerStyle,
}: ActionBarTrabenProps) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.absoluteWrap, { top }]}
    >
      <View style={[styles.innerShadowWrap, containerStyle]}>
        <BlurView
          intensity={40}
          tint="dark"
          style={styles.blur}
        />
        <View style={styles.overlay} />

        <View style={styles.row}>
          <ActionButton
            icon="map-outline"
            label="Criar Rota"
            onPress={onPressCriarRota}
          />
          <View style={styles.sep} />
          <ActionButton
            icon="walk-outline"
            label="Corrida Livre"
            onPress={onPressCorridaLivre}
          />
        </View>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.65 }]}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={20} color="#FFF" />
      <Text style={styles.btnLabel} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  absoluteWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 15,
    paddingHorizontal: 16,
  },
  innerShadowWrap: {
    borderRadius: 22,
    overflow: 'hidden',
    height: ACTION_BAR_HEIGHT,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,7,5,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  btnLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sep: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 12,
  },
});