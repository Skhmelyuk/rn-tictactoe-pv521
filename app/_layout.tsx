import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform, View } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function RootNavigate() {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar style={colors.statusBarStyle} />
      <AuthLoading>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.bg,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack>
      </Unauthenticated>
      <Authenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.bg,
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ConvexAuthProvider
        client={convex}
        storage={
          Platform.OS === "android" || Platform.OS === "ios"
            ? secureStorage
            : undefined
        }
      >
        <RootNavigate />
      </ConvexAuthProvider>
    </ThemeProvider>
  );
}
