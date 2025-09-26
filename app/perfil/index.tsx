import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { FOOTER_HEIGHT } from '../../src/features/comuns/Footer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '../../src/features/comuns/Header';
export default function PerfilScreen() {
   const insets = useSafeAreaInsets();
  const padBottom = FOOTER_HEIGHT + insets.bottom + 16;

  const userName = 'Kauaherrmann';

 return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header
          title="Perfil"
          showTitle
          showMenu
          onPressMenu={() => console.log('Abrir menu do perfil')}
        />
      </View>
      {/* ...conteúdo da tela... */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontSize: 20, fontWeight: '600' },
});