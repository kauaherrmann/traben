import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Footer from '../../src/components/comuns/Footer';

export default function TrabenScreen() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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