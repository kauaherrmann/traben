import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, usePathname, router } from 'expo-router';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer, { FOOTER_HEIGHT, type TabPath } from '../src/components/comuns/Footer';
import type { Href } from 'expo-router';

function LayoutInner() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Slot />
      </View>
      <View
        style={[
          styles.footerWrap,
          {
            height: FOOTER_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: '#000', // <- cobre toda a área inferior
          },
        ]}
      >
        <Footer
          activePath={pathname}
          onNavigate={(path: TabPath) => {
            if (pathname !== path) router.push(path as Href);
          }}
          backgroundColor="#000"
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LayoutInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1 },
  footerWrap: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
  },
});