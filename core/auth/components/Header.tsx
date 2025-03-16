import React from 'react';
import { View, Text } from 'react-native';
import { Href, router } from 'expo-router';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';

interface HeaderProps {
  title: string;
  subtitle?: string;
  link?: Href;
  linkText?: string;
}

const Header = ({
  link,
  linkText = '',
  subtitle,
  title,
}: HeaderProps): JSX.Element => {
  return (
    <View style={{ gap: 20 }}>
      <ThemedText style={{ fontSize: 35, textAlign: 'center' }}>
        {title}
      </ThemedText>
      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
        {subtitle && <ThemedText>{subtitle}</ThemedText>}
        {link && (
          <Text
            onPress={() => router.replace(link)}
            style={{ color: theme.primary, textDecorationLine: 'underline' }}
          >
            {linkText ? linkText : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Header;
