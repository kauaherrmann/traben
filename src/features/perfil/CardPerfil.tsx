import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';

export type CardPerfilProps = {
  avatarUri?: string;
  onPressAvatar?: () => void;
  avatarSource?: ImageSourcePropType;

  totalKm?: number;
  runsCount?: number;
  connections?: number;
  onPressConnections?: () => void;

  averagePaceSeconds?: number;

  // Localização
  city?: string;
  state?: string;
  country?: string;

  loading?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  statNumberStyle?: StyleProp<TextStyle>;
  statLabelStyle?: StyleProp<TextStyle>;
  subStatStyle?: StyleProp<TextStyle>;
  locationTextStyle?: StyleProp<TextStyle>;

  // Ações inferiores
  onPressShare?: () => void;
  onPressEdit?: () => void;

  // Novo: deslocar somente os blocos laterais (valor positivo sobe)
  sideStatsLift?: number;        // aplica em ambos
  sideStatsLiftLeft?: number;    // sobrescreve esquerdo
  sideStatsLiftRight?: number;   // sobrescreve direito
};

export default function CardPerfil({
  avatarUri,
  onPressAvatar,
  avatarSource,

  totalKm = 0,
  runsCount = 0,
  connections = 0,
  onPressConnections,

  averagePaceSeconds,

  city,
  state,
  country,

  loading = false,

  containerStyle,
  statNumberStyle,
  statLabelStyle,
  subStatStyle,
  locationTextStyle,

  onPressShare,
  onPressEdit,

  sideStatsLift = 0,
  sideStatsLiftLeft,
  sideStatsLiftRight,
}: CardPerfilProps) {
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.row}>
          <View style={styles.statBlock} />
          <View style={styles.avatarSkeleton} />
          <View style={styles.statBlock} />
        </View>
        <View style={styles.bioSkeleton} />
      </View>
    );
  }

  const location = formatLocation({ city, state, country });
  const liftLeft = sideStatsLiftLeft ?? sideStatsLift;
  const liftRight = sideStatsLiftRight ?? sideStatsLift;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        {/* Conexões + Pace */}
        <Pressable
          style={({ pressed }) => [
            styles.statContainer,
            liftLeft ? { marginBottom: liftLeft } : null,
            pressed && styles.pressed
          ]}
          onPress={onPressConnections}
          accessibilityRole="button"
          accessibilityLabel="Ver conexões"
        >
          <Text style={[styles.subStat, subStatStyle]} numberOfLines={1}>
            {formatPace(averagePaceSeconds)}
          </Text>
          <Text style={[styles.statNumber, statNumberStyle]} numberOfLines={1}>
            {formatCompact(connections)}
          </Text>
          <Text style={[styles.statLabel, statLabelStyle]}>Conexões</Text>
        </Pressable>

        {/* Avatar */}
        <Pressable
          style={({ pressed }) => [styles.avatarWrapper, pressed && { opacity: 0.85 }]}
          onPress={onPressAvatar}
          accessibilityRole="imagebutton"
          accessibilityLabel="Foto de perfil"
        >
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
          ) : avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{extractInitials('Perfil')}</Text>
            </View>
          )}
        </Pressable>

        {/* Km + Corridas */}
        <View
          style={[
            styles.statContainer,
            liftRight ? { marginBottom: liftRight } : null
          ]}
        >
          <Text style={[styles.subStat, subStatStyle]} numberOfLines={1}>
            {formatCompact(runsCount)} Corridas
          </Text>
          <Text style={[styles.statNumber, statNumberStyle]} numberOfLines={1}>
            {formatKm(totalKm)}
          </Text>
          <Text style={[styles.statLabel, statLabelStyle]}>Km</Text>
        </View>
      </View>

      {/* Localização */}
      {location ? (
        <View style={styles.locationWrapper}>
          <Text style={[styles.locationText, locationTextStyle]} numberOfLines={2}>
            {location}
          </Text>
        </View>
      ) : null}

      {/* Botões */}
      <View style={styles.actionsRow}>
        <ActionButton
          label="Compartilhar"
          onPress={onPressShare}
          disabled={!onPressShare}
        />
        <ActionButton
          label="Editar"
            variant="secondary"
          onPress={onPressEdit}
          disabled={!onPressEdit}
        />
      </View>
    </View>
  );
}

/* Sub Components */
function ActionButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.actionBtn,
        variant === 'secondary' && styles.actionBtnSecondary,
        (pressed && !disabled) && { opacity: 0.7 },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Text
        style={[
          styles.actionBtnText,
          variant === 'secondary' && styles.actionBtnTextSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* Utils */
function formatKm(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(v);
}
function formatCompact(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(v);
}
function formatPace(sec?: number) {
  if (typeof sec !== 'number' || isNaN(sec) || sec <= 0) return '--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}'${String(s).padStart(2, '0')}"`;
}
function extractInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function formatLocation({ city, state, country }: { city?: string; state?: string; country?: string }) {
  const parts = [city, state, country].filter(Boolean);
  return parts.join(' • ');
}

const AVATAR_SIZE = 120;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end', // importante para o lift (marginBottom) subir os lados
    justifyContent: 'space-between',
  },
  statContainer: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  subStat: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.3,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#202020',
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  avatarInitials: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
  },
  locationWrapper: {
    marginTop: 14,
  },
  locationText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    backgroundColor: '#1E1E1E',
  },
  actionBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionBtnTextSecondary: {
    color: '#FFFFFF',
  },
  pressed: { opacity: 0.6 },
  /* Skeleton */
  statBlock: {
    width: 100,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#1C1C1C',
  },
  avatarSkeleton: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#1C1C1C',
  },
  bioSkeleton: {
    marginTop: 16,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
  },
});