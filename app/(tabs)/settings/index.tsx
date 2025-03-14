import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { router } from 'expo-router';

const SettingsScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <View>
        <ThemedText style={{ fontSize: 24, marginBottom: 20 }}>
          Settings
        </ThemedText>

        <TouchableOpacity onPress={() => router.push('/settings/profile')}>
          <Card>
            <View
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}
            >
              <ThemedText style={{ fontSize: 20 }}>Profile</ThemedText>
              <Ionicons
                name="arrow-forward"
                size={24}
                color={theme.foreground}
              />
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
