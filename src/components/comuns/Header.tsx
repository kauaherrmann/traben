import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export type HeaderProps = {
  // Título
  title?: string | React.ReactNode;
  showTitle?: boolean;
  titleStyle?: StyleProp<TextStyle>;

  // Voltar
  showBackButton?: boolean;
  onPressBack?: () => void;

  // Notificações
  showNotifications?: boolean;
  onPressNotifications?: () => void;
  notificationsBadgeCount?: number;

  // Busca
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  onChangeSearchText?: (text: string) => void;
  onSubmitSearch?: (text: string) => void;
  onClearSearch?: () => void;

  // Aparência
  blurIntensity?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Header({
  title = 'Mapa',
  showTitle = true,
  titleStyle,

  showBackButton,
  onPressBack,

  showNotifications = true,
  onPressNotifications,
  notificationsBadgeCount = 0,

  showSearch = true,
  searchPlaceholder = 'Pesquisar',
  searchValue,
  defaultSearchValue,
  onChangeSearchText,
  onSubmitSearch,
  onClearSearch,

  blurIntensity = 35,
  containerStyle,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  // Cores (fixas para reproduzir a imagem)
  const textColor = '#FFFFFF';
  const iconColor = '#FFFFFF';
  const dividerColor = 'rgba(255,255,255,0.16)';
  const pillBg = '#000'; // fundo da pílula
  const searchBg = 'rgba(255,255,255,0.08)'; // campo de busca
  const placeholder = 'rgba(255,255,255,0.60)';

  const isControlled = typeof searchValue === 'string';
  const [internalSearch, setInternalSearch] = useState(defaultSearchValue ?? '');
  const searchText = isControlled ? (searchValue as string) : internalSearch;

  const hasNotifications = useMemo(() => notificationsBadgeCount > 0, [notificationsBadgeCount]);

  function handleChangeSearch(t: string) {
    if (!isControlled) setInternalSearch(t);
    onChangeSearchText?.(t);
  }

  function handleSubmitSearch() {
    onSubmitSearch?.(searchText);
  }

  function handleClearSearch() {
    if (!isControlled) setInternalSearch('');
    onClearSearch?.();
  }

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 8 }, containerStyle]}>
      <BlurView intensity={blurIntensity} tint="dark" style={styles.pillBlur}>
        <View style={[styles.pill, { backgroundColor: pillBg }]}>
          {/* Esquerda: voltar + título */}
          <View style={styles.left}>
            {showBackButton && (
              <IconButton
                name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
                color={iconColor}
                onPress={onPressBack}
                accessibilityLabel="Voltar"
              />
            )}

            {showTitle && (
              typeof title === 'string' ? (
                <Text style={[styles.title, { color: textColor }, titleStyle]} numberOfLines={1}>
                  {title}
                </Text>
              ) : (
                <View style={styles.titleNode}>{title}</View>
              )
            )}
          </View>

          {/* Divisor vertical (entre título e busca) */}
          {showTitle && showSearch && <View style={[styles.divider, { backgroundColor: dividerColor }]} />}

          {/* Centro: busca */}
          {showSearch && (
            <View style={[styles.searchContainer, { backgroundColor: searchBg }]}>
              <Ionicons name="search" size={16} color={placeholder} style={styles.searchIcon} />
              <TextInput
                value={searchText}
                onChangeText={handleChangeSearch}
                placeholder={searchPlaceholder}
                placeholderTextColor={placeholder}
                returnKeyType="search"
                onSubmitEditing={handleSubmitSearch}
                style={[styles.searchInput, { color: textColor }]}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="never"
              />
              {searchText?.length > 0 && (
                <Pressable onPress={handleClearSearch} hitSlop={8} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.4)" />
                </Pressable>
              )}
            </View>
          )}

          {/* Direita: sino */}
          {showNotifications && (
            <View style={styles.notificationWrapper}>
              <IconButton
                name="notifications-outline"
                color={iconColor}
                onPress={onPressNotifications}
                accessibilityLabel="Notificações"
              />
              {hasNotifications && <View style={styles.badge} />}
            </View>
          )}
        </View>
      </BlurView>
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
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 20 }]}
    >
      <Ionicons name={name} size={22} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14, // margem lateral como na imagem
    paddingBottom: 8,
  },
  pillBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  pill: {
    minHeight: 50,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    // sombra sutil
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  titleNode: {
    flexShrink: 1,
  },
  divider: {
    width: 1,
    height: 26,
    marginHorizontal: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: Platform.select({ ios: 9, android: 6 }),
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 6,
  },
  notificationWrapper: {
    marginLeft: 7,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
});