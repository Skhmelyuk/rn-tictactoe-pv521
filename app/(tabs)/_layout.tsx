import useTheme from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          height: 80,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 8,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Гра",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sports-esports" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Статистика",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
