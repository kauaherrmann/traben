import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Footer, { FOOTER_HEIGHT } from '../../src/features/comuns/Footer';
import Header from '@/src/features/comuns/Header';
import CardResumoSemanal from '@/src/features/traben/CardResumoSemanal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TrabenScreen() {

  const insets = useSafeAreaInsets();
  const HEADER_BODY_HEIGHT = 40 + 8; 
  const contentOffsetTop = insets.top + 3 + HEADER_BODY_HEIGHT;
  const bottomPad = FOOTER_HEIGHT + insets.bottom + 12;

 return (
     <View style={styles.container}>
       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
 
       <View style={[styles.headerWrap, { paddingTop: insets.top - 60 }]}>
         <Header
            title="Traben"
            showNotifications
            notificationsBadgeCount={3}
            onPressNotifications={() => console.log('Ir para notificações')}
            showMenu={false}
          />
       </View>
 
         <View style={{ marginTop: 120 }}>
           <CardResumoSemanal
             weekDistanceKm={42.6}
             weeklyGoalKm={60}
             previousWeekDistanceKm={38.1}
             weekRuns={5}
             weekAvgPaceSec={305}
             weekDurationSec={5 * 60 * 60 + 22 * 60}
             weekElevationGain={380}
             dailyDistances={[5.2, 0, 8.1, 10.4, 6.7, 4.2, 8.0]}
             weekRangeLabel="16–22 Set"
             onPress={() => console.log('Abrir detalhes do resumo')}
             containerStyle={{ marginHorizontal: 12 }}
           />
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