import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Linking } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { theme } from '@/components/ui/theme';
import ListItem from '@/core/settings/components/ListItem';

export default function SettingsScreen() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    return <Redirect href={'/(tabs)/(home)'} />;
  };

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        {/* Account */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ListItem
            icon="person-outline"
            label="My account"
            onPress={() => router.push('/settings/profile')}
          />
          <ListItem
            icon="diamond-outline"
            label="Subscriptions"
            onPress={() => router.push('/settings/subscriptions')}
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal</ThemedText>
          <ListItem
            icon="book-outline"
            label="Terms of use"
            external
            onPress={() =>
              Linking.openURL('https://www.ascenciotax.com/termsofuse')
            }
          />
          <ListItem
            icon="shield-checkmark-outline"
            label="Privacy policy"
            external
            onPress={() =>
              Linking.openURL('https://www.ascenciotax.com/privacy')
            }
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button variant="destructive" fullWidth onPress={handleLogout}>
          <ButtonText>Log out</ButtonText>
          <ButtonIcon name="log-out-outline" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    gap: 32, // espacio entre secciones
  },
  footer: {
    marginTop: 24, // separación del contenido
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.mutedForeground,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: theme.foreground,
  },
});
