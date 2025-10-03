import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  FlatList,
} from "react-native";
import { theme } from "./theme";
import { ThemedText } from "./ThemedText";
import { Ionicons } from "@expo/vector-icons";

type SelectContextType = {
  value?: string;
  label?: string;
  setValue: (val: string, label: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  error?: boolean;
  disabled?: boolean;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value?: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  errorTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}
export function Select({
  value,
  onValueChange,
  children,
  error,
  errorMessage,
  helperText,
  disabled,
  placeholder,
  errorTextStyle,
  containerStyle,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string | undefined>(undefined);

  // Optimización: Memorizar setValue para evitar recreaciones
  const setValue = useCallback(
    (val: string, lbl: string) => {
      onValueChange(val);
      setLabel(lbl);
      setOpen(false);
    },
    [onValueChange]
  );

  // Optimización: Memorizar setOpen para evitar recreaciones
  const handleSetOpen = useCallback(
    (val: boolean) => {
      if (!disabled) {
        setOpen(val);
      }
    },
    [disabled]
  );

  // Optimización: Memorizar el valor del contexto
  const contextValue = useMemo(
    () => ({
      value,
      label,
      setValue,
      open,
      setOpen: handleSetOpen,
      error,
      disabled,
    }),
    [value, label, setValue, open, handleSetOpen, error, disabled]
  );

  // Optimización: Memorizar estilos del helper text
  const helperTextStyles = useMemo(
    () => [
      styles.helperTextBase,
      error && [styles.errorMessage, errorTextStyle],
    ],
    [error, errorTextStyle]
  );

  return (
    <View style={containerStyle}>
      <SelectContext.Provider value={contextValue}>
        {children}
      </SelectContext.Provider>
      {/* Show helper text or error message */}
      {(helperText || errorMessage) && (
        <Text style={helperTextStyles}>
          {error ? errorMessage : helperText}
        </Text>
      )}
    </View>
  );
}

// Hook interno
function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within <Select>");
  return ctx;
}

// Trigger (abre el modal y muestra el label seleccionado)
export function SelectTrigger({
  placeholder = "Select...",
  labelText,
  style,
}: {
  placeholder?: string;
  labelText?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { label, setOpen, error, disabled } = useSelectContext();

  // Optimización: Memorizar el handlePress
  const handlePress = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled, setOpen]);

  // Optimización: Memorizar estilos del trigger
  const triggerStyles = useMemo(
    () => [
      styles.trigger,
      error && styles.triggerError,
      disabled && styles.triggerDisabled,
      style,
    ],
    [error, disabled, style]
  );

  // Optimización: Memorizar estilos del label flotante
  const floatingLabelStyles = useMemo(
    () => [
      styles.floatingLabel,
      { color: error ? theme.destructive : theme.primary },
    ],
    [error]
  );

  // Optimización: Memorizar estilos del texto del trigger
  const triggerTextStyles = useMemo(
    () => ({
      color: disabled
        ? theme.mutedForeground
        : error
          ? theme.destructive
          : label
            ? theme.foreground
            : theme.muted,
    }),
    [label, disabled]
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={labelText || placeholder}
      accessibilityState={{ disabled, selected: !!label }}
      accessibilityHint="Tap to open options"
      style={triggerStyles}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      {labelText && (
        <ThemedText style={floatingLabelStyles}>{labelText}</ThemedText>
      )}
      <Text style={triggerTextStyles}>{label || placeholder}</Text>
      {/* Ícono de flecha opcional */}
      <Text style={styles.chevron}>
        <Ionicons
          name="chevron-down-outline"
          color={theme.foreground}
          size={24}
        />
      </Text>
    </TouchableOpacity>
  );
}

// Content (lista de opciones en modal)
export function SelectContent({
  children,
  maxHeight = "60%",
}: {
  children: React.ReactNode;
  maxHeight?: number | `${number}%`;
}) {
  const { open, setOpen, disabled } = useSelectContext();

  // Optimización: Memorizar el handler de cierre
  const handleClose = useCallback(() => {
    if (!disabled) {
      setOpen(false);
    }
  }, [disabled, setOpen]);

  // Optimización: Memorizar estilos del contenido
  const contentStyles = useMemo(
    () => [styles.content, { maxHeight }],
    [maxHeight]
  );

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleClose}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="Close options"
      >
        <TouchableOpacity
          style={contentStyles}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <FlatList
            data={React.Children.toArray(children)}
            renderItem={({ item }) => item as React.ReactElement}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// Item (opción dentro de la lista)
export function SelectItem({
  label,
  value,
  disabled = false,
  style,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const {
    setValue,
    value: selectedValue,
    disabled: selectDisabled,
  } = useSelectContext();

  const isSelected = selectedValue === value;
  const isDisabled = disabled || selectDisabled;

  // Optimización: Memorizar el handler de press
  const handlePress = useCallback(() => {
    if (!isDisabled) {
      setValue(value, label);
    }
  }, [isDisabled, setValue, value, label]);

  // Optimización: Memorizar estilos del item
  const itemStyles = useMemo(
    () => [
      styles.item,
      isSelected && styles.itemSelected,
      isDisabled && styles.itemDisabled,
      style,
    ],
    [isSelected, isDisabled, style]
  );

  // Optimización: Memorizar estilos del texto
  const textStyles = useMemo(
    () => [
      styles.itemText,
      isSelected && styles.itemTextSelected,
      isDisabled && styles.itemTextDisabled,
    ],
    [isSelected, isDisabled]
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      style={itemStyles}
      onPress={handlePress}
      activeOpacity={isDisabled ? 1 : 0.7}
      disabled={isDisabled}
    >
      <Text style={textStyles}>{label}</Text>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Trigger styles
  trigger: {
    minHeight: 52,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: theme.foreground,
    borderRadius: theme.radius,
    backgroundColor: theme.background,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  triggerError: {
    borderColor: theme.destructive,
    borderWidth: 2,
  },
  triggerDisabled: {
    opacity: 0.5,
    backgroundColor: theme.muted + "20",
  },
  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: theme.background,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: 12,
    fontWeight: "500",
  },
  chevron: {
    marginLeft: "auto",
    fontSize: 12,
    color: theme.muted,
  },

  // Modal styles
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: theme.radius,
    padding: 8,
    width: "90%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // Item styles
  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    marginVertical: 1,
  },
  itemSelected: {
    backgroundColor: theme.primary + "15",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemText: {
    fontSize: 16,
    color: "#111",
    flex: 1,
  },
  itemTextSelected: {
    color: theme.primary,
    fontWeight: "600",
  },
  itemTextDisabled: {
    color: theme.mutedForeground,
  },
  checkmark: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: "bold",
    marginLeft: 8,
  },

  // Helper text styles
  helperTextBase: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 4,
    color: theme.mutedForeground,
  },
  errorMessage: {
    color: theme.destructive,
  },
});
