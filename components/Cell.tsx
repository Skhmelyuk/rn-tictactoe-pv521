import { useTheme } from "@/context/ThemeContext";
import type { CellValue } from "@/types";
import { Pressable, StyleSheet, Text } from "react-native";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        {
          backgroundColor: isWinner
            ? colors.winnerBg
            : pressed
            ? colors.surfaceHighlight
            : colors.surface,
          borderColor: isWinner ? colors.winnerBorder : colors.border,
          borderWidth: isWinner ? 2.5 : 1,
          shadowColor: colors.cardShadow,
          shadowOpacity: isDarkMode ? 0.3 : 0.08,
        },
        pressed && styles.pressed,
      ]}
      onPress={onCellClick}
    >
      <Text
        style={[
          styles.cellText,
          {
            color: isWinner
              ? "#FFFFFF"
              : value === "X"
              ? colors.xMark
              : colors.oMark,
          },
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    width: 92,
    height: 92,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 44,
    fontWeight: "900",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.94 }],
  },
});

