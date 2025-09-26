import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Footer from '../../src/features/comuns/Footer';
import Header from '@/src/features/comuns/HeaderFlutuante';

export default function TrabenScreen() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Header
        title="Traben"
        showNotifications
        notificationsBadgeCount={3}
        onPressNotifications={() => console.log('notificações')}
        backgroundColor="#070705"
        elevated
        bottomDivider
      />
      <View style={styles.content}>
        <Text style={styles.txt}>Tela Traben</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontSize: 20, fontWeight: '600' },
});