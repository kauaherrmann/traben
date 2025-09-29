import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type PostRun = {
  id: string;
  user: {
    username: string;
    avatarSource?: ImageSourcePropType;
  };
  type?: 'treino' | 'prova' | 'longão' | 'intervalado' | 'competição';
  distanceKm: number;
  durationSec: number;
  paceSec: number;
  elevationGain?: number;
  startedAt?: string;          // ISO
  routeSnapshotUri?: string;   // imagem rota (snapshot)
  // NOVO: foto do usuário (ativa layout dividido)
  photoUri?: string;
  photoSource?: ImageSourcePropType;

  improvementPct?: number;     // + melhora, - piora
  caption?: string;
  likes?: number;
  comments?: number;
  youLiked?: boolean;
};

export type CardpostCorridaProps = {
  post: PostRun;
  onPress?: (post: PostRun) => void;
  onPressLike?: (post: PostRun) => void;
  onPressComment?: (post: PostRun) => void;
  onPressShare?: (post: PostRun) => void;
  onPressUser?: (username: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  distanceTextStyle?: StyleProp<TextStyle>;
  compact?: boolean;
};

export default function CardpostCorrida({
  post,
  onPress,
  onPressLike,
  onPressComment,
  onPressShare,
  onPressUser,
  containerStyle,
  distanceTextStyle,
  compact = false,
}: CardpostCorridaProps) {
  const {
    user,
    type,
    distanceKm,
    durationSec,
    paceSec,
    elevationGain,
    startedAt,
    routeSnapshotUri,
    photoUri,
    photoSource,
    improvementPct,
    caption,
    likes = 0,
    comments = 0,
    youLiked,
  } = post;

  const dateLabel = startedAt ? formatDateShort(startedAt) : '';
  const paceLabel = formatPace(paceSec);
  const durLabel = formatDuration(durationSec);

  const improveColor =
    improvementPct == null
      ? undefined
      : improvementPct > 0
        ? '#30D158'
        : improvementPct < 0
          ? '#FF453A'
          : 'rgba(255,255,255,0.55)';

  const hasPhoto = !!(photoUri || photoSource);

  return (
    <Pressable
      disabled={!onPress}
      onPress={() => onPress?.(post)}
      style={({ pressed }) => [
        styles.container,
        compact && styles.compact,
        pressed && onPress && { opacity: 0.85 },
        containerStyle,
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => onPressUser?.(user.username)}
          hitSlop={8}
          style={styles.userRow}
        >
          <View style={styles.avatarWrap}>
            {user.avatarSource ? (
              <Image source={user.avatarSource} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>
                  {initials(user.username)}
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.username} numberOfLines={1}>
              {user.username}
            </Text>
            <Text style={styles.subMeta} numberOfLines={1}>
              {type ? capitalize(type) : 'Corrida'}
              {dateLabel ? ' • ' + dateLabel : ''}
            </Text>
          </View>
        </Pressable>

        {improvementPct != null && (
          <View
            style={[
              styles.improveChip,
              { backgroundColor: improveColor + '1A' },
            ]}
          >
            <Ionicons
              name={
                improvementPct > 0
                  ? 'trending-up'
                  : improvementPct < 0
                    ? 'trending-down'
                    : 'remove'
              }
              size={14}
              color={improveColor}
            />
            <Text style={[styles.improveTxt, { color: improveColor }]}>
              {improvementPct > 0 ? '+' : ''}
              {improvementPct.toFixed(Math.abs(improvementPct) < 10 ? 1 : 0)}%
            </Text>
          </View>
        )}
      </View>

      {/* Resumo Principal */}
      <View style={styles.summaryRow}>
        <Text style={[styles.distanceValue, distanceTextStyle]}>
          {formatDistance(distanceKm)}
          <Text style={styles.distanceUnit}> km</Text>
        </Text>
        <View style={styles.summaryStats}>
          <Stat label="Pace" value={paceLabel} />
            <Stat label="Duração" value={durLabel} />
          {elevationGain != null && (
            <Stat label="Elevação" value={elevationGain + ' m'} />
          )}
        </View>
      </View>

      {/* Mídia: rota + opcional foto */}
      {hasPhoto ? (
        <View style={styles.mediaRow}>
          {/* Rota (esquerda) */}
          <Pressable
            disabled
            style={styles.mediaBox}
            accessibilityLabel="Mapa da rota (placeholder)"
          >
            {routeSnapshotUri ? (
              <Image source={{ uri: routeSnapshotUri }} style={styles.mediaImg} />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Ionicons
                  name="map-outline"
                  size={34}
                  color="rgba(255,255,255,0.32)"
                />
                <View style={[styles.fakePolyline, { width: '78%', height: 66 }]} />
              </View>
            )}
          </Pressable>

          {/* Foto (direita) */}
          <Pressable
            disabled
            style={styles.mediaBox}
            accessibilityLabel="Foto do treino"
          >
            {photoSource ? (
              <Image source={photoSource} style={styles.mediaImg} />
            ) : photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.mediaImg} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={34}
                  color="rgba(255,255,255,0.32)"
                />
                <Text style={styles.photoPlaceholderTxt}>Foto</Text>
              </View>
            )}
          </Pressable>
        </View>
      ) : (
        <Pressable
          disabled
          style={styles.mapWrap}
          accessibilityLabel="Mapa da rota (placeholder)"
        >
          {routeSnapshotUri ? (
            <Image source={{ uri: routeSnapshotUri }} style={styles.mapImg} />
          ) : (
            <View style={styles.mapPlaceholder}>
              <Ionicons
                name="map-outline"
                size={42}
                color="rgba(255,255,255,0.35)"
              />
              <Text style={styles.mapPlaceholderTxt}>Rota em breve</Text>
              <View style={styles.fakePolyline} />
            </View>
          )}
        </Pressable>
      )}

      {/* Legenda */}
      {!!caption && (
        <Text style={styles.caption} numberOfLines={compact ? 2 : 4}>
          {caption}
        </Text>
      )}

      {/* Ações */}
      <View style={styles.actionsRow}>
        <ActionIcon
          icon={youLiked ? 'heart' : 'heart-outline'}
          active={youLiked}
          label={likes ? formatCompact(likes) : 'Curtir'}
          onPress={() => onPressLike?.(post)}
        />
        <ActionIcon
          icon="chatbubble-outline"
          label={comments ? formatCompact(comments) : 'Comentar'}
          onPress={() => onPressComment?.(post)}
        />
        <ActionIcon
          icon="share-social-outline"
          label="Compartilhar"
          onPress={() => onPressShare?.(post)}
        />
      </View>
    </Pressable>
  );
}

/* Sub Components */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function ActionIcon({
  icon,
  label,
  onPress,
  active,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.5 }]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? '#FF375F' : 'rgba(255,255,255,0.85)'}
      />
      <Text
        style={[
          styles.actionTxt,
          active && { color: '#FF375F' },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* Utils */
function formatDistance(km: number) {
  return km % 1 === 0 ? km.toFixed(0) : km.toFixed(1);
}
function formatPace(sec: number) {
  if (!sec) return '--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}
function formatDuration(totalSec: number) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h) return `${h}h ${m}m`;
  if (m >= 1) return `${m}m ${s.toString().padStart(2, '0')}s`;
  return `${s}s`;
}
function formatCompact(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(v);
}
function formatDateShort(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}
function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 16,
  },
  compact: {
    paddingVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 10,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#222',
  },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  username: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  improveChip: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  improveTxt: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 18,
  },
  distanceValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFF',
    includeFontPadding: false,
  },
  distanceUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
  },
  summaryStats: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 18,
    paddingBottom: 4,
  },
  statItem: { maxWidth: '45%' },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1,
  },

  /* Layout mídia única (rota) */
  mapWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#111',
    height: 180,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  mapImg: { width: '100%', height: '100%' },

  /* Layout mídia dividida */
  mediaRow: {
    flexDirection: 'row',
    gap: 12,
    height: 180,
    marginBottom: 12,
  },
  mediaBox: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaImg: {
    width: '100%',
    height: '100%',
  },

  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapPlaceholderTxt: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  fakePolyline: {
    position: 'absolute',
    width: '70%',
    height: 80,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#0A84FF',
    opacity: 0.25,
    transform: [{ rotate: '25deg' }, { translateY: 10 }],
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  photoPlaceholderTxt: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  caption: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 14,
  },
  actionTxt: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
});