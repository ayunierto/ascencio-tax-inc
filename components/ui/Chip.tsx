import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import React from "react";
import { theme } from "./theme";
import { Ionicons } from "@expo/vector-icons";

interface ChipProps extends TouchableOpacityProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const Chip = ({ text, icon, style, color, ...props }: ChipProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: theme.accent,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: theme.radius,
          marginBottom: 10,
          alignSelf: "flex-start",
        },
        style,
      ]}
      {...props}
    >
      {icon && <Ionicons color={color || "black"} name={icon} size={22} />}
      <Text style={{ color: color || "black" }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Chip;
