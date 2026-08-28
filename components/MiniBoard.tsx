import { useTheme } from "@/context/ThemeContext";
import { StyleSheet, Text, View } from "react-native";

interface MiniBoardProps {
  board: (string | null)[];
  winningCombination?: number[];
}

export function MiniBoard({ board, winningCombination = [] }: MiniBoardProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.boardContainer,
        {
          backgroundColor: isDarkMode ? "#0F172A" : "#F1F5F9",
          borderColor: colors.border,
        },
      ]}
    >
      {board.map((cellValue, index) => {
        const isWinCell = winningCombination.includes(index);

        return (
          <View
            key={index}
            style={[
              styles.cell,
              {
                backgroundColor: isWinCell
                  ? colors.winnerBg
                  : isDarkMode
                    ? "#1E293B"
                    : "#FFFFFF",
                borderColor: isWinCell ? colors.winnerBorder : colors.border,
              },
            ]}
          >
            {cellValue ? (
              <Text
                style={[
                  styles.cellText,
                  {
                    color: isWinCell
                      ? "#FFFFFF"
                      : cellValue === "X"
                        ? colors.xMark
                        : colors.oMark,
                  },
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

const styles = StyleSheet.create({
  boardContainer: {
    width: 68,
    height: 68,
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 12,
  },
});
