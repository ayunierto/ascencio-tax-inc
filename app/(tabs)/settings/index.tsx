import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui";
import { Feather, Ionicons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";
import { router } from "expo-router";
import Divider from "@/components/ui/Divider";
import { CardContent } from "@/components/ui/Card/CardContent";
import { useAuthStore } from "@/core/auth/store/useAuthStore";
import Button from "@/components/ui/Button";

const SettingsScreen = () => {
  const { logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <View style={styles.firstColumn}>
        <ThemedText style={styles.title}>Settings</ThemedText>

        <TouchableOpacity onPress={() => router.push("/settings/profile")}>
          <Card>
            <CardContent>
              <View style={styles.cardContent}>
                <View style={styles.cardContentLeft}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={theme.foreground}
                  />
                  <ThemedText style={styles.cardText}>My account</ThemedText>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={theme.foreground}
                />
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/settings/subscriptions")}
        >
          <Card>
            <CardContent>
              <View style={styles.cardContent}>
                <View style={styles.cardContentLeft}>
                  <Ionicons
                    name="diamond-outline"
                    size={24}
                    color={theme.foreground}
                  />
                  <ThemedText style={styles.cardText}>Subscriptions</ThemedText>
                </View>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={theme.foreground}
                />
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>

        <Card>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.ascenciotax.com/privacy")
            }
          >
            <CardContent>
              <View style={styles.cardContent}>
                <View style={styles.cardContentLeft}>
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color={theme.foreground}
                  />
                  <ThemedText style={styles.cardText}>Terms of use</ThemedText>
                </View>
                <Feather
                  color={theme.foreground}
                  name="external-link"
                  size={24}
                />
              </View>
            </CardContent>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.ascenciotax.com/termsofuse")
            }
          >
            <CardContent>
              <View style={styles.cardContent}>
                <View style={styles.cardContentLeft}>
                  <Ionicons
                    name="book-outline"
                    size={24}
                    color={theme.foreground}
                  />
                  <ThemedText style={styles.cardText}>
                    Privacy policy
                  </ThemedText>
                </View>
                <Feather
                  color={theme.foreground}
                  name="external-link"
                  size={24}
                />
              </View>
            </CardContent>
          </TouchableOpacity>
        </Card>
      </View>

      <Button
        title="Log out"
        iconRight="log-out-outline"
        variant="outline"
        onPress={logout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "space-between" },
  title: { fontSize: 28, marginBottom: 10, fontWeight: "bold" },
  firstColumn: { gap: 10 },
  cardContent: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  cardContentLeft: { flexDirection: "row", alignItems: "center" },
  cardText: { fontSize: 16, marginLeft: 10 },
});

export default SettingsScreen;
