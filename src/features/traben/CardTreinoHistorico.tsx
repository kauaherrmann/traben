import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Easing,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type TreinoHistorico = {
  id: string;
  titulo: string;
  dataISO: string;
  tipo?: 'treino' | 'intervalado' | 'longão' | 'prova' | 'recuperação';
  distanciaKm: number;
  duracaoSec: number;
  paceSec: number;
  elevacaoGain?: number;
  miniMapaUri?: string;
  improvementPct?: number;
  splitsPaceSec?: number[]; // opcional: ritmos de cada split (km)
};

type Props = {
  treino: TreinoHistorico;
  onPress?: (t: TreinoHistorico) => void;
  style?: ViewStyle;
};

export default function CardHistoricoTreinoHorizontal({ treino, onPress, style }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Animação de seta
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(rotate, {
      toValue: expanded ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [expanded]);

  const dist = fmtDist(treino.distanciaKm);
  const pace = fmtPace(treino.paceSec);
  const tempo = fmtDur(treino.duracaoSec);
  const data = fmtDate(treino.dataISO);
  const elev = treino.elevacaoGain != null ? treino.elevacaoGain + ' m' : undefined;

  const varPct = treino.improvementPct;
  const varColor =
    varPct == null
      ? 'rgba(255,255,255,0.55)'
      : varPct > 0
        ? '#30D158'
        : varPct < 0
          ? '#FF453A'
          : 'rgba(255,255,255,0.55)';

  // Splits para gráfico (gera placeholder se não vier)
  const splits = useMemo<number[]>(() => {
    if (treino.splitsPaceSec && treino.splitsPaceSec.length) return treino.splitsPaceSec;
    const km = Math.max(1, Math.min(12, Math.round(treino.distanciaKm)));
    const base = treino.paceSec || 300;
    return Array.from({ length: km }, (_, i) =>
      base * (0.92 + (Math.sin(i * 0.9) * 0.05) + (i % 5 === 0 ? 0.03 : 0))
    );
  }, [treino]);

  const slowest = Math.max(...splits);
  const fastest = Math.min(...splits);

  function toggleExpand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(v => !v);
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={() => onPress?.(treino)}
        style={({ pressed }) => [styles.base, pressed && { opacity: 0.85 }]}
        android_ripple={{ color: 'rgba(255,255,255,0.07)' }}
      >
        {/* Thumb */}
        <View style={styles.thumb}>
          {treino.miniMapaUri ? (
            <Image source={{ uri: treino.miniMapaUri }} style={styles.thumbImg} />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <View style={styles.fakePolyline} />
            </View>
          )}
        </View>

        {/* Conteúdo principal (resumo) */}
        <View style={styles.col}>
          <View style={styles.topRow}>
            <Text style={styles.titulo} numberOfLines={1}>{treino.titulo}</Text>
            <Text style={styles.data} numberOfLines={1}>{data}</Text>
          </View>

            <View style={styles.metaRow}>
              {treino.tipo && (
                <View style={styles.tipoChip}>
                  <Text style={styles.tipoTxt}>{capitalize(treino.tipo)}</Text>
                </View>
              )}
              {varPct != null && (
                <View style={[styles.varChip, { backgroundColor: varColor + '1A' }]}>
                  <Text style={[styles.varTxt, { color: varColor }]}>
                    {varPct > 0 ? '+' : ''}{varPct.toFixed(Math.abs(varPct) < 10 ? 1 : 0)}%
                  </Text>
                </View>
              )}
            </View>

          <View style={styles.metricsRow}>
            <Metric label="Dist" value={dist} unit="km" />
            <Divider />
            <Metric label="Ritmo" value={pace} />
            <Divider />
            <Metric label="Tempo" value={tempo} />
            {elev && (
              <>
                <Divider />
                <Metric label="Elev" value={elev} />
              </>
            )}
          </View>

          {/* Botão seta (canto inferior direito) */}
          <Pressable
            onPress={toggleExpand}
            style={({ pressed }) => [styles.expandBtn, pressed && { opacity: 0.65 }]}
            hitSlop={10}
          >
            <Animated.View
              style={{
                transform: [{
                  rotate: rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  })
                }]
              }}
            >
              <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.7)" />
            </Animated.View>
          </Pressable>
        </View>
      </Pressable>

      {/* Área expansível */}
      {expanded && (
        <View style={styles.expandArea}>
          {/* Gráfico horizontal simples de pace */}
          <View style={styles.chartRow}>
            {splits.map((p, i) => {
              const norm = (p - fastest) / Math.max(1, (slowest - fastest)); // 0 rápido -> 1 lento
              const h = 8 + (norm * 36); // altura variável
              const color = lerpColor('#0A84FF', '#FF9F0A', norm);
              return (
                <View key={i} style={styles.barWrap}>
                  <View style={[styles.bar, { height: h, backgroundColor: color }]} />
                  <Text style={styles.barLbl}>{i + 1}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.extraInfoRow}>
            <Info label="Ritmo Médio" value={pace} />
            <Info label="Duração" value={tempo} />
            <Info label="Distância" value={dist + ' km'} />
            {elev && <Info label="Elevação" value={elev} />}
          </View>

          <View style={styles.splitLegend}>
            <Legend color="#0A84FF" txt="Mais rápido" />
            <Legend color="#FF9F0A" txt="Mais lento" />
          </View>
        </View>
      )}
    </View>
  );
}

/* Subcomponentes */
function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View style={styles.metricBox}>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}{unit && <Text style={styles.metricUnit}> {unit}</Text>}
      </Text>
      <Text style={styles.metricLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}
