import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";
import { ThemedText } from "@/components/ui/ThemedText";
import { Button, ButtonText } from "@/components/ui/Button";

interface EmptyContentProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onRetry?: () => void;
}

export const EmptyContent = ({ title, subtitle = "", icon, onRetry }: EmptyContentProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 6,
      }}
    >
      <Ionicons name={icon ? icon : "information-circle-outline"} size={48} color={theme.foreground} />
      <ThemedText style={{ fontSize: 16 }}>{title}</ThemedText>
      <ThemedText style={{ color: theme.muted, fontSize: 14 }}>{subtitle}</ThemedText>

      {onRetry && (
        <Button onPress={onRetry} size="sm">
          <ButtonText>Try again</ButtonText>
        </Button>
      )}
    </View>
  );
};
