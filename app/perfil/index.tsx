import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { FOOTER_HEIGHT } from '../../src/features/comuns/Footer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../src/features/comuns/Header';
import CardPerfil from '@/src/features/perfil/CardPerfil';
import CardEstatisticasPerfil from '@/src/features/perfil/CardResumoEstatisticas';
import CardConquistas from '@/src/features/perfil/CardConquistas';



export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
const fotoPerfil = require('../../assets/images/Perfil.jpg');

  // Altura aproximada do header visível (linha de 44 + paddings inferiores)
  const HEADER_BODY_HEIGHT = 40 + 8; // (row 44 + paddingBottom 8 no Header)
  // Espaço que precisamos empurrar o conteúdo para baixo:
  const contentOffsetTop = insets.top + 3 + HEADER_BODY_HEIGHT;

  const bottomPad = FOOTER_HEIGHT + insets.bottom + 12;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header absoluto (não altera) */}
      <View style={[styles.headerWrap, { paddingTop: insets.top - 60 }]}>
        <Header
          title="@Kauaherrmann"
          showTitle
          showMenu
          onPressMenu={() => console.log('Abrir menu do perfil')}
        />
      </View>

      {/* Conteúdo fixo (sem scroll) */}
      <View style={[styles.content, { paddingBottom: bottomPad, paddingTop: contentOffsetTop }]}>
        <CardPerfil
          avatarSource={fotoPerfil}
          totalKm={128.4}
          runsCount={57}
          connections={342}
          averagePaceSeconds={320}
          onPressConnections={() => console.log('Ver conexões')}
          onPressAvatar={() => console.log('Alterar foto')}
          onPressShare={() => console.log('Compartilhar perfil')}
          onPressEdit={() => console.log('Editar perfil')}
          sideStatsLift={16}
          containerStyle={{ marginHorizontal: 10 }}
        />

        
          <View style={{ marginTop: 2 }}>
           <CardEstatisticasPerfil
             totalKm={128.4}
             runsCount={57}
             averagePaceSec={320}
             totalDurationSec={5 * 3600 + 22 * 60}
             connections={342}
             elevationGain={380}
             longestRunKm={18.6}
             bestPaceSec={295}
             streakDays={12}
             calories={12450}
             lastRunDistanceKm={8.2}
             lastRunPaceSec={305}
             onPress={() => console.log('Ver mais estatísticas')}
             containerStyle={{ marginHorizontal: 10 }}
           />
        </View>
        <View style={{ marginTop: 12 }}>
         <CardConquistas
           onPress={() => console.log('Abrir todas conquistas')}
           containerStyle={{ marginHorizontal: 10 }}
         />
       </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  headerWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
});