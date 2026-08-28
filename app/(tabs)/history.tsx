import { MiniBoard } from "@/components/MiniBoard";
import { useTheme } from "@/context/ThemeContext";
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Історія ігор</Text>
        {games && games.length > 0 && (
          <TouchableOpacity
            style={[styles.clearBtn, { borderColor: colors.border }]}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="delete-sweep"
              size={20}
              color={isDarkMode ? "#F87171" : "#DC2626"}
            />
            <Text
              style={[
                styles.clearBtnText,
                { color: isDarkMode ? "#F87171" : "#DC2626" },
              ]}
            >
              Очистити
            </Text>
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
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Історія порожня
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
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
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    shadowColor: colors.cardShadow,
                    shadowOpacity: isDarkMode ? 0.3 : 0.08,
                  },
                ]}
              >
                {/* Ліва колонка: Значок результату та інфо */}
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.resultBadge,
                      {
                        backgroundColor: isDraw
                          ? isDarkMode
                            ? "#78350F"
                            : "#FEF3C7"
                          : isWinnerX
                          ? isDarkMode
                            ? "#7F1D1D"
                            : "#FEE2E2"
                          : isDarkMode
                          ? "#1E3A8A"
                          : "#DBEAFE",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: isDraw
                            ? "#D97706"
                            : isWinnerX
                            ? colors.xMark
                            : colors.oMark,
                        },
                      ]}
                    >
                      {isDraw ? "=" : item.winner}
                    </Text>
                  </View>
 
                  <View style={styles.cardInfo}>
                    <Text style={[styles.resultTitle, { color: colors.text }]}>
                      {isDraw ? "Нічия" : `Перемога ${item.winner}`}
                    </Text>
                    <Text
                      style={[styles.resultTime, { color: colors.textMuted }]}
                    >
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
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: "600",
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
    shadowOffset: { width: 0, height: 3 },
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
  badgeText: {
    fontSize: 22,
    fontWeight: "900",
  },
  cardInfo: {
    gap: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  resultTime: {
    fontSize: 12,
    fontWeight: "500",
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
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
