import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { FOOTER_HEIGHT } from '../../src/components/comuns/Footer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const padBottom = FOOTER_HEIGHT + insets.bottom + 16;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.content, { paddingBottom: padBottom }]}>
        <Text style={styles.txt}>Tela Perfil</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070705' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontSize: 20, fontWeight: '600' },
});