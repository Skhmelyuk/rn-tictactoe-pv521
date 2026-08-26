import { useTheme } from "@/context/ThemeContext";
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

export default function StatisticsScreen() {
  const { isDarkMode, colors, toggleTheme } = useTheme();

  const stats = useQuery(api.stats.getStats);
  const resetStats = useMutation(api.stats.resetStats);

  const currentStats = stats ?? {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
  };

  const handleResetStats = () => {
    if (currentStats.totalGames === 0) {
      Alert.alert("Повідомлення:", "Статистика вже порожня!");
    } else {
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
        ],
      );
    }
  };

  const isResetDisabled = currentStats.totalGames === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Статистика ігор
        </Text>

        {/* Блок перемикання теми */}
        <View
          style={[
            styles.themeCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.cardShadow,
              shadowOpacity: isDarkMode ? 0.25 : 0.06,
            },
          ]}
        >
          <View style={styles.themeInfo}>
            <MaterialIcons
              name={isDarkMode ? "dark-mode" : "light-mode"}
              size={24}
              color={isDarkMode ? "#FBBF24" : "#F59E0B"}
            />
            <View>
              <Text style={[styles.themeText, { color: colors.text }]}>
                {isDarkMode ? "Темна тема" : "Світла тема"}
              </Text>
              <Text style={[styles.themeSubText, { color: colors.textMuted }]}>
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

        <View style={styles.grid}>
          {/* Картка 1: Загальна кількість */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderTopColor: colors.primary,
                shadowColor: colors.cardShadow,
                shadowOpacity: isDarkMode ? 0.3 : 0.08,
              },
            ]}
          >
            <MaterialIcons
              name="videogame-asset"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {currentStats.totalGames}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Зіграно партій
            </Text>
          </View>

          {/* Картка 2: Перемоги X */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderTopColor: colors.xMark,
                shadowColor: colors.cardShadow,
                shadowOpacity: isDarkMode ? 0.3 : 0.08,
              },
            ]}
          >
            <Text style={[styles.playerBadgeX, { color: colors.xMark }]}>
              X
            </Text>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {currentStats.winsX}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Перемог X
            </Text>
          </View>

          {/* Картка 3: Перемоги O */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderTopColor: colors.oMark,
                shadowColor: colors.cardShadow,
                shadowOpacity: isDarkMode ? 0.3 : 0.08,
              },
            ]}
          >
            <Text style={[styles.playerBadgeO, { color: colors.oMark }]}>
              O
            </Text>
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {currentStats.winsO}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Перемог O
            </Text>
          </View>

          {/* Картка 4: Нічиї */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderTopColor: "#F59E0B",
                shadowColor: colors.cardShadow,
                shadowOpacity: isDarkMode ? 0.3 : 0.08,
              },
            ]}
          >
            <MaterialIcons name="handshake" size={32} color="#F59E0B" />
            <Text style={[styles.cardNumber, { color: colors.text }]}>
              {currentStats.draws}
            </Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
              Нічиїх
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              backgroundColor: isResetDisabled
                ? isDarkMode
                  ? "#1E293B"
                  : "#E2E8F0"
                : isDarkMode
                  ? "#991B1B"
                  : "#DC2626",
              shadowColor: colors.cardShadow,
              shadowOpacity: isResetDisabled ? 0 : isDarkMode ? 0.35 : 0.15,
              opacity: isResetDisabled ? 0.6 : 1,
            },
          ]}
          onPress={handleResetStats}
          activeOpacity={0.8}
          disabled={isResetDisabled}
        >
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={
              isResetDisabled
                ? isDarkMode
                  ? colors.textMuted
                  : "#9CA3AF"
                : "#FFFFFF"
            }
          />
          <Text
            style={[
              styles.resetText,
              {
                color: isResetDisabled
                  ? isDarkMode
                    ? colors.textMuted
                    : "#9CA3AF"
                  : "#FFFFFF",
              },
            ]}
          >
            Очистити статистику
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  playerBadgeX: {
    fontSize: 28,
    fontWeight: "900",
    height: 32,
    lineHeight: 32,
    textAlign: "center",
  },
  playerBadgeO: {
    fontSize: 28,
    fontWeight: "900",
    height: 32,
    lineHeight: 32,
    textAlign: "center",
  },
  cardNumber: {
    fontSize: 30,
    fontWeight: "800",
    marginVertical: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
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
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "700",
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
    marginBottom: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
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
  },
  themeSubText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
});
