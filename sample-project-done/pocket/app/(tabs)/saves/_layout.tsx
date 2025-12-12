import { COLORS } from "../../../utils/Colors";

import { Stack } from "expo-router";
export default function SavesLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: COLORS.white }, headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Saves", headerLargeTitle: true , headerLargeTitleShadowVisible: false }} />
    </Stack>
  );
}
