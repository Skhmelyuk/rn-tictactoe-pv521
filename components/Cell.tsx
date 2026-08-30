import useTheme, { ColorScheme } from "@/context/ThemeContext";
import type { CellValue } from "@/types";
import { Pressable, StyleSheet, Text } from "react-native";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
  const { colors, isDarkMode } = useTheme();
  const styles = createStyles(colors, isDarkMode);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        pressed && styles.cellPressed,
        isWinner && styles.cellWinner,
      ]}
      onPress={onCellClick}
    >
      <Text
        style={[
          styles.cellText,
          value === "X" && styles.textX,
          value === "O" && styles.textO,
          isWinner && styles.textWinner,
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    cell: {
      width: 92,
      height: 92,
      borderRadius: 16,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDarkMode ? 0.3 : 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    cellPressed: {
      backgroundColor: colors.surfaceHighlight,
      opacity: 0.9,
      transform: [{ scale: 0.94 }],
    },
    cellWinner: {
      backgroundColor: colors.winnerBg,
      borderColor: colors.winnerBorder,
      borderWidth: 2.5,
    },
    cellText: {
      fontSize: 44,
      fontWeight: "900",
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

