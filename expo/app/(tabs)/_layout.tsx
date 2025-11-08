import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";

import React from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs backgroundColor="#27272a">
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <Label>Explore</Label>
        {Platform.select({
          ios: <Icon sf="magnifyingglass" />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="search" />} />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
