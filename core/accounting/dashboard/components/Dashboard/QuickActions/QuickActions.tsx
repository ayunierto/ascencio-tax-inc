import React from "react";

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card/Card";
import { SimpleCardHeader } from "@/components/ui/Card/SimpleCardHeader";
import { SimpleCardHeaderTitle } from "@/components/ui/Card/SimpleCardHeaderTitle";
import { theme } from "@/components/ui/theme";
import Button from "@/components/ui/Button";
import { CardContent } from "@/components/ui/Card/CardContent";

interface QuickActionsProps {
  actions: {
    label: string;
    onPress: () => void;
  }[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <Card>
      <CardContent>
        <SimpleCardHeader>
          <Ionicons name={"flash-outline"} size={20} color={theme.foreground} />
          <SimpleCardHeaderTitle>Quick Actions</SimpleCardHeaderTitle>
        </SimpleCardHeader>
        <View style={{ gap: 10 }}>
          {actions.map((action, index) => (
            <Button key={index} onPress={action.onPress}>
              {action.label}
            </Button>
          ))}
        </View>
      </CardContent>
    </Card>
  );
};
