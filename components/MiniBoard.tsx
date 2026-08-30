import useTheme, { ColorScheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface MiniBoardProps {
  board: (string | null)[];
  winningCombination?: number[];
}

export function MiniBoard({ board, winningCombination = [] }: MiniBoardProps) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  return (
    <View style={styles.boardContainer}>
      {board.map((cellValue, index) => {
        const isWinCell = winningCombination.includes(index);

        return (
          <View
            key={index}
            style={[styles.cell, isWinCell && styles.cellWinner]}
          >
            {cellValue ? (
              <Text
                style={[
                  styles.cellText,
                  cellValue === "X" && styles.textX,
                  cellValue === "O" && styles.textO,
                  isWinCell && styles.textWinner,
                ]}
              >
                {cellValue}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    boardContainer: {
      width: 68,
      height: 68,
      padding: 3,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: isDarkMode ? "#0F172A" : "#F1F5F9",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignContent: "space-between",
      gap: 3,
    },
    cell: {
      width: 18,
      height: 18,
      borderRadius: 3,
      borderWidth: 0.5,
      borderColor: colors.border,
      backgroundColor: isDarkMode ? "#1E293B" : "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    cellWinner: {
      backgroundColor: colors.winnerBg,
      borderColor: colors.winnerBorder,
    },
    cellText: {
      fontSize: 10,
      fontWeight: "900",
      lineHeight: 12,
    },
    textX: {
      color: colors.xMark,
    },
    textO: {
      color: colors.oMark,
    },
    textWinner: {
      color: "#FFFFFF",
    },
  });
