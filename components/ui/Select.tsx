import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
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
  errorTextStyle,
  containerStyle,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string | undefined>(undefined);

  // Busca en los children (recursivamente) opciones que tengan props.value y props.label
  const collectItemsFromChildren = useCallback(
    (nodes: React.ReactNode): Array<{ val: string; lbl: string }> => {
      const out: Array<{ val: string; lbl: string }> = [];
      React.Children.forEach(nodes, (child) => {
        if (!React.isValidElement(child)) return;
        const props: any = child.props;
        // Si es un item con value+label lo agrego
        if (
          props &&
          typeof props.value === "string" &&
          typeof props.label === "string"
        ) {
          out.push({ val: props.value, lbl: props.label });
        }
        // Si tiene children, recorro dentro
        if (props && props.children) {
          out.push(...collectItemsFromChildren(props.children));
        }
      });
      return out;
    },
    []
  );

  // Si cambia el value (o los children), intento resolver el label desde las opciones
  useEffect(() => {
    if (!value) {
      setLabel(undefined);
      return;
    }
    const items = collectItemsFromChildren(children);
    const found = items.find((i) => i.val === value);
    if (found && found.lbl !== label) {
      setLabel(found.lbl);
    } else if (!found) {
      // Si no existe la opción en children, dejamos el label como está o undefined
      // aquí podrías usar un fallback (por ejemplo mostrar el value crudo)
      // setLabel(value);
      setLabel(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, children, collectItemsFromChildren]);

  // Memorizar setValue para evitar recreaciones
  const setValue = useCallback(
    (val: string, lbl: string) => {
      onValueChange(val);
      setLabel(lbl);
      setOpen(false);
    },
    [onValueChange]
  );

  const handleSetOpen = useCallback(
    (val: boolean) => {
      if (!disabled) {
        setOpen(val);
      }
    },
    [disabled]
  );

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
      {(helperText || errorMessage) && (
        <Text style={helperTextStyles}>
          {error ? errorMessage : helperText}
        </Text>
      )}
    </View>
  );
}

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within <Select>");
  return ctx;
}

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

  const handlePress = useCallback(() => {
    if (!disabled) {
      setOpen(true);
    }
  }, [disabled, setOpen]);

  const triggerStyles = useMemo(
    () => [
      styles.trigger,
      error && styles.triggerError,
      disabled && styles.triggerDisabled,
      style,
    ],
    [error, disabled, style]
  );

  const floatingLabelStyles = useMemo(
    () => [
      styles.floatingLabel,
      { color: error ? theme.destructive : theme.primary },
    ],
    [error]
  );

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
    [label, disabled, error]
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

export function SelectContent({
  children,
  maxHeight = "60%",
}: {
  children: React.ReactNode;
  maxHeight?: number | `${number}%`;
}) {
  const { open, setOpen, disabled } = useSelectContext();

  const handleClose = useCallback(() => {
    if (!disabled) {
      setOpen(false);
    }
  }, [disabled, setOpen]);

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
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

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

  const handlePress = useCallback(() => {
    if (!isDisabled) {
      setValue(value, label);
    }
  }, [isDisabled, setValue, value, label]);

  const itemStyles = useMemo(
    () => [
      styles.item,
      isSelected && styles.itemSelected,
      isDisabled && styles.itemDisabled,
      style,
    ],
    [isSelected, isDisabled, style]
  );

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
