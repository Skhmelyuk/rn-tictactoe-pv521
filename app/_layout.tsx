import { GameProvider } from "@/context/GameContext";
import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <GameProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </GameProvider>
    );
}
