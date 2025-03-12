import React from 'react';
import {
  StyleProp,
  TextInput,
  TextStyle,
  type TextInputProps,
} from 'react-native';
import { theme } from './theme';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
  focusedBorderColor?: string; // Add a prop for the focused border color
}

export const Input = ({
  placeholderTextColor,
  focusedBorderColor = theme.primary,
  style,
  readOnly,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
          borderRadius: theme.radius,
          paddingHorizontal: 20,
          height: 48,
          color: readOnly ? theme.mutedForeground : theme.primaryForeground,
          borderColor: readOnly
            ? theme.mutedForeground
            : isFocused
            ? focusedBorderColor
            : theme.input, // Conditional border color
        },
        style,
      ]}
      onFocus={() => setIsFocused(true)}
      onEndEditing={() => {
        setIsFocused(false);
      }}
      placeholderTextColor={placeholderTextColor || '#666'}
      readOnly={readOnly}
      {...props}
    />
  );
};
