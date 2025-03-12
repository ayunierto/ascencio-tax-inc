import React from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from './ui/theme';
import { ThemedText } from './ui/ThemedText';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message }: LoaderProps) => {
  return (
    <View style={styles.container}>
      {message && (
        <ThemedText style={{ marginBottom: 10 }}>{message}</ThemedText>
      )}
      <ActivityIndicator color={theme.foreground} size={30} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
