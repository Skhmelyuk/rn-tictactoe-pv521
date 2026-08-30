import useTheme, { ColorScheme } from "@/context/ThemeContext";
import type { CellValue, Player } from "@/types";
import { StyleSheet, Text, View } from "react-native";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  if (winner) {
    return (
      <View style={[styles.turn, styles.turnWinner]}>
        <Text style={styles.turnText}>
          🎉 Гравець{" "}
          <Text
            style={[
              styles.playerBadge,
              winner === "X" ? styles.badgeX : styles.badgeO,
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
      <View style={[styles.turn, styles.turnDraw]}>
        <Text style={styles.turnText}>🤝 Нічия!</Text>
      </View>
    );
  }

  return (
    <View style={styles.turn}>
      <Text style={styles.turnText}>
        Хід гравця:{" "}
        <Text
          style={[
            styles.playerBadge,
            player === "X" ? styles.badgeX : styles.badgeO,
          ]}
        >
          {player}
        </Text>
      </Text>
    </View>
  );
}

const createStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    turn: {
      marginBottom: 24,
      paddingVertical: 10,
      paddingHorizontal: 22,
      borderRadius: 24,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDarkMode ? 0.25 : 0.08,
      shadowRadius: 8,
      elevation: 3,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    turnWinner: {
      borderColor: colors.winnerBorder,
      borderWidth: 2,
      shadowOpacity: isDarkMode ? 0.35 : 0.1,
    },
    turnDraw: {
      borderColor: "#F59E0B",
      borderWidth: 2,
      shadowOpacity: isDarkMode ? 0.35 : 0.1,
    },
    turnText: {
      fontSize: 17,
      fontWeight: "600",
      textAlign: "center",
      color: colors.text,
    },
    playerBadge: {
      fontSize: 20,
      fontWeight: "900",
    },
    badgeX: {
      color: colors.xMark,
    },
    badgeO: {
      color: colors.oMark,
    },
  });

