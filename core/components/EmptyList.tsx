import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import React from 'react';
import { View, Text } from 'react-native';

interface EmptyListProps {
  title: string;
  subtitle?: string;
}

export const EmptyList = ({ title, subtitle = '' }: EmptyListProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <ThemedText style={{ fontSize: 16 }}>{title}</ThemedText>
      <Text style={{ color: theme.muted, fontSize: 14 }}>{subtitle}</Text>
    </View>
  );
};
