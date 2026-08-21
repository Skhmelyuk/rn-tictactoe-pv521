import { useState } from "react";
import { Cell } from "@/components/Cell";
import { Status } from "@/components/Status";
import { TitleGame } from "@/components/TitleGame";
import type { BoardState, Player } from "@/types";
import { checkWinner } from "@/utils";

export default function Index() {
  const [cells, setCells] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const winnerResult = checkWinner(cells);
  const winner = winnerResult ? winnerResult.winner : null;
  const winnerCombination = winnerResult ? winnerResult.combination : [];
  const isDraw = !winner && cells.every((cell) => cell != null);

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
  };

  return (
    <div className="game">
      <TitleGame title="Гра хрестики нулики" />
      <Status player={currentPlayer} winner={winner} isDraw={isDraw} />
      <div className="board">
        {cells.map((cell, index) => (
          <Cell
            value={cell}
            key={index}
            onCellClick={() => handleCellClick(index)}
            isWinner={winnerCombination.includes(index)}
          />
        ))}
      </div>
      <button className="reset" onClick={handleReset}>
        Скинути гру
      </button>
    </div>
  );
}
