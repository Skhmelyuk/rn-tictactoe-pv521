import type { CellValue, Player } from "@/types";
import { Text, View } from "react-native";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {
  if (winner) {
    return (
      <View style="turn">
        <Text>
          Гравець{" "}
          <Text style={winner === "X" ? "x-mark" : "o-mark"}>{winner}</Text>{" "}
          переміг!
        </Text>
      </View>
    );
  }

  if (isDraw) {
    return (
      <View style="turn">
        <Text>Нічия!</Text>
      </View>
    );
  }

  return (
    <View style="turn">
      <Text>
        Хід гравця{" "}
        <Text style={player === "X" ? "x-mark" : "o-mark"}>{player}</Text>
      </Text>
    </View>
  );
}
