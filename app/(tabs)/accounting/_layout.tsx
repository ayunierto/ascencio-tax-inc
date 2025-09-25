import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/components/ui/theme";

export default function AccountingLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.background,
        },
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerType: "slide",
        headerTitleAlign: "center",
      }}
    >
      <Drawer.Screen
        name="receipts/index"
        options={{
          drawerIcon: ({
            color,
            focused,
            size,
          }: {
            color: string;
            focused: boolean;
            size: number;
          }) => (
            <MaterialCommunityIcons
              name={focused ? "view-dashboard" : "view-dashboard-outline"}
              size={size}
              color={color}
            />
          ),
          drawerLabel: "Dashboard",
          title: "Dashboard",
        }}
      />

      <Drawer.Screen
        name="receipts/expense"
        options={{
          drawerIcon: ({
            color,
            focused,
            size,
          }: {
            color: string;
            focused: boolean;
            size: number;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
            />
          ),
          drawerLabel: "Expenses",
          title: "Expenses",
        }}
      />

      <Drawer.Screen
        name="reports/index"
        options={{
          drawerIcon: ({
            color,
            focused,
            size,
          }: {
            color: string;
            focused: boolean;
            size: number;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
            />
          ),
          drawerLabel: "Reports",
          title: "Reports",
        }}
      />

      <Drawer.Screen
        name="support/index"
        options={{
          drawerIcon: ({
            color,
            focused,
            size,
          }: {
            color: string;
            focused: boolean;
            size: number;
          }) => (
            <Ionicons
              color={color}
              name={focused ? "help-circle" : "help-circle-outline"}
              size={size}
            />
          ),
          drawerLabel: "Contact Support",
          title: "Support",
        }}
      />
    </Drawer>
  );
}
