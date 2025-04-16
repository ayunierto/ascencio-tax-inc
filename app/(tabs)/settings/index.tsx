import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui';
import { Feather, Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { router } from 'expo-router';
import Divider from '@/components/ui/Divider';
import { CardContent } from '@/components/ui/Card/CardContent';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Button from '@/components/ui/Button';

const SettingsScreen = () => {
  const { logout } = useAuthStore();

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={{ gap: 10 }}>
          <ThemedText
            style={{ fontSize: 28, marginBottom: 10, fontWeight: 'bold' }}
          >
            Settings
          </ThemedText>

          <TouchableOpacity onPress={() => router.push('/settings/profile')}>
            <Card>
              <CardContent>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="person-outline"
                      size={24}
                      color={theme.foreground}
                    />
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                      My account
                    </ThemedText>
                  </View>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={theme.foreground}
                  />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/settings/subscriptions')}
          >
            <Card>
              <CardContent>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="diamond-outline"
                      size={24}
                      color={theme.foreground}
                    />
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                      Subscriptions
                    </ThemedText>
                  </View>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={theme.foreground}
                  />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>

          <Card>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.ascenciotax.com/privacy')
              }
            >
              <CardContent>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="book-outline"
                      size={24}
                      color={theme.foreground}
                    />
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                      Terms of use
                    </ThemedText>
                  </View>
                  <Feather
                    color={theme.foreground}
                    name="external-link"
                    size={24}
                  />
                </View>
              </CardContent>
            </TouchableOpacity>

            <Divider />

            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.ascenciotax.com/termsofuse')
              }
            >
              <CardContent>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name="book-outline"
                      size={24}
                      color={theme.foreground}
                    />
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                      Privacy policy
                    </ThemedText>
                  </View>
                  <Feather
                    color={theme.foreground}
                    name="external-link"
                    size={24}
                  />
                </View>
              </CardContent>
            </TouchableOpacity>
          </Card>
        </View>

        <Button
          iconRight={
            <Ionicons
              name="log-out-outline"
              size={24}
              color={theme.destructiveForeground}
            />
          }
          variant="destructive"
          onPress={logout}
        >
          <ThemedText>Log out</ThemedText>
        </Button>
      </View>
    </View>
  );
};

export default SettingsScreen;
