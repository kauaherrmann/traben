import React, { useMemo } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

export type CardResumoSemanalProps = {
  weekDistanceKm?: number;
  weekRuns?: number;
  weekDurationSec?: number;
  weekAvgPaceSec?: number;
  weekElevationGain?: number;
  previousWeekDistanceKm?: number;
  weeklyGoalKm?: number;
  dailyDistances?: number[];   // 7 valores
  title?: string;
  weekRangeLabel?: string;     // ex: 16–22 Set
  loading?: boolean;
  error?: boolean;
  onPress?: () => void;
  onRetry?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  accentColor?: string;
  dangerColor?: string;
  distanceTextStyle?: StyleProp<TextStyle>;
};

export default function CardResumoSemanal({
  weekDistanceKm = 0,
  weekRuns = 0,
  weekDurationSec = 0,
  weekAvgPaceSec,
  weekElevationGain,
  previousWeekDistanceKm = 0,
  weeklyGoalKm = 0,
  dailyDistances = [],
  title = 'Resumo semanal',
  weekRangeLabel,
  loading = false,
  error = false,
  onPress,
  onRetry,
  containerStyle,
  accentColor,
  dangerColor = '#FF3B30',
  distanceTextStyle,
}: CardResumoSemanalProps) {

  const autoAccent = useMemo(() => {
    if (accentColor) return accentColor;
    const pct = weeklyGoalKm > 0 ? (weekDistanceKm / weeklyGoalKm) : 0;
    if (pct >= 1) return '#34C759';
    if (pct >= 0.6) return '#d8eb1d';
    return '#0A84FF';
  }, [accentColor, weeklyGoalKm, weekDistanceKm]);

  const trend = useMemo(() => {
    if (!previousWeekDistanceKm) return null;
    const diff = weekDistanceKm - previousWeekDistanceKm;
    if (diff === 0) return { icon: 'remove-outline', color: 'rgba(255,255,255,0.55)', pct: 0 };
    const pct = (diff / previousWeekDistanceKm) * 100;
    return {
      icon: diff > 0 ? 'trending-up-outline' : 'trending-down-outline',
      color: diff > 0 ? autoAccent : dangerColor,
      pct,
    };
  }, [previousWeekDistanceKm, weekDistanceKm, autoAccent, dangerColor]);

  const progressPct = useMemo(() => {
    if (!weeklyGoalKm) return 0;
    return Math.min(1, weekDistanceKm / weeklyGoalKm);
  }, [weeklyGoalKm, weekDistanceKm]);

  const pace = formatPace(weekAvgPaceSec);
  const duration = formatDuration(weekDurationSec);

  const spark = useMemo(() => {
    if (dailyDistances.length !== 7) return [];
    const max = Math.max(...dailyDistances, 0.1);
    return dailyDistances.map(v => v / max);
  }, [dailyDistances]);

  /* Loading Skeleton */
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.skelTitle} />
        <View style={styles.skelMainRow}>
          <View style={styles.skelBig} />
          <View style={styles.skelStats}>
            <View style={styles.skelLine} />
            <View style={styles.skelLine} />
            <View style={styles.skelLine} />
            <View style={styles.skelLine} />
          </View>
        </View>
        <View style={styles.skelProgress} />
        <View style={styles.skelSpark} />
      </View>
    );
  }

  if (error) {
    return (
      <Pressable
        onPress={onRetry}
        style={[styles.container, styles.errorState, containerStyle]}
      >
        <Text style={styles.errorTxt}>Falha ao carregar</Text>
        <Text style={styles.retryHint}>Toque para tentar novamente</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir detalhes do resumo semanal"
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.85 },
        containerStyle,
      ]}
    >
      {/* Overlay sutil de iluminação */}
      <LinearGradient
        colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.01)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Cabeçalho */}
      <View style={styles.headerRow}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={styles.title}>{title}</Text>
          {weekRangeLabel && (
            <Text style={styles.range}>{weekRangeLabel}</Text>
          )}
        </View>
        {trend && (
          <View style={[styles.trendChip, { backgroundColor: trend.color + '1A' }]}>
            <Ionicons name={trend.icon as any} size={14} color={trend.color} />
            <Text style={[styles.trendText, { color: trend.color }]}>
              {trend.pct > 0 ? '+' : ''}{trend.pct.toFixed(Math.abs(trend.pct) < 10 ? 1 : 0)}%
            </Text>
          </View>
        )}
      </View>

      {/* Distância principal + Chips */}
      <View style={styles.mainRow}>
        <View style={styles.leftCol}>
          <Text style={[styles.distanceValue, distanceTextStyle]}>
            {formatKm(weekDistanceKm)}
            <Text style={styles.distanceUnit}> km</Text>
          </Text>

          {weeklyGoalKm > 0 && (
            <Text style={styles.goalText}>
              Meta {formatKm(weeklyGoalKm)} km ({(progressPct * 100).toFixed(0)}%)
            </Text>
          )}

          <View style={styles.chipsRow}>
            <Chip label="Corridas" value={String(weekRuns)} />
            <Chip label="Pace" value={pace} />
          </View>
          <View style={styles.chipsRow}>
            <Chip label="Tempo" value={duration} />
            {typeof weekElevationGain === 'number' && (
              <Chip label="Elevação" value={weekElevationGain + ' m'} />
            )}
          </View>
        </View>

        {/* Barra radial fake + progresso linear híbrido */}
        <View style={styles.progressPanel}>
          <GoalRing pct={progressPct} color={autoAccent} />
          <View style={styles.progressLinearWrapper}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPct * 100}%`,
                    backgroundColor: autoAccent,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Sparkline (7 dias) */}
      {spark.length === 7 && (
        <View style={styles.sparkWrapper}>
          {spark.map((p, i) => (
            <View key={i} style={styles.sparkBarContainer}>
              <View
                style={[
                  styles.sparkBar,
                  {
                    height: Math.max(4, 40 * p),
                    backgroundColor: autoAccent,
                    opacity: 0.35 + 0.65 * p,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

/* Sub Components */
function Chip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipValue}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

// “Anel” simples usando dois semicirculos (fake ring)
function GoalRing({ pct, color }: { pct: number; color: string }) {
  const angle = Math.min(1, Math.max(0, pct)) * 360;
  const rightFill = angle > 180 ? 180 : angle;
  const leftFill = angle > 180 ? angle - 180 : 0;
  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringBase} />
      <View
        style={[
          styles.ringHalf,
          styles.ringRight,
          { transform: [{ rotate: `${rightFill}deg` }], borderColor: color },
        ]}
      />
      <View
        style={[
          styles.ringHalf,
          styles.ringLeft,
          { transform: [{ rotate: `${leftFill}deg` }], borderColor: color },
        ]}
      />
      <View style={styles.ringCenter}>
        <Text style={styles.ringPct}>{(pct * 100).toFixed(0)}%</Text>
      </View>
    </View>
  );
}

/* Utils */
function formatKm(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(1).replace('.0', '') + 'k';
  if (v % 1 === 0) return v.toFixed(0);
  return v.toFixed(1);
}
function formatPace(sec?: number) {
  if (!sec || sec <= 0) return '--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}/km`;
}
function formatDuration(totalSec: number) {
  if (!totalSec || totalSec <= 0) return '--';
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 26,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  range: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  trendChip: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  leftCol: {
    flex: 1.4,
  },
  distanceValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF',
    includeFontPadding: false,
  },
  distanceUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
  },
  goalText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  chipValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
  },
  progressPanel: {
    flex: 1,
    alignItems: 'center',
    gap: 14,
  },
  progressLinearWrapper: {
    width: '100%',
  },
  progressTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
  },
  sparkWrapper: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
  },
  sparkBarContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sparkBar: {
    width: 6,
    borderRadius: 3,
  },
  /* Goal ring */
  ringContainer: {
    width: 90,
    height: 90,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBase: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  ringHalf: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringRight: {
    transformOrigin: 'center',
  },
  ringLeft: {
    transformOrigin: 'center',
  },
  ringCenter: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPct: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  /* Skeletons */
  skelTitle: { width: 140, height: 16, borderRadius: 8, backgroundColor: '#1C1C1C', marginBottom: 12 },
  skelMainRow: { flexDirection: 'row', gap: 18 },
  skelBig: { width: 140, height: 50, borderRadius: 12, backgroundColor: '#1C1C1C' },
  skelStats: { flex: 1, gap: 8 },
  skelLine: { width: '85%', height: 16, borderRadius: 6, backgroundColor: '#1C1C1C' },
  skelProgress: { marginTop: 16, width: '100%', height: 10, borderRadius: 6, backgroundColor: '#1C1C1C' },
  skelSpark: { marginTop: 18, width: '100%', height: 44, borderRadius: 10, backgroundColor: '#1C1C1C' },

  errorState: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  errorTxt: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  retryHint: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
});