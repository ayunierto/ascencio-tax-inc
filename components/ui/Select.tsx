// components/ui/Select.tsx
import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import { theme } from "./theme";
import { ThemedText } from "./ThemedText";

type SelectContextType = {
  value?: string;
  label?: string;
  setValue: (val: string, label: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
  value?: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  errorTextStyle?: StyleProp<TextStyle>;
}
export function Select({
  value,
  onValueChange,
  children,
  error,
  errorMessage,
  helperText,
  errorTextStyle,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string | undefined>(undefined);

  return (
    <SelectContext.Provider
      value={{
        value,
        label,
        setValue: (val, lbl) => {
          onValueChange(val);
          setLabel(lbl);
          setOpen(false);
        },
        open,
        setOpen,
      }}
    >
      <>
        {children}
        {/* Show helper text or error message */}
        {(helperText || errorMessage) && (
          <Text
            style={[
              styles.helperTextBase,
              error ? [styles.errorMessage, errorTextStyle] : null,
            ]}
          >
            {error ? errorMessage : helperText}
          </Text>
        )}
      </>
    </SelectContext.Provider>
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
}: {
  placeholder?: string;
  labelText?: string;
}) {
  const { label, setOpen } = useSelectContext();
  return (
    <TouchableOpacity
      style={styles.trigger}
      onPress={() => setOpen(true)}
      activeOpacity={0.7}
    >
      {labelText && (
        <ThemedText
          style={{
            position: "absolute",
            top: -10,
            left: 15,
            backgroundColor: theme.background,
            paddingHorizontal: 4,
            paddingVertical: 0,
            fontSize: 12,
            color: theme.primary,
          }}
        >
          {labelText}
        </ThemedText>
      )}
      <Text style={{ color: label ? theme.foreground : theme.muted }}>
        {label || placeholder}
      </Text>
    </TouchableOpacity>
  );
}

// Content (lista de opciones en modal)
export function SelectContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSelectContext();

  return (
    <Modal visible={open} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)}>
        <View style={styles.content}>{children}</View>
      </TouchableOpacity>
    </Modal>
  );
}

// Item (opción dentro de la lista)
export function SelectItem({ label, value }: { label: string; value: string }) {
  const { setValue } = useSelectContext();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setValue(value, label)}
      activeOpacity={0.7}
    >
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 52,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: theme.foreground,
    borderRadius: theme.radius,
    backgroundColor: theme.background,
    justifyContent: "center",
  },
  triggerText: {
    fontSize: 14,
    color: theme.muted,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  content: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: theme.radius,
    padding: 10,
    maxHeight: "60%",
    overflow: "hidden",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#111",
  },
  helperTextBase: {
    marginTop: -6,
    fontSize: 12,
    paddingLeft: 4,
    color: theme.mutedForeground,
  },
  errorMessage: {
    color: theme.destructive,
  },
});
