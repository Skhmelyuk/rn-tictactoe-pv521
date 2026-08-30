import useTheme, { ColorScheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery } from "convex/react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";

export default function StatisticsScreen() {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  const stats = useQuery(api.stats.getStats);
  const resetStats = useMutation(api.stats.resetStats);

  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  const handleSignOut = () => {
  Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з гри?", [
    { text: "Скасувати", style: "cancel" },
    {
      text: "Вийти",
      style: "destructive",
      onPress: async () => {
        await signOut();
        router.replace("/sign-in");
      },
    },
  ]);
};

  const currentStats = stats ?? {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
  };

  const handleResetStats = () => {
    if (currentStats.totalGames === 0) {
      Alert.alert("Повідомлення:", "Статистика вже порожня!");
      return;
    }

    Alert.alert(
      "Скидання статистики:",
      "Ви впевнені що хочете очистити всю збережену статистику?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Очистити",
          style: "destructive",
          onPress: () => resetStats(),
        },
      ]
    );
  };

  const isResetDisabled = currentStats.totalGames === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Статистика ігор</Text>

        <View >
  <View >
    <MaterialIcons name="sports-esports" size={28} color="#FFFFFF" />
  </View>
  <View>
    <Text >{user?.name ?? "Гравець"}</Text>
    <Text >{user?.email ?? ""}</Text>
  </View>
  <TouchableOpacity
    onPress={handleSignOut}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <MaterialIcons name="logout" size={22} color={colors.textMuted} />
  </TouchableOpacity>
</View>

        {/* Блок перемикання теми */}
        <View style={styles.themeCard}>
          <View style={styles.themeInfo}>
            <MaterialIcons
              name={isDarkMode ? "dark-mode" : "light-mode"}
              size={24}
              color={isDarkMode ? "#FBBF24" : "#F59E0B"}
            />
            <View>
              <Text style={styles.themeText}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
              <Text style={styles.themeSubText}>
                {isDarkMode ? "Активний нічний режим" : "Активний денний режим"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{
              false: isDarkMode ? "#334155" : "#D1D5DB",
              true: colors.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Сітка карток статистики */}
        <View style={styles.grid}>
          {/* Картка 1: Загальна кількість */}
          <View style={[styles.card, styles.cardTotal]}>
            <MaterialIcons
              name="videogame-asset"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.cardNumber}>{currentStats.totalGames}</Text>
            <Text style={styles.cardLabel}>Зіграно партій</Text>
          </View>

          {/* Картка 2: Перемоги X */}
          <View style={[styles.card, styles.cardX]}>
            <Text style={styles.playerBadgeX}>X</Text>
            <Text style={styles.cardNumber}>{currentStats.winsX}</Text>
            <Text style={styles.cardLabel}>Перемог X</Text>
          </View>

          {/* Картка 3: Перемоги O */}
          <View style={[styles.card, styles.cardO]}>
            <Text style={styles.playerBadgeO}>O</Text>
            <Text style={styles.cardNumber}>{currentStats.winsO}</Text>
            <Text style={styles.cardLabel}>Перемог O</Text>
          </View>

          {/* Картка 4: Нічиї */}
          <View style={[styles.card, styles.cardDraw]}>
            <MaterialIcons name="handshake" size={32} color="#F59E0B" />
            <Text style={styles.cardNumber}>{currentStats.draws}</Text>
            <Text style={styles.cardLabel}>Нічиїх</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.resetButton,
            isResetDisabled && styles.resetButtonDisabled,
          ]}
          onPress={handleResetStats}
          activeOpacity={0.8}
          disabled={isResetDisabled}
        >
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={isResetDisabled ? colors.textMuted : "#FFFFFF"}
          />
          <Text
            style={[
              styles.resetText,
              isResetDisabled && styles.resetTextDisabled,
            ]}
          >
            Очистити статистику
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: 20,
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: 0.5,
      marginBottom: 24,
      marginTop: 8,
      color: colors.text,
    },
    themeCard: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: 24,
      elevation: 2,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.25 : 0.06,
      shadowRadius: 4,
    },
    themeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    themeText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    themeSubText: {
      fontSize: 12,
      fontWeight: "500",
      marginTop: 2,
      color: colors.textMuted,
    },
    grid: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 14,
      marginBottom: 24,
    },
    card: {
      width: "47%",
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderTopWidth: 4,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    cardTotal: {
      borderTopColor: colors.primary,
    },
    cardX: {
      borderTopColor: colors.xMark,
    },
    cardO: {
      borderTopColor: colors.oMark,
    },
    cardDraw: {
      borderTopColor: "#F59E0B",
    },
    playerBadgeX: {
      fontSize: 28,
      fontWeight: "900",
      height: 32,
      lineHeight: 32,
      textAlign: "center",
      color: colors.xMark,
    },
    playerBadgeO: {
      fontSize: 28,
      fontWeight: "900",
      height: 32,
      lineHeight: 32,
      textAlign: "center",
      color: colors.oMark,
    },
    cardNumber: {
      fontSize: 30,
      fontWeight: "800",
      marginVertical: 6,
      color: colors.text,
    },
    cardLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textMuted,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 14,
      marginTop: 8,
      width: "100%",
      backgroundColor: isDarkMode ? "#991B1B" : "#DC2626",
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.35 : 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
    resetButtonDisabled: {
      backgroundColor: isDarkMode ? "#1E293B" : "#E2E8F0",
      shadowOpacity: 0,
      opacity: 0.6,
    },
    resetText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    resetTextDisabled: {
      color: colors.textMuted,
    },
  });
