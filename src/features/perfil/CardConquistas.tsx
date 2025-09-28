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

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Conquista {
  id: string;
  titulo: string;
  nivel?: number;
  raridade?: Rarity;
  progresso?: number;      // 0..1 (se parcial)
  icone?: string;          // nome Ionicons opcional
  concluida?: boolean;
}

export type CardConquistasProps = {
  conquistas?: Conquista[];
  maxMostrar?: number;
  titulo?: string;

  loading?: boolean;
  error?: boolean;

  onPress?: () => void;
  onRetry?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  tituloStyle?: StyleProp<TextStyle>;
};

export default function CardConquistas({
  conquistas,
  maxMostrar = 5,
  titulo = 'Conquistas',
  loading = false,
  error = false,
  onPress,
  onRetry,
  containerStyle,
  tituloStyle,
}: CardConquistasProps) {
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.skelTitle} />
        <View style={styles.skelRow}>
          {Array.from({ length: maxMostrar }).map((_, i) => (
            <View key={i} style={styles.skelMedal} />
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
        <Text style={styles.errHint}>Toque para tentar novamente</Text>
      </Pressable>
    );
  }

  const lista = (conquistas && conquistas.length
    ? conquistas
    : conquistasPlaceholder
  ).slice(); // cópia

  // Ordenar por raridade > nível
  lista.sort((a, b) => (raridadePeso(b.raridade) - raridadePeso(a.raridade)) ||
    ((b.nivel || 0) - (a.nivel || 0)));

  const visiveis = lista.slice(0, maxMostrar);
  const restante = lista.length - visiveis.length;

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
        <Text style={[styles.title, tituloStyle]}>{titulo}</Text>
        {onPress && (
          <View style={styles.moreRow}>
            <Text style={styles.moreTxt}>Ver mais</Text>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
          </View>
        )}
      </View>

      <View style={styles.medalsRow}>
        {visiveis.map(c => (
          <View key={c.id} style={styles.medalWrap}>
            <Medal conquista={c} />
            <Text style={styles.medalLabel} numberOfLines={1}>{c.titulo}</Text>
          </View>
        ))}

        {restante > 0 && (
          <View style={styles.medalWrap}>
            <View style={[styles.medalBase, styles.moreMedal]}>
              <Text style={styles.moreMedalTxt}>+{restante}</Text>
            </View>
            <Text style={styles.medalLabel} numberOfLines={1}>Outras</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

/* Medal component */
function Medal({ conquista }: { conquista: Conquista }) {
  const {
    raridade = 'common',
    nivel,
    progresso,
    icone = iconePorRaridade(raridade),
    concluida = progresso == null || progresso >= 1,
  } = conquista;

  const palette = raridadeCores(raridade);
  const pct = Math.min(1, Math.max(0, progresso ?? 1));

  return (
    <View style={[styles.medalBase, { backgroundColor: palette.bg }]}>
      {/* Anel externo */}
      <View style={[styles.ring, { borderColor: palette.ring }]} />

      {/* Halo / Glow */}
      <View style={[styles.glow, { shadowColor: palette.ring }]} />

      {/* Progresso (barra circular fake) */}
      {!concluida && (
        <View style={styles.progressOverlay}>
          <View style={[styles.progressMask]}>
            <View style={[styles.progressFill, { transform: [{ scaleY: pct }], backgroundColor: palette.ring }]} />
          </View>
        </View>
      )}

      {/* Ícone */}
      <Ionicons
        name={icone as any}
        size={26}
        color={palette.icon}
        style={{ opacity: concluida ? 1 : 0.55 }}
      />

      {/* Nível */}
      {nivel != null && (
        <View style={[styles.levelBadge, { backgroundColor: palette.ring }]}>
          <Text style={styles.levelTxt}>{nivel}</Text>
        </View>
      )}

      {/* Overlay raridade */}
      <View
        pointerEvents="none"
        style={[
          styles.raritySheen,
          {
            borderColor: palette.sheenBorder,
            backgroundColor: palette.sheenBg,
          },
        ]}
      />
    </View>
  );
}

/* Utils */

function raridadePeso(r?: Rarity) {
  switch (r) {
    case 'legendary': return 5;
    case 'epic': return 4;
    case 'rare': return 3;
    case 'uncommon': return 2;
    default: return 1;
  }
}

function iconePorRaridade(r: Rarity): string {
  switch (r) {
    case 'legendary': return 'flame';
    case 'epic': return 'planet';
    case 'rare': return 'diamond';
    case 'uncommon': return 'leaf';
    default: return 'trophy-outline';
  }
}

function raridadeCores(r: Rarity) {
  switch (r) {
    case 'legendary':
      return {
        bg: '#2B1E04',
        ring: '#FFB347',
        icon: '#FFDFA3',
        sheenBg: 'rgba(255,179,71,0.12)',
        sheenBorder: 'rgba(255,179,71,0.35)',
      };
    case 'epic':
      return {
        bg: '#22102B',
        ring: '#BF5AF2',
        icon: '#E5C9FF',
        sheenBg: 'rgba(191,90,242,0.12)',
        sheenBorder: 'rgba(191,90,242,0.35)',
      };
    case 'rare':
      return {
        bg: '#0D1F33',
        ring: '#0A84FF',
        icon: '#B5D9FF',
        sheenBg: 'rgba(10,132,255,0.12)',
        sheenBorder: 'rgba(10,132,255,0.35)',
      };
    case 'uncommon':
      return {
        bg: '#10271A',
        ring: '#30D158',
        icon: '#C7F9D6',
        sheenBg: 'rgba(48,209,88,0.12)',
        sheenBorder: 'rgba(48,209,88,0.35)',
      };
    default:
      return {
        bg: '#1F1F1F',
        ring: '#8E8E93',
        icon: '#FFFFFF',
        sheenBg: 'rgba(255,255,255,0.05)',
        sheenBorder: 'rgba(255,255,255,0.18)',
      };
  }
}

const conquistasPlaceholder: Conquista[] = [
  { id: '1', titulo: 'Maratona', raridade: 'legendary', nivel: 3 },
  { id: '2', titulo: 'Sem Parar', raridade: 'epic', nivel: 5, progresso: 0.75 },
  { id: '3', titulo: '100 Km', raridade: 'rare', nivel: 2 },
  { id: '4', titulo: 'Primeira Corrida', raridade: 'common', nivel: 1, concluida: true },
  { id: '5', titulo: 'Eco Runner', raridade: 'uncommon', progresso: 0.4 },
];

const MEDAL_SIZE = 54;

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: 12,                // antes 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,           // antes 14
  },
  title: {
    color: '#FFF',
    fontSize: 15,               // antes 16
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
    fontSize: 11,               // antes 12
    fontWeight: '600',
  },
  medalsRow: {
    flexDirection: 'row',
    gap: 19,                     // antes 12
  },
  medalWrap: {
    width: MEDAL_SIZE,
  },
  medalLabel: {
    marginTop: 4,                // antes 6
    color: 'rgba(255,255,255,0.70)',
    fontSize: 10.5,              // antes 11
    fontWeight: '600',
    textAlign: 'center',
  },
  medalBase: {
    width: MEDAL_SIZE,
    height: MEDAL_SIZE,
    borderRadius: MEDAL_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: MEDAL_SIZE / 2,
    borderWidth: 3,
    opacity: 0.9,
  },
  glow: {
    position: 'absolute',
    width: MEDAL_SIZE * 0.88,
    height: MEDAL_SIZE * 0.88,
    borderRadius: (MEDAL_SIZE * 0.88) / 2,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  levelBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    paddingHorizontal: 6,        
    paddingVertical: 2,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  levelTxt: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  raritySheen: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: MEDAL_SIZE / 2,
    borderWidth: 1,
  },
  progressOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  progressMask: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: MEDAL_SIZE / 2,
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    height: '100%',
    transform: [{ scaleY: 0 }],
    transformOrigin: 'bottom',
    opacity: 0.20,
  },
  moreMedal: {
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#3A3A3A',
  },
  moreMedalTxt: {
    color: '#FFF',
    fontSize: 16,                // antes 18
    fontWeight: '700',
  },
  /* Skeleton */
  skelTitle: {
    width: 110,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1C1C1C',
    marginBottom: 12,
  },
  skelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skelMedal: {
    width: MEDAL_SIZE,
    height: MEDAL_SIZE,
    borderRadius: MEDAL_SIZE / 2,
    backgroundColor: '#1C1C1C',
  },
  center: { justifyContent: 'center', alignItems: 'center', minHeight: 120 },
  errTxt: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  errHint: { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
});