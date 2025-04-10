import { StyleSheet, Linking } from "react-native";
import React from "react";
import { ThemedText } from "./ui/ThemedText";
import { theme } from "./ui/theme";

const TermsAndPrivacy = () => {
  return (
    <ThemedText>
      By signing in you accept the{" "}
      <ThemedText
        style={styles.link}
        onPress={() =>
          Linking.openURL("https://www.ascenciotax.com/termsofuse")
        }
      >
        Terms of service
      </ThemedText>{" "}
      and{" "}
      <ThemedText
        style={styles.link}
        onPress={() => Linking.openURL("https://www.ascenciotax.com/privacy")}
      >
        Privacy Policy
      </ThemedText>
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  link: {
    color: theme.primary,
    textDecorationLine: "underline",
  },
});

export default TermsAndPrivacy;
