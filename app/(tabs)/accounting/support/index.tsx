import { View } from "react-native";
import React from "react";
import Logo from "@/components/Logo";
import { CardContent } from "@/components/ui/Card/CardContent";
import { Card } from "@/components/ui";
import { ThemedText } from "@/components/ui/ThemedText";

const SupportScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Logo />

      <Card>
        <CardContent>
          <ThemedText>Contact support: ascenciotaxinc@gmail.com</ThemedText>
        </CardContent>
      </Card>
    </View>
  );
};

export default SupportScreen;
