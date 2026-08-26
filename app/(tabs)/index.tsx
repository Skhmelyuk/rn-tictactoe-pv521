import { Cell } from "@/components/Cell";
import { Status } from "@/components/Status";
import { TitleGame } from "@/components/TitleGame";
import { useGame } from "@/context/GameContext";
import { useTheme } from "@/context/ThemeContext";
import type { BoardState, Player } from "@/types";
import { checkWinner } from "@/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [cells, setCells] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const { recordGameResult } = useGame();
  const { colors, isDarkMode } = useTheme();
  const gameRecordRef = useRef(false);

  const winnerResult = checkWinner(cells);
  const winner = winnerResult ? winnerResult.winner : null;
  const winnerCombination = winnerResult ? winnerResult.combination : [];
  const isDraw = !winner && cells.every((cell) => cell != null);

  useEffect(() => {
    if (winner && !gameRecordRef.current) {
      recordGameResult(winner);
      gameRecordRef.current = true;
    } else if (isDraw && !gameRecordRef.current) {
      recordGameResult("DRAW");
      gameRecordRef.current = true;
    }
  }, [winner, isDraw, recordGameResult]);

  const handleCellClick = (index: number): void => {
    if (cells[index] || winner || isDraw) {
      return;
    }

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    if (winner) {
      setCurrentPlayer(winner === "X" ? "O" : "X");
    }
    gameRecordRef.current = false;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.game}>
        <TitleGame title="Хрестики-Нулики" />
        <Status player={currentPlayer} winner={winner} isDraw={isDraw} />
        <View
          style={[
            styles.boardWrapper,
            {
              backgroundColor: isDarkMode
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.board}>
            {cells.map((cell, index) => (
              <Cell
                value={cell}
                key={index}
                onCellClick={() => handleCellClick(index)}
                isWinner={winnerCombination.includes(index)}
              />
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.reset,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.cardShadow,
              shadowOpacity: isDarkMode ? 0.35 : 0.15,
            },
          ]}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <MaterialIcons name="replay" size={20} color="#ffffff" />
          <Text style={styles.resetText}>Скинути гру</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  game: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  boardWrapper: {
    padding: 12,
    borderRadius: 24,
    borderWidth: 1,
    marginVertical: 10,
  },
  board: {
    gap: 12,
    width: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reset: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  resetText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});

