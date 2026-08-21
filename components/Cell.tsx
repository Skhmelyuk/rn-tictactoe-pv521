import type { CellValue } from "@/types";
import { Pressable, StyleSheet, Text } from "react-native";

interface CellProps {
    value: CellValue;
    onCellClick: () => void;
    isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.cell,
                isWinner && styles.winner,
                pressed && styles.pressed,
            ]}
            onPress={onCellClick}
        >
            <Text
                style={[
                    styles.cellText,
                    value === "X" && styles.xMark,
                    value === "O" && styles.oMark,
                    isWinner && styles.winnerText,
                ]}
            >
                {value}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    xMark: {
        color: "#e74c3c",
        fontWeight: "500",
    },

    oMark: {
        color: "#3498db",
        fontWeight: "500",
    },

    cell: {
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 90,
        height: 90,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        fontSize: 40,
        fontWeight: "bold",
    },

    winner: {
        backgroundColor: "#2ecc71",
        borderColor: "#27ae60",
        borderWidth: 2,
    },
    winnerText: {
        color: "white",
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.96 }],
    },
});
