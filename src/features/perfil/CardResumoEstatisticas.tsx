import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CardEstatisticasPerfilProps = {
  totalKm?: number;
  runsCount?: number;
  averagePaceSec?: number;
  totalDurationSec?: number;
  connections?: number;
  elevationGain?: number;
  longestRunKm?: number;
  bestPaceSec?: number;
  streakDays?: number;
  calories?: number;
  lastRunDistanceKm?: number;
  lastRunPaceSec?: number;

  title?: string;
  loading?: boolean;
  error?: boolean;

  onPress?: () => void;
  onRetry?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export default function CardEstatisticasPerfil({
  totalKm = 0,
  runsCount = 0,
  averagePaceSec,
  totalDurationSec = 0,
  connections = 0,
  elevationGain,
  longestRunKm,
  bestPaceSec,
  streakDays,
  calories,
  lastRunDistanceKm,
  lastRunPaceSec,

  title = 'Estatísticas',
  loading = false,
  error = false,
  onPress,
  onRetry,

  containerStyle,
  valueStyle,
  labelStyle,
}: CardEstatisticasPerfilProps) {
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.skelTitle} />
        <View style={styles.skelGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={styles.skelItem} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <Pressable
        onPress={onRetry}
        style={[styles.container, styles.center, containerStyle]}
      >
        <Text style={styles.errTxt}>Falha ao carregar</Text>
        <Text style={styles.errHint}>Toque para tentar</Text>
      </Pressable>
    );
  }

  const data: StatItem[] = [
    { label: 'Km Totais', value: formatKm(totalKm) },
    { label: 'Corridas', value: runsCount.toString() },
    { label: 'Pace Médio', value: formatPace(averagePaceSec) },
    { label: 'Tempo Total', value: formatDuration(totalDurationSec) },
    { label: 'Conexões', value: formatCompact(connections) },
    elevationGain != null ? { label: 'Elevação', value: elevationGain + ' m' } : null,
    longestRunKm != null ? { label: 'Maior Corrida', value: formatKm(longestRunKm) + ' km' } : null,
    bestPaceSec != null ? { label: 'Melhor Pace', value: formatPace(bestPaceSec) } : null,
    streakDays != null ? { label: 'Streak', value: streakDays + ' d' } : null,
    calories != null ? { label: 'Calorias', value: formatCompact(calories) } : null,
    lastRunDistanceKm != null ? { label: 'Última Corrida', value: formatKm(lastRunDistanceKm) + ' km' } : null,
    lastRunPaceSec != null ? { label: 'Pace Última', value: formatPace(lastRunPaceSec) } : null,
  ].filter(Boolean) as StatItem[];

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && { opacity: 0.85 },
        containerStyle,
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {onPress && (
          <View style={styles.moreRow}>
            <Text style={styles.moreTxt}>Ver mais</Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.65)" />
          </View>
        )}
      </View>

      <View style={styles.grid}>
        {data.slice(0, 8).map((item, i) => (
          <View key={i} style={styles.cell}>
            <Text style={[styles.value, valueStyle]} numberOfLines={1}>
              {item.value}
            </Text>
            <Text style={[styles.label, labelStyle]} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {data.length > 8 && (
        <View style={styles.footerNote}>
          <Text style={styles.noteTxt}>
            +{data.length - 8} métricas ocultas
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/* Types */
interface StatItem {
  label: string;
  value: string;
}

/* Utils */
function formatKm(v?: number) {
  if (!v) return '0';
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', 'k');
  return v % 1 === 0 ? v.toFixed(0) : v.toFixed(1);
}
function formatCompact(v?: number) {
  if (!v) return '0';
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(v);
}
function formatPace(sec?: number) {
  if (!sec || sec <= 0) return '--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}
function formatDuration(totalSec?: number) {
  if (!totalSec || totalSec <= 0) return '--';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h) return `${h}h ${m}m`;
  return `${m}m`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  moreRow: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  moreTxt: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  cell: {
    width: '50%',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  value: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  label: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footerNote: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  noteTxt: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontStyle: 'italic',
  },
  center: { justifyContent: 'center', alignItems: 'center', minHeight: 120 },
  errTxt: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  errHint: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
  /* Skeletons */
  skelTitle: {
    width: 130, height: 16, borderRadius: 8, backgroundColor: '#1C1C1C', marginBottom: 14,
  },
  skelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  skelItem: {
    width: '50%',
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
});