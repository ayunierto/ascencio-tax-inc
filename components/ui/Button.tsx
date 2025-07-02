import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { theme } from './theme';

interface ButtonProps {
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;

  textStyle?: TextStyle;
  containerTextAndIconsStyle?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      children,
      disabled,
      iconLeft,
      iconRight,
      loading,
      onPress,
      style,
      textStyle,
      containerTextAndIconsStyle,
      variant = 'primary',
      size = 'medium',
      ...props
    },
    ref
  ) => {
    const [pressed, setPressed] = useState(false);

    const variantStyles = {
      primary: buttonStyles.primary,
      secondary: buttonStyles.secondary,
      destructive: buttonStyles.destructive,
      outlined: buttonStyles.outlined,
      ghost: buttonStyles.ghost,
    };

    const sizeStyles = {
      small: buttonStyles.small,
      medium: buttonStyles.medium,
      large: buttonStyles.large,
    };

    const variantTextStyles = {
      primary: buttonStyles.textPrimary,
      secondary: buttonStyles.textSecondary,
      destructive: buttonStyles.textDestructive,
      outlined: buttonStyles.textOutlined,
      ghost: buttonStyles.textGhost,
    };

    return (
      <Pressable
        ref={ref}
        onPress={disabled || loading ? () => {} : onPress}
        style={[
          buttonStyles.button,
          variantStyles[variant],
          sizeStyles[size],
          disabled && buttonStyles.disabled,
          loading && buttonStyles.disabled,
          pressed && buttonStyles.disabled,
          style,
        ]}
        onPressIn={() => {
          setPressed(true);
        }}
        onPressOut={() => {
          setPressed(false);
        }}
        {...props}
      >
        {loading ? (
          <View style={buttonStyles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={
                variant === 'outlined'
                  ? theme.foreground
                  : theme.primaryForeground
              }
            />
            <Text
              style={[
                buttonStyles.buttonText,
                variantTextStyles[variant],
                textStyle,
              ]}
            >
              Please wait ...
            </Text>
          </View>
        ) : (
          <View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                justifyContent: 'center',
              },
              containerTextAndIconsStyle,
            ]}
          >
            {iconLeft && iconLeft}
            <Text
              style={[
                buttonStyles.buttonText,
                variantTextStyles[variant],
                disabled && buttonStyles.disabledText,

                textStyle,
              ]}
            >
              {children}
            </Text>
            {iconRight && iconRight}
          </View>
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  primary: {
    backgroundColor: theme.primary,
  },
  secondary: {
    backgroundColor: theme.secondary,
  },
  destructive: {
    backgroundColor: theme.destructive,
  },
  outlined: {
    borderColor: theme.input,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    height: 46,
  },
  medium: {
    height: 52,
  },
  large: {
    height: 58,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textPrimary: {
    color: theme.primaryForeground,
  },
  textSecondary: {
    color: theme.secondaryForeground,
  },
  textDestructive: {
    color: theme.destructiveForeground,
  },
  textOutlined: {
    color: theme.primaryForeground,
  },
  textGhost: {
    color: theme.primaryForeground,
  },
  disabledText: {
    color: '#888',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Adjust spacing as needed
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default Button;
