import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export type HeaderProps = {
  // Título (lado esquerdo)
  title?: string | React.ReactNode;
  showTitle?: boolean;
  titleStyle?: StyleProp<TextStyle>;

  // Voltar (opcional, lado esquerdo)
  showBackButton?: boolean;
  onPressBack?: () => void;

  // Ações à direita
  showMenu?: boolean;
  onPressMenu?: () => void;
  menuIconName?: React.ComponentProps<typeof Ionicons>['name'];

  // Aparência
  color?: string;
  backgroundColor?: string;
  bottomDivider?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
};

export default function Header({
  title = 'Perfil',
  showTitle = true,
  titleStyle,

  showBackButton = false,
  onPressBack,

  showMenu = true,
  onPressMenu,
  menuIconName = 'reorder-three-outline',

  color = '#FFFFFF',
  backgroundColor = 'transparent',
  bottomDivider = false,

  containerStyle,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 3, backgroundColor },
        bottomDivider && styles.bottomDivider,
        containerStyle,
      ]}
    >
      <View style={styles.row}>
        {/* Esquerda: voltar + título */}
        <View style={styles.left}>
          {showBackButton && (
            <IconButton
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              color={color}
              onPress={onPressBack}
              accessibilityLabel="Voltar"
            />
          )}

          {showTitle && (
            typeof title === 'string'
              ? <Text numberOfLines={1} style={[styles.titleLeft, { color }, titleStyle]}>{title}</Text>
              : <View style={{ flexShrink: 1 }}>{title}</View>
          )}
        </View>

        {/* Direita: hambúrguer */}
        <View style={styles.right}>
          {showMenu && (
            <IconButton
              name={menuIconName}
              color={color}
              onPress={onPressMenu}
              accessibilityLabel="Menu"
            />
          )}
        </View>
      </View>
    </View>
  );
}

function IconButton({
  name,
  color,
  onPress,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.iconButton,
        pressed && { opacity: 0.6 },
      ]}
    >
      <Ionicons name={name} size={24} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  row: {
    position: 'relative',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 44,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  titleLeft: {
    fontSize: 20,
    fontWeight: '800',
  },
  right: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  bottomDivider: {
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});