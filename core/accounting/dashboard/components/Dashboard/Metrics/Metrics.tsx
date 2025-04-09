import React from "react";

import { Ionicons } from "@expo/vector-icons";

import { MetricsList } from "./MetricsList";
import { MetricsListValue } from "./MetricsListValue";
import { Card } from "@/components/ui/Card/Card";
import { SimpleCardHeader } from "@/components/ui/Card/SimpleCardHeader";
import { SimpleCardHeaderTitle } from "@/components/ui/Card/SimpleCardHeaderTitle";
import { ThemedText } from "@/components/ui/ThemedText";
import { theme } from "@/components/ui/theme";
import { CardContent } from "@/components/ui/Card/CardContent";

interface MetricsProps {
  metrics: { label: string; value: string }[];
}

export const Metrics = ({ metrics }: MetricsProps) => {
  return (
    <Card>
      <CardContent>
        <SimpleCardHeader>
          <Ionicons name={"key-outline"} size={20} color={theme.foreground} />
          <SimpleCardHeaderTitle>Key Metrics</SimpleCardHeaderTitle>
        </SimpleCardHeader>
        {metrics.map((metric, index) => (
          <MetricsList key={index}>
            <ThemedText>{metric.label}</ThemedText>
            <MetricsListValue>{metric.value}</MetricsListValue>
          </MetricsList>
        ))}
      </CardContent>
    </Card>
  );
};
