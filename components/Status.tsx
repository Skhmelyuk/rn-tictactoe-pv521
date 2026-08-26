import { useTheme } from "@/context/ThemeContext";
import type { CellValue, Player } from "@/types";
import { StyleSheet, Text, View } from "react-native";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {
  const { colors, isDarkMode } = useTheme();

  if (winner) {
    return (
      <View
        style={[
          styles.turn,
          {
            backgroundColor: colors.surface,
            borderColor: colors.winnerBorder,
            borderWidth: 2,
            shadowColor: colors.cardShadow,
            shadowOpacity: isDarkMode ? 0.35 : 0.1,
          },
        ]}
      >
        <Text style={[styles.turnText, { color: colors.text }]}>
          🎉 Гравець{" "}
          <Text
            style={[
              styles.playerBadge,
              { color: winner === "X" ? colors.xMark : colors.oMark },
            ]}
          >
            {winner}
          </Text>{" "}
          переміг!
        </Text>
      </View>
    );
  }

  if (isDraw) {
    return (
      <View
        style={[
          styles.turn,
          {
            backgroundColor: colors.surface,
            borderColor: "#F59E0B",
            borderWidth: 2,
            shadowColor: colors.cardShadow,
            shadowOpacity: isDarkMode ? 0.35 : 0.1,
          },
        ]}
      >
        <Text style={[styles.turnText, { color: colors.text }]}>
          🤝 Нічия!
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.turn,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          shadowColor: colors.cardShadow,
          shadowOpacity: isDarkMode ? 0.25 : 0.08,
        },
      ]}
    >
      <Text style={[styles.turnText, { color: colors.text }]}>
        Хід гравця:{" "}
        <Text
          style={[
            styles.playerBadge,
            { color: player === "X" ? colors.xMark : colors.oMark },
          ]}
        >
          {player}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  turn: {
    marginBottom: 24,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  turnText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  playerBadge: {
    fontSize: 20,
    fontWeight: "900",
  },
});

