import React, { useState, useRef, useEffect } from 'react'; // Import useEffect and useRef
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  Text,
  type TextInputProps,
  Animated,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData, // Import Animated
} from 'react-native';
// Assuming theme is defined and has properties like primary, background, input, mutedForeground, primaryForeground, radius
import { theme } from './theme';
// Assuming ThemedText is a component that applies theme styles to Text,
// but for animation, we'll use Animated.Text directly and apply styles.
// If ThemedText is critical, you might need to make it Animated compatible.
// import { ThemedText } from './ThemedText'; // Not used directly for the animated part

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
  focusedBorderColor?: string;
  label?: string;
  placeholder?: string; // This will be the native placeholder when label is NOT floating
  value?: string;
  onChangeText?: (text: string) => void;
  readOnly?: boolean; // Added readOnly prop type
  containerStyle?: StyleProp<ViewStyle>; // Add container style prop
  labelStyle?: StyleProp<TextStyle>; // Add label style prop for base styles
  errorTextStyle?: StyleProp<TextStyle>; // Add error text style prop
  error?: boolean; // Add error prop to influence label/border color
  errorMessage?: string; // Add prop for error message text
  helperText?: string; // Add prop for helper text
}

export const Input = ({
  label,
  placeholder, // Renamed from placeholder to use for native placeholder when label is down
  value = '',
  onChangeText,
  placeholderTextColor = theme.muted, // Default placeholder color from theme
  focusedBorderColor = theme.primary, // Default focused border color
  style,
  readOnly,
  containerStyle, // Use container style
  labelStyle, // Use label style
  errorTextStyle, // Use error text style
  error, // Use error prop
  errorMessage, // Use error message
  helperText, // Use helper text
  onFocus,
  onBlur,
  ...props // Capture all other TextInputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  // No need for inputValue state, use 'value' prop directly as it's a controlled component

  // Animated value for the label position/size/color transition (0 = placeholder position, 1 = floating position)
  const animatedIsFloating = useRef(new Animated.Value(0)).current;

  // --- Animation Logic ---
  useEffect(() => {
    // Trigger animation based on whether the input is focused OR has text
    const shouldFloat = isFocused || (value && value.length > 0);

    Animated.timing(animatedIsFloating, {
      toValue: shouldFloat ? 1 : 0, // Animate to 1 (floating) or 0 (placeholder)
      duration: 200, // Animation duration in ms
      useNativeDriver: false, // Layout animations often require useNativeDriver: false
    }).start();
  }, [isFocused, value, animatedIsFloating]); // Re-run effect when focus or value changes

  // --- Interpolated Styles for the Animated Label ---
  const animatedTop = animatedIsFloating.interpolate({
    inputRange: [0, 1],
    outputRange: [14, -8], // Interpolate from default top (placeholder) to floating top
  });

  const animatedLeft = animatedIsFloating.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 16], // Interpolate from default left (paddingHorizontal) to floating left
  });

  const animatedFontSize = animatedIsFloating.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12], // Interpolate from default font size to floating font size
  });

  const animatedPaddingHorizontal = animatedIsFloating.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4], // Interpolate from default padding to floating padding (for background)
  });

  // Interpolate label color: Default/Placeholder color -> Focused/Filled color -> Error color
  // We need to handle 3 states: Default, Focused/Filled, Error
  // A simpler interpolation is between 2 states. For 3+, you might chain interpolations or handle color separately.
  // Let's interpolate between default and focused/filled color. Error overrides.
  const animatedLabelColor = animatedIsFloating.interpolate({
    inputRange: [0, 1],
    outputRange: [placeholderTextColor, focusedBorderColor], // Interpolate from placeholder color to focused color
  });

  // --- Determine Border Color and Width (same logic as before) ---
  const borderColor = readOnly
    ? theme.mutedForeground // Muted color when readOnly
    : error
    ? theme.destructive // Error color overrides focused
    : isFocused
    ? focusedBorderColor // Focused color
    : theme.input; // Default border color

  const borderWidth = isFocused || error ? 2 : 1; // Thicker when focused or error

  // --- Handlers for native TextInput events ---
  const _handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    setIsFocused(true);
    if (onFocus) {
      onFocus(event); // Call original prop
    }
  };

  const _handleBlur = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(event); // Call original prop
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Animated Label */}
      {label && (
        <Animated.Text
          style={[
            styles.labelBase, // Apply base label styles (position absolute, etc.)
            labelStyle, // Apply user provided label styles
            {
              top: animatedTop, // Apply animated top position
              left: animatedLeft, // Apply animated left position
              fontSize: animatedFontSize, // Apply animated font size
              paddingHorizontal: animatedPaddingHorizontal, // Apply animated horizontal padding
              color: error ? theme.destructive : animatedLabelColor, // Apply error color if error, otherwise animated color
              backgroundColor: theme.background, // Background to cover the border
              zIndex: 2, // Ensure label is above the border
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}

      <TextInput
        style={[
          styles.inputBase, // Apply base input styles (height, padding, etc.)
          style, // Apply user provided input styles
          {
            // Apply conditional border styles
            borderColor: borderColor,
            borderWidth: borderWidth, // Use borderWidth for all sides for simplicity or adjust as needed
            // If you want borderBottom only:
            // borderBottomColor: borderColor,
            // borderBottomWidth: borderWidth,
            // borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: theme.input // Example for outlined look
            borderRadius: theme.radius, // Keep border radius
            paddingHorizontal: 20, // Keep horizontal padding inside border
            height: 48, // Keep height
          },
          // Apply color based on readOnly state
          { color: readOnly ? theme.mutedForeground : theme.primaryForeground },
        ]}
        // Use native placeholder only when label is NOT floating
        placeholder={isFocused && value.length === 0 ? placeholder : ''}
        placeholderTextColor={placeholderTextColor}
        readOnly={readOnly}
        value={value} // Use value prop directly
        onChangeText={onChangeText} // Use handler for prop update
        onFocus={_handleFocus} // Use custom focus handler
        onBlur={_handleBlur} // Use custom blur handler
        underlineColorAndroid="transparent" // Hide default Android underline
        {...props} // Spread other TextInputProps
      />

      {/* Helper or Error Text */}
      {(helperText || errorMessage) && (
        <Text
          style={[
            styles.helperText,
            error ? styles.errorText : null,
            errorTextStyle,
          ]}
        >
          {error ? errorMessage : helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    // marginBottom: 20,
    // Position relative is often needed for absolute children, though sometimes defaults handle it
    // position: 'relative',
  },
  labelBase: {
    position: 'absolute',
    // Initial top/left/fontSize/paddingHorizontal are set via interpolation outputRange
    // backgroundColor and zIndex are set inline in component
    fontSize: 12, // Base font size - animated from 14 to 12
  },
  inputBase: {
    // Base styles that define the input size, padding, etc.
    // borderBottomWidth: 1, // Default border width - animated
    // borderBottomColor: '#ccc', // Default border color - animated
    // height: 48, // Set height
    // paddingHorizontal: 20, // Set padding
    // borderRadius: theme.radius, // Set border radius
    // color: theme.primaryForeground, // Default text color
    // These base styles are now defined inline in the component's style prop
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: 'red',
  },
});

// Helper type for safety when checking value length
export function isStringWithContent(value: string): value is string {
  return typeof value === 'string' && value.length > 0;
}
