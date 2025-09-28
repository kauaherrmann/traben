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

export type HeaderFlutuanteProps = {
  // Título (lado esquerdo)
  title?: string | React.ReactNode;
  showTitle?: boolean;
  titleStyle?: StyleProp<TextStyle>;

  // Voltar (opcional)
  showBackButton?: boolean;
  onPressBack?: () => void;

  // Notificações (lado direito)
  showNotifications?: boolean;
  onPressNotifications?: () => void;
  notificationsBadgeCount?: number;

  // Busca (centro)
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  onChangeSearchText?: (text: string) => void;
  onSubmitSearch?: (text: string) => void;
  onClearSearch?: () => void;

  // Aparência
  color?: string;               // cor de texto/ícones
  backgroundColor?: string;     // fundo fora da pílula (overlay)
  blurIntensity?: number;
  blurTint?: 'dark' | 'light' | 'default';
  showBlur?: boolean;           // desliga o BlurView se false
  pillBackgroundColor?: string; // cor da pílula
  elevated?: boolean;           // sombra da pílula

  containerStyle?: StyleProp<ViewStyle>;
};

export default function HeaderFlutuante({
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

  color = '#FFFFFF',
  backgroundColor = 'transparent',
  blurIntensity = 35,
  blurTint = 'dark',
  showBlur = true,
  pillBackgroundColor,
  elevated = true,

  containerStyle,
}: HeaderFlutuanteProps) {
  const insets = useSafeAreaInsets();

  const textColor = color;
  const iconColor = color;
  const dividerColor = 'rgba(255,255,255,0.16)';
  const pillBg = pillBackgroundColor ?? '#000';
  const searchBg = 'rgba(255,255,255,0.08)';
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

  const PillContainer = showBlur ? BlurView : View;
  const pillProps = showBlur ? { intensity: blurIntensity, tint: blurTint as any } : {};

  return (
    <View
      style={[
        styles.wrapper,
        { paddingTop: insets.top + 0, backgroundColor },
        containerStyle,
      ]}
    >
      <PillContainer {...pillProps} style={[styles.pillBlur, elevated && styles.elevated]}>
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

          {/* Divisor entre título e busca */}
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

          {/* Direita: sininho */}
          <View style={styles.right}>
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
        </View>
      </PillContainer>
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
    paddingHorizontal: 14,
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
  },
  elevated: {
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
    fontSize: 20,
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 7,
    gap: 2,
  },
  notificationWrapper: {
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