function Divider() { return <View style={styles.dividerV} />; }
function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel} numberOfLines={1}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}
function Legend({ color, txt }: { color: string; txt: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendTxt}>{txt}</Text>
    </View>
  );
}

/* Utils */
function fmtDist(km: number) { return km % 1 === 0 ? km.toFixed(0) : km.toFixed(2).replace(/0$/, ''); }
function fmtPace(sec: number) { const m = Math.floor(sec / 60); const s = Math.round(sec % 60); return `${m}:${String(s).padStart(2,'0')}/km`; }
function fmtDur(sec: number) {
  const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600)/60); const s = sec % 60;
  if (h) return `${h}h${m}m`; if (m) return `${m}m${String(s).padStart(2,'0')}s`; return `${s}s`;
}
function fmtDate(iso: string) { try { return new Date(iso).toLocaleDateString(undefined,{ day:'2-digit', month:'short' }); } catch { return ''; } }
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function lerpColor(c1: string, c2: string, t: number) {
  const a = hexToRgb(c1); const b = hexToRgb(c2);
  if (!a || !b) return c1;
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bC = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bC})`;
}
function hexToRgb(hex: string) {
  const h = hex.replace('#','');
  if (h.length === 3) {
    const r = parseInt(h[0]+h[0],16);
    const g = parseInt(h[1]+h[1],16);
    const b = parseInt(h[2]+h[2],16);
    return { r,g,b };
  }
  if (h.length === 6) {
    return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
  }
  return null;
}

/* Styles */
const styles = StyleSheet.create({
  wrapper: { borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',  
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)', },
  base: {
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 110,
  },
  thumb: {
    width: 92,
    backgroundColor: '#0E0E0E',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex:1, justifyContent:'center', alignItems:'center' },
  fakePolyline: {
    width: '68%', height: 46, borderRadius: 120, borderWidth: 4,
    borderColor: '#0A84FF', opacity: 0.32, transform: [{ rotate: '18deg' }],
  },

  col: { flex:1, paddingHorizontal: 12, paddingVertical: 8 },
  topRow: { flexDirection:'row', alignItems:'flex-start', marginBottom: 18 },
  titulo: { flex:1, color:'#FFF', fontSize:15, fontWeight:'700', letterSpacing:0.3 },
  data: { color:'rgba(255,255,255,0.55)', fontSize:10.5, fontWeight:'600', marginLeft:8 },

  metaRow: { flexDirection:'row', alignItems:'center', gap:6, marginBottom: 6 },
  tipoChip: { backgroundColor:'rgba(255,255,255,0.10)', paddingHorizontal:8, paddingVertical:3, borderRadius:8 },
  tipoTxt: { color:'#FFF', fontSize:10, fontWeight:'700' },
  varChip: { paddingHorizontal:6, paddingVertical:3, borderRadius:8 },
  varTxt: { fontSize:10, fontWeight:'700' },

  metricsRow: { flexDirection:'row', alignItems:'center', flexWrap:'nowrap' },
  metricBox: { minWidth: 52 },
  metricValue: { color:'#FFF', fontSize:14, fontWeight:'700', includeFontPadding:false },
  metricUnit: { fontSize:10.5, fontWeight:'600', color:'rgba(255,255,255,0.55)' },
  metricLabel: { color:'rgba(255,255,255,0.55)', fontSize:9, fontWeight:'600', marginTop:1 },
  dividerV: { width:1, height:24, backgroundColor:'rgba(255,255,255,0.08)', marginHorizontal:10, alignSelf:'center' },

  expandBtn: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    padding: 4,
    borderRadius: 8,
  },

  /* Área expandida */
  expandArea: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderTopWidth: 1,                
    borderTopColor: 'rgba(255,255,255,0.07)',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 14,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  barWrap: { alignItems: 'center', flex: 1 },
  bar: {
    width: 8,
    borderRadius: 5,
    backgroundColor: '#0A84FF',
    marginHorizontal: 2,
  },
  barLbl: {
    marginTop: 4,
    fontSize: 8.5,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: '600',
  },

  extraInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoBox: { width: '48%' },
  infoLabel: {
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: { fontSize: 12, color: '#FFF', fontWeight: '700' },

  splitLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendTxt: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.60)',
    fontWeight: '600',
  },
});