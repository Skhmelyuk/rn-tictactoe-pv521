import { MiniBoard } from "@/components/MiniBoard";
import useTheme, { ColorScheme } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery } from "convex/react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  // Реактивний запит списку ігор
  const games = useQuery(api.games.getRecentGames);
  const deleteGameMutation = useMutation(api.games.deleteGame);
  const clearAllGamesMutation = useMutation(api.games.clearAllGames);

  // Форматування дати та часу
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "short",
    });
    const time = date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day}, ${time}`;
  };

  const handleDeleteItem = (id: Id<"games">) => {
    Alert.alert("Видалити гру:", "Ви впевнені, що хочете видалити цей запис?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: () => deleteGameMutation({ id }),
      },
    ]);
  };

  const handleClearAll = () => {
    if (!games || games.length === 0) return;

    Alert.alert(
      "Очищення історії:",
      "Ви впевнені, що хочете очистити всю історію зіграних партій?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Очистити все",
          style: "destructive",
          onPress: () => clearAllGamesMutation(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Історія ігор</Text>
        {games && games.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="delete-sweep"
              size={20}
              color={isDarkMode ? "#F87171" : "#DC2626"}
            />
            <Text style={styles.clearBtnText}>Очистити</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Стан завантаження */}
      {games === undefined ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : games.length === 0 ? (
        /* Стан порожнього списку */
        <View style={styles.centerContainer}>
          <MaterialIcons
            name="history-toggle-off"
            size={64}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>Історія порожня</Text>
          <Text style={styles.emptySubtitle}>
            Зіграйте свою першу партію, щоб зберегти її тут!
          </Text>
        </View>
      ) : (
        /* Список партій */
        <FlatList
          data={games}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isWinnerX = item.winner === "X";
            const isWinnerO = item.winner === "O";
            const isDraw = item.winner === "DRAW";

            return (
              <View style={styles.card}>
                {/* Ліва колонка: Значок результату та інфо */}
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.resultBadge,
                      isDraw && styles.badgeDrawBg,
                      isWinnerX && styles.badgeXBg,
                      isWinnerO && styles.badgeOBg,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isDraw && styles.badgeDrawText,
                        isWinnerX && styles.badgeXText,
                        isWinnerO && styles.badgeOText,
                      ]}
                    >
                      {isDraw ? "=" : item.winner}
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.resultTitle}>
                      {isDraw ? "Нічия" : `Перемога ${item.winner}`}
                    </Text>
                    <Text style={styles.resultTime}>
                      {formatTime(item.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Права колонка: Міні-дошка та кнопка видалення */}
                <View style={styles.cardRight}>
                  <MiniBoard
                    board={item.board}
                    winningCombination={item.winningCombination}
                  />

                  <TouchableOpacity
                    style={styles.deleteItemBtn}
                    onPress={() => handleDeleteItem(item._id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons
                      name="close"
                      size={18}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: 0.5,
      color: colors.text,
    },
    clearBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: isDarkMode ? "#F87171" : "#DC2626",
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      gap: 12,
    },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      flex: 1,
    },
    resultBadge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeDrawBg: {
      backgroundColor: isDarkMode ? "#78350F" : "#FEF3C7",
    },
    badgeXBg: {
      backgroundColor: isDarkMode ? "#7F1D1D" : "#FEE2E2",
    },
    badgeOBg: {
      backgroundColor: isDarkMode ? "#1E3A8A" : "#DBEAFE",
    },
    badgeText: {
      fontSize: 22,
      fontWeight: "900",
    },
    badgeDrawText: {
      color: "#D97706",
    },
    badgeXText: {
      color: colors.xMark,
    },
    badgeOText: {
      color: colors.oMark,
    },
    cardInfo: {
      gap: 2,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    resultTime: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.textMuted,
    },
    cardRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    deleteItemBtn: {
      padding: 4,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
      gap: 8,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginTop: 10,
      color: colors.text,
    },
    emptySubtitle: {
      fontSize: 14,
      textAlign: "center",
      fontWeight: "500",
      color: colors.textMuted,
    },
  });
