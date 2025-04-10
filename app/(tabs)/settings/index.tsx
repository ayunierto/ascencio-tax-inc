import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";
import { Card } from "@/components/ui";
import { Feather, Ionicons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";
import { router } from "expo-router";
import Divider from "@/components/ui/Divider";
import { CardContent } from "@/components/ui/Card/CardContent";

const SettingsScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <View style={{ gap: 20 }}>
        <ThemedText
          style={{ fontSize: 28, marginBottom: 10, fontWeight: "bold" }}
        >
          Settings
        </ThemedText>

        <View>
          <ThemedText
            style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
          >
            My account
          </ThemedText>

          <TouchableOpacity onPress={() => router.push("/settings/profile")}>
            <Card>
              <CardContent>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                    Update account info
                  </ThemedText>
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={theme.foreground}
                  />
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        </View>

        <View>
          <ThemedText
            style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
          >
            About us
          </ThemedText>

          <Card>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.ascenciotax.com/privacy")
              }
            >
              <CardContent>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                    Terms of use
                  </ThemedText>
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
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>
                    Privacy policy
                  </ThemedText>
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
      </View>
    </View>
  );
};

export default SettingsScreen;
