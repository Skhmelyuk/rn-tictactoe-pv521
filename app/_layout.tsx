import { GameProvider } from "@/context/GameContext";
import useTheme, { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootNavigate() {
  const { isDarkMode, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
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
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GameProvider>
        <RootNavigate />
      </GameProvider>
    </ThemeProvider>
  );
}
