import React, { useState } from "react";

import { SafeAreaView, ScrollView, View } from "react-native";
import Logo from "@/components/Logo";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/beta/Tab";
import ServicesScreen from "@/components/home/services";
import BlogScreen from "@/components/home/blog";

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState("services");
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Logo />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="services"
        >
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesScreen />
          </TabsContent>

          <TabsContent value="blog" style={{ flex: 1 }}>
            <BlogScreen />
          </TabsContent>
        </Tabs>
      </ScrollView>

      {/* <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.mutedForeground,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.background,
            paddingTop: 8,
            height: 45,
            elevation: 0,
            shadowOpacity: 0,
          },
          animation: "shift",
          tabBarPosition: "top",
          tabBarIconStyle: { height: 0 },
          tabBarIcon: undefined,
          tabBarLabelStyle: {
            fontSize: 13,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Services",
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",
          }}
        />
      </Tabs> */}
    </SafeAreaView>
  );
}
