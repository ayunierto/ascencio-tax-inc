import React from "react";

import { View, ActivityIndicator, StyleSheet } from "react-native";
import { theme } from "./ui/theme";
import { ThemedText } from "./ui/ThemedText";

interface LoaderProps {
  message?: string;
}

const Loader = ({ message }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.foreground} size={30} />
      {message && (
        <ThemedText style={{ marginBottom: 10 }}>{message}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default Loader;
