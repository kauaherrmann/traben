import React from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = [
  { key: 'route', name: 'route', route: '/mapa' as const, lib: MaterialIcons }, // <- era /flash
  {
    key: 'logo',
    isLogo: true,
    route: '/traben' as const,
    imageActive: require('../../../assets/images/logoIcon.png'),
    imageInactive: require('../../../assets/images/logoIconInativo.png'),
  },
  { key: 'globe-americas', name: 'globe-americas', route: '/stats' as const, lib: FontAwesome5 },
  { key: 'profile', name: 'person', route: '/profile' as const, lib: Ionicons },
];

type FooterProps = {
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  borderTop?: boolean;
};

export default function Footer({
  backgroundColor = '#070705',
  activeColor = '#fff',
  inactiveColor = 'rgba(255, 255, 255, 0.6)',
  borderTop = true,
}: FooterProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingBottom: insets.bottom || 8,
          borderTopWidth: borderTop ? StyleSheet.hairlineWidth : 0,
          borderTopColor: 'rgba(255,255,255,0.15)',
        },
      ]}
    >
      <View style={styles.row}>
       {ICONS.map((icon) => {
  const isActive = pathname.startsWith(icon.route as any);
  if (icon.isLogo) {
  return (
    <Pressable
      key={icon.key}
      style={styles.item}
      onPress={() => {
        if (!isActive) router.push(icon.route as any);
      }}
    >
      <Image
        source={isActive ? icon.imageActive : icon.imageInactive}
        style={{
          width: 40,
          height: 40,
          opacity: 1,
        }}
        resizeMode="contain"
      />
    </Pressable>
  );
}
  if (!icon.lib) return null; // <-- Adicione esta linha
  const IconComponent = icon.lib;
  return (
    <Pressable
      key={icon.key}
      style={styles.item}
      onPress={() => {
        if (!isActive) router.push(icon.route as any);
      }}
    >
      <IconComponent
        name={icon.name as any}
        size={26}
        color={isActive ? activeColor : inactiveColor}
      />
    </Pressable>
  );
})}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 56,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});