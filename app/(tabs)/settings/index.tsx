import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui";
import { CardContent } from "@/components/ui/Card/CardContent";
import { Button, ButtonText } from "@/components/ui/Button";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import { theme } from "@/components/ui/theme";

const ListItem = ({
  icon,
  label,
  onPress,
  external = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  external?: boolean;
}) => (
  <Card>
    <CardContent>
      <View style={styles.itemRow}>
        <View style={styles.itemLeft}>
          <Ionicons name={icon} size={22} color={theme.foreground} />
          <ThemedText style={styles.itemLabel}>{label}</ThemedText>
        </View>
        {external ? (
          <Feather name="external-link" size={20} color={theme.foreground} />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.mutedForeground}
          />
        )}
      </View>
    </CardContent>
  </Card>
);

export default function SettingsScreen() {
  const { logout } = useAuthStore();

  return (
    <View style={styles.container}>
      {/* Main content */}
      <View style={styles.content}>
        {/* Account */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ListItem
            icon="person-outline"
            label="My account"
            onPress={() => router.push("/settings/profile")}
          />
          <ListItem
            icon="diamond-outline"
            label="Subscriptions"
            onPress={() => router.push("/settings/subscriptions")}
          />
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Legal</ThemedText>
          <ListItem
            icon="book-outline"
            label="Terms of use"
            external
            onPress={() =>
              Linking.openURL("https://www.ascenciotax.com/termsofuse")
            }
          />
          <ListItem
            icon="shield-checkmark-outline"
            label="Privacy policy"
            external
            onPress={() =>
              Linking.openURL("https://www.ascenciotax.com/privacy")
            }
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button variant="destructive" fullWidth onPress={logout}>
          <ButtonText>Log out</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    gap: 32, // espacio entre secciones
  },
  footer: {
    marginTop: 24, // separación del contenido
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.mutedForeground,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: theme.foreground,
  },
});
