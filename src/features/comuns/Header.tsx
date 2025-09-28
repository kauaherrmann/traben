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
import Entypo from '@expo/vector-icons/Entypo';

export type HeaderProps = {
  title?: string | React.ReactNode;
  showTitle?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  showBackButton?: boolean;
  onPressBack?: () => void;

  // Menu (hambúrguer)
  showMenu?: boolean;
  onPressMenu?: () => void;
  menuIconName?: React.ComponentProps<typeof Ionicons>['name'];

  // NOVO (já existia no type, agora implementado)
  showNotifications?: boolean;
  onPressNotifications?: () => void;
  notificationsBadgeCount?: number;

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

  showNotifications = false,
  onPressNotifications,
  notificationsBadgeCount = 0,

  color = '#FFFFFF',
  backgroundColor = 'transparent',
  bottomDivider = false,
  containerStyle,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const hasBadge = notificationsBadgeCount > 0;

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
        {/* Esquerda */}
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

        {/* Direita: Notificações (opcional) + Menu (opcional) */}
        <View style={styles.right}>
          {showNotifications && (
            <View style={styles.notificationWrap}>
              <Pressable
                onPress={onPressNotifications}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Notificações"
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color={color}
                />
              </Pressable>
              {hasBadge && <View style={styles.badge} />}
            </View>
          )}

            {showMenu && (
              <Pressable
                onPress={onPressMenu}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Menu"
                style={({ pressed }) => [
                  styles.iconButton,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Entypo name="menu" size={24} color={color} />
              </Pressable>
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
  notificationWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#000',
  },
  bottomDivider: {
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});