import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from "expo-router";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

const DATABASE_NAME = "pocket.db";

const Layout = () => {
  const { isSignedIn } = useAuth();
  const db = openDatabaseSync(DATABASE_NAME);
  useDrizzleStudio(db);
  
  
  return (
    <Stack>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
    </Stack>
  );
}

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
    <KeyboardProvider>
      <Suspense fallback={<ActivityIndicator />}>
        <SQLiteProvider useSuspense databaseName={DATABASE_NAME} options={{ enableChangeListener: true }}>
          <Layout />
        </SQLiteProvider>
      </Suspense>
    </KeyboardProvider>
    </ClerkProvider>
  );
}
export default RootLayout;
