import React from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
export const FOOTER_HEIGHT = 45;

export type TabPath = '/mapa' | '/traben' | '/feed' | '/perfil';

interface FooterProps {
  activePath?: string;
  onNavigate?: (path: TabPath) => void;
  backgroundColor?: string;
}

const LOGO_SIZE = 40;
const LogoAtiva = require('../../../assets/images/logoIcon.png');
const LogoInativa = require('../../../assets/images/logoIconInativo.png');

// Tipos discriminados
type BaseTab = { path: TabPath };
type IconTab = BaseTab & { lib: 'mat' | 'ion' | 'fea'; icon: string };
type ImageTab = BaseTab & { lib: 'img'; imgActive: any; imgInactive: any };

const TABS: (IconTab | ImageTab)[] = [
  { path: '/mapa',   icon: 'route',    lib: 'mat' },
  { path: '/traben', lib: 'img', imgActive: LogoAtiva, imgInactive: LogoInativa },
  { path: '/feed',  icon: 'grid',  lib: 'fea' },
  { path: '/perfil', icon: 'person-outline', lib: 'ion' },
];

const ACTIVE_COLOR = '#FFFFFF';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';

const Footer: React.FC<FooterProps> = ({
  activePath,
  onNavigate,
  backgroundColor = '#000',
}) => {
  return (
    <View style={[styles.wrap, { backgroundColor }]}>
      {TABS.map((t) => {
        const active = !!activePath && activePath.startsWith(t.path);

        return (
          <Pressable
            key={t.path}
            onPress={() => {
              if (!active) onNavigate?.(t.path);
            }}
            style={({ pressed }) => [
              styles.item,
              pressed && { opacity: 0.4 },
            ]}
            hitSlop={8}
          >
            {t.lib === 'img' ? (
              <Image
                source={active ? t.imgActive : t.imgInactive}
                style={styles.logoImg}
              />
            ) : t.lib === 'mat' ? (
              <MaterialIcons
                name={t.icon as any}
                size={26}
                color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            ) : t.lib === 'fea' ? (
              <Feather
                name={t.icon as any}
                size={25}
                color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            ) : (
              <Ionicons
                name={t.icon as any}
                size={26}
                color={active ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FOOTER_HEIGHT,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: FOOTER_HEIGHT - 6,
  },
  logoImg: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: 'contain',
  },
});