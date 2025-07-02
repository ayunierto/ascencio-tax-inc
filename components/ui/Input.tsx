import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Animated,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Assuming 'theme' is correctly imported and defined.
import { theme } from './theme';

interface InputProps extends TextInputProps {
  label?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  rootStyle?: StyleProp<ViewStyle>; // Style for the outermost container
  containerStyle?: StyleProp<ViewStyle>; // Style for the bordered container
  inputStyle?: StyleProp<TextStyle>; // Style for the actual <TextInput>
  labelStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  focusedBorderColor?: string;
}

export const Input = ({
  label,
  value = '',
  placeholder,
  leadingIcon,
  trailingIcon,
  error,
  errorMessage,
  helperText,
  rootStyle,
  containerStyle,
  inputStyle,
  labelStyle,
  errorTextStyle,
  focusedBorderColor = theme.primary,
  onFocus,
  onBlur,
  readOnly,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);

  // Usamos useRef para el valor animado para que no se reinicie en cada render.
  const animatedValue = useRef(new Animated.Value(0)).current;

  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  // --- Animation Logic ---
  useEffect(() => {
    // Anima el valor a 1 (flotando) o 0 (placeholder) basado en el estado.
    Animated.timing(animatedValue, {
      toValue: shouldFloat ? 1 : 0,
      duration: 150, // Una duración ligeramente más rápida se siente más responsiva.
      // ¡La mejora clave! Usamos el driver nativo para una animación fluida.
      useNativeDriver: true,
    }).start();
  }, [shouldFloat, animatedValue]);

  // --- Handlers ---
  const handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    setIsFocused(true);
    onFocus?.(event); // Llama al onFocus original si existe.
  };

  const handleBlur = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ): void => {
    setIsFocused(false);
    onBlur?.(event); // Llama al onBlur original si existe.
  };

  // --- Dynamic Styles using useMemo for performance ---

  // Memorizamos los estilos del contenedor para evitar recalcularlos en cada render.
  const computedContainerStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const borderColor = readOnly
      ? theme.mutedForeground
      : error
      ? theme.destructive
      : isFocused
      ? focusedBorderColor
      : theme.input;

    const borderWidth = isFocused || error ? 2 : 1;

    return [styles.containerBase, { borderColor, borderWidth }, containerStyle];
  }, [isFocused, error, readOnly, focusedBorderColor, containerStyle]);

  const animatedLabelStyles = useMemo(() => {
    // El label se mueve hacia arriba y se hace más pequeño.
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -26], // Mueve el label 26px hacia arriba.
    });

    // El label se escala al 85% de su tamaño original.
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.85],
    });

    // El color del label cambia según el foco y el estado de error.
    const color = error
      ? theme.destructive
      : animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.muted, focusedBorderColor],
        });

    return [
      styles.labelBase,
      labelStyle,
      { color },
      // Es crucial que el `transform` esté al final para que la animación funcione.
      { transform: [{ translateY }, { scale }] },
    ];
  }, [animatedValue, labelStyle, error, focusedBorderColor]);

  // Memorizamos los estilos del TextInput.
  const computedInputStyle = useMemo<StyleProp<TextStyle>>(() => {
    return [
      styles.inputBase,
      { color: readOnly ? theme.mutedForeground : theme.primaryForeground },
      inputStyle,
    ];
  }, [readOnly, inputStyle]);

  return (
    <View style={[styles.root, rootStyle]}>
      <View style={computedContainerStyle}>
        <View style={styles.inputWrapper}>
          {leadingIcon && (
            <Ionicons
              name={leadingIcon}
              size={24}
              color={theme.primaryForeground}
              style={styles.icon}
            />
          )}

          <View style={styles.inputArea}>
            {label && (
              <Animated.Text
                style={animatedLabelStyles}
                onPress={() => textInputRef.current?.focus()}
              >
                {label}
              </Animated.Text>
            )}

            <TextInput
              ref={textInputRef}
              style={computedInputStyle}
              value={value}
              onFocus={handleFocus}
              onBlur={handleBlur}
              readOnly={readOnly}
              placeholder={!label ? placeholder : ''}
              placeholderTextColor={theme.muted}
              underlineColorAndroid="transparent"
              {...props}
            />
          </View>

          {trailingIcon && (
            <Ionicons
              name={trailingIcon}
              size={24}
              color={theme.primaryForeground}
              style={styles.icon}
            />
          )}
        </View>
      </View>

      {/* Show helper text or error message */}
      {(helperText || errorMessage) && (
        <Text
          style={[
            styles.helperTextBase,
            error ? [styles.errorText, errorTextStyle] : null,
          ]}
        >
          {error ? errorMessage : helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginBottom: 16,
  },
  containerBase: {
    borderRadius: theme.radius,
    height: 52, // Aumentamos la altura para dar más espacio al label flotante.
    paddingHorizontal: 12,
    backgroundColor: theme.background,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputArea: {
    flex: 1,
    justifyContent: 'center', // Centra el TextInput verticalmente.
  },
  labelBase: {
    position: 'absolute',
    // El origen del transform es el centro por defecto.
    // Lo movemos a la izquierda para que escale desde ahí.
    left: 0,
    // Los estilos de animación (color, transform) se aplican dinámicamente.
    backgroundColor: theme.background, // Para que el label cubra el borde al flotar.
    paddingHorizontal: 4,
  },
  inputBase: {
    // El padding vertical se ajusta para que no se solape con el label.
    // La posición vertical ya está manejada por el `justifyContent` del contenedor.
    height: '100%',
    fontSize: 16,
  },
  icon: {
    // Estilos para los íconos si es necesario.
  },
  helperTextBase: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 4,
    color: theme.mutedForeground,
  },
  errorText: {
    color: theme.destructive,
  },
});
