import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';

interface ShutterButtonProps {
  onPress: () => void;
}

export const ShutterButton = ({ onPress }: ShutterButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.shutterButton]}>
      <Ionicons name="camera-outline" size={40} color={theme.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
