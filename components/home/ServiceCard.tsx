import { View, Image } from "react-native";
import { theme } from "../ui/theme";
import { Service } from "@/core/services/interfaces/service.interface";
import { ThemedText } from "../ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Button, ButtonText } from "../ui/Button";

interface ServiceCardProps {
  service: Service;
  handleServiceSelection: (service: Service) => void;
}

export const ServiceCard = ({
  service,
  handleServiceSelection,
}: ServiceCardProps) => {
  return (
    <View
      style={{
        flex: 1,
        overflow: "hidden",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
      }}
      key={service.id}
    >
      <Image
        style={{ width: 60, height: 60, borderRadius: theme.radius }}
        source={{ uri: service.imageUrl }}
      />
      <View
        style={{
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ThemedText
          style={{
            fontSize: 16,
            color: theme.foreground,
            width: 200,
          }}
        >
          {service.name}
        </ThemedText>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <ThemedText style={{ color: theme.muted }}>1 hour</ThemedText>
          <Ionicons
            size={18}
            color={theme.primary}
            name={
              service.isAvailableOnline
                ? "videocam-outline"
                : "videocam-off-outline"
            }
          />
        </View>
      </View>
      <Button onPress={() => handleServiceSelection(service)}>
        <ButtonText>Book</ButtonText>
      </Button>
    </View>
  );
};
