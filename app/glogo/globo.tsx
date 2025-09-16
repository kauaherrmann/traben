import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function GlogoScreen() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
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