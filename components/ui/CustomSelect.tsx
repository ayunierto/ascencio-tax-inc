import React, { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { theme } from "./theme";
import { ThemedText } from "./ThemedText";

export type CustomSelectItem = {
  label: string;
  value: string;
  disabled?: boolean;
  // optional extra metadata, consumer-defined
  meta?: Record<string, unknown>;
};

export type CustomSelectProps = {
  items: CustomSelectItem[];
  value?: string | null;
  onValueChange?: (
    value: string | null,
    item?: CustomSelectItem | undefined
  ) => void;
  placeholder?: string;
  labelText?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  modalTitle?: string;
  renderItem?: (item: CustomSelectItem, selected: boolean) => React.ReactNode;
};

export function CustomSelect({
  items,
  value,
  onValueChange,
  placeholder = "Select...",
  labelText,
  helperText,
  errorMessage,
  disabled,
  searchable = false,
  searchPlaceholder = "Search...",
  clearable = false,
  modalTitle,
  renderItem,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedItem = useMemo(
    () => items.find((i) => i.value === value) || null,
    [items, value]
  );

  const filteredItems = useMemo(() => {
    if (!searchable || !query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, searchable, query]);

  const handleSelect = (val: string) => {
    const it = items.find((i) => i.value === val);
    onValueChange?.(val, it);
    setOpen(false);
  };

  const handleClear = () => {
    onValueChange?.(null, undefined);
  };

  return (
    <View>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        style={[styles.trigger, disabled && styles.disabled]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {labelText && (
          <ThemedText style={styles.floatingLabel}>{labelText}</ThemedText>
        )}
        <Text
          style={[styles.triggerText, !selectedItem && styles.placeholderText]}
        >
          {selectedItem?.label ?? placeholder}
        </Text>
        {clearable && !!selectedItem && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            style={styles.clearBtn}
          >
            <Text style={styles.clearBtnText}>×</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {(helperText || errorMessage) && (
        <Text style={[styles.helperText, !!errorMessage && styles.errorText]}>
          {errorMessage ?? helperText}
        </Text>
      )}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.modal}>
            {modalTitle ? (
              <Text style={styles.modalTitle}>{modalTitle}</Text>
            ) : null}
            {searchable && (
              <TextInput
                placeholder={searchPlaceholder}
                placeholderTextColor={theme.muted}
                style={styles.search}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
            )}

            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = value === item.value;
                const content = renderItem ? (
                  renderItem(item, selected)
                ) : (
                  <View style={styles.itemRow}>
                    <Text
                      style={[
                        styles.itemText,
                        selected && styles.itemTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selected ? <Text style={styles.checkIcon}>✓</Text> : null}
                  </View>
                );
                return (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      selected && styles.itemSelected,
                      item.disabled && styles.itemDisabled,
                    ]}
                    onPress={() => !item.disabled && handleSelect(item.value)}
                    disabled={item.disabled}
                  >
                    {content}
                  </TouchableOpacity>
                );
              }}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// React Hook Form field wrapper
export type CustomSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Omit<CustomSelectProps, "value" | "onValueChange"> & {
  name: TName;
  control: ControllerProps<TFieldValues, TName>["control"];
  rules?: ControllerProps<TFieldValues, TName>["rules"];
  defaultValue?: string | null;
};

export function CustomSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  rules,
  defaultValue = null,
  ...selectProps
}: CustomSelectFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue as any}
      render={({ field: { value, onChange }, fieldState }) => (
        <CustomSelect
          {...selectProps}
          value={(value ?? null) as string | null}
          onValueChange={(val) => onChange(val)}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
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
  },
  disabled: {
    opacity: 0.5,
  },
  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 15,
    backgroundColor: theme.background,
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: 12,
    color: theme.primary,
  },
  triggerText: {
    fontSize: 14,
    color: theme.foreground,
  },
  placeholderText: {
    color: theme.muted,
  },
  clearBtn: {
    position: "absolute",
    right: 10,
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.card,
  },
  clearBtnText: {
    color: theme.primary,
    fontSize: 18,
    lineHeight: 18,
    marginTop: -2,
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: 4,
    color: theme.mutedForeground,
  },
  errorText: {
    color: theme.destructive,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  search: {
    borderWidth: 1,
    borderColor: theme.input,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    color: "#111",
    backgroundColor: "#fff",
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemSelected: {
    backgroundColor: "#f4f7ff",
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
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
  checkIcon: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
