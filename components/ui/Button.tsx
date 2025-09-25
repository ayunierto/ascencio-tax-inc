import React from "react";
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        buttonVariants[variant],
        buttonSizes[size],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {({ pressed }) => (
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              color={textVariants[variant].color}
              size="small"
              style={{ marginRight: 6 }}
            />
          ) : (
            iconLeft && (
              <Ionicons
                name={iconLeft}
                size={iconSizes[size]}
                color={textVariants[variant].color}
                style={{ marginRight: 6 }}
              />
            )
          )}

          <Text
            style={[
              styles.textBase,
              textVariants[variant],
              textSizes[size],
              (disabled || loading) && styles.textDisabled,
            ]}
          >
            {loading ? "Please wait..." : title}
          </Text>

          {!loading && iconRight && (
            <Ionicons
              name={iconRight}
              size={iconSizes[size]}
              color={textVariants[variant].color}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

// Base styles
const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
  textBase: {
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  textDisabled: {
    color: "#777",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
});

// Variants
const buttonVariants: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: "#007bff",
  },
  secondary: {
    backgroundColor: "#6c757d",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007bff",
  },
};

const textVariants: Record<ButtonVariant, TextStyle> = {
  primary: { color: "#fff" },
  secondary: { color: "#fff" },
  outline: { color: "#007bff" },
};

// Sizes
const buttonSizes: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12 },
  md: { paddingVertical: 10, paddingHorizontal: 16 },
  lg: { paddingVertical: 14, paddingHorizontal: 20 },
};

const textSizes: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
};

const iconSizes: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default Button;
