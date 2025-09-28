import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Header from '@/src/features/comuns/HeaderFlutuante';

export default function GlogoScreen() {
    const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Header
          title="Glogo"
          showTitle
          showSearch
          showNotifications
          notificationsBadgeCount={2}
          onPressNotifications={() => router.push('/notificacoes')}
          onSubmitSearch={(q) => console.log('Buscar:', q)}
          blurIntensity={40}
        />
      <View style={styles.center}>
        <Text style={styles.txt}>Tela Glogo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontSize: 20, fontWeight: '600' },
});