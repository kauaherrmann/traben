import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
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

  showMenu?: boolean;
  onPressMenu?: () => void;
  menuIconName?: React.ComponentProps<typeof Ionicons>['name'];

  showNotifications?: boolean;
  onPressNotifications?: () => void;
  notificationsBadgeCount?: number;

  // NOVO: ícone de busca + barra central que abre ao clicar
  showSearchIcon?: boolean;
  searchActive?: boolean;                      // (controlado externamente opcional)
  onChangeSearchActive?: (active: boolean) => void;
  searchValue?: string;
  onChangeSearch?: (text: string) => void;
  onSubmitSearch?: () => void;
  searchPlaceholder?: string;
  searchAutoFocus?: boolean;
  searchContainerStyle?: StyleProp<ViewStyle>;
  searchInputStyle?: StyleProp<TextStyle>;

  color?: string;
  backgroundColor?: string;
  bottomDivider?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Header({
  title = 'Título',
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

  showSearchIcon = false,
  searchActive,
  onChangeSearchActive,
  searchValue,
  onChangeSearch,
  onSubmitSearch,
  searchPlaceholder = 'Pesquisar...',
  searchAutoFocus = false,
  searchContainerStyle,
  searchInputStyle,

  color = '#FFFFFF',
  backgroundColor = 'transparent',
  bottomDivider = false,
  containerStyle,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const [internalActive, setInternalActive] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const active = searchActive !== undefined ? searchActive : internalActive;
  const hasBadge = notificationsBadgeCount > 0;

  const setActive = (v: boolean) => {
    if (searchActive === undefined) setInternalActive(v);
    onChangeSearchActive?.(v);
  };

  const toggleSearch = () => {
    const next = !active;
    setActive(next);
  };

  useEffect(() => {
    if (active && searchAutoFocus) {
      // pequeno timeout para garantir layout
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [active, searchAutoFocus]);

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
        {/* ESQUERDA - Título + Back (inalterado) */}
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

        {/* CENTRO - Barra de busca somente quando ativa */}
        {active && (
          <View style={styles.center}>
            <View style={[styles.searchContainer, searchContainerStyle]}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.65)" />
              <TextInput
                ref={inputRef}
                value={searchValue}
                onChangeText={onChangeSearch}
                onSubmitEditing={onSubmitSearch}
                placeholder={searchPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={[styles.searchInput, { color }, searchInputStyle]}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {!!searchValue && (
                <Pressable
                  hitSlop={10}
                  onPress={() => onChangeSearch?.('')}
                  style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.55 }]}
                  accessibilityLabel="Limpar pesquisa"
                >
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.45)" />
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* DIREITA - Ícones (ordem: searchIcon (se ativo ou não) + notifications + menu) */}
        <View style={styles.right}>
          {showSearchIcon && (
            <Pressable
              onPress={toggleSearch}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={active ? 'Fechar busca' : 'Abrir busca'}
              style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
            >
              <Ionicons
                name={active ? 'close' : 'search'}
                size={22}
                color={color}
              />
            </Pressable>
          )}

          {showNotifications && (
            <View style={styles.notificationWrap}>
              <Pressable
                onPress={onPressNotifications}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Notificações"
                style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="notifications-outline" size={22} color={color} />
              </Pressable>
              {hasBadge && <View style={styles.badge} />}
            </View>
          )}

          {showMenu && !active && (
            <Pressable
              onPress={onPressMenu}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Menu"
              style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
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
      style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.6 }]}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '55%',
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
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 72, // garante espaço p/ esquerda (back+titulo) e direita (ícones)
    height: 44,
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 34,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  clearBtn: { paddingLeft: 4 },
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