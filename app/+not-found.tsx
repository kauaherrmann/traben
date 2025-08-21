import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela não encontrada</Text>
      <Link href="/" style={styles.link}>
        Voltar para o Mapa
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#111' },
  link: { color: '#0a7ea4', fontWeight: '600' },
});