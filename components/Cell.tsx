import type { CellValue } from "../types";
import clsx from "clsx";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {
  const cellClass = clsx("cell", {
    "x-mark": value === "X",
    "o-mark": value === "O",
    winner: isWinner,
  });

  return (
    <div className={cellClass} onClick={onCellClick}>
      {value}
    </div>
  );
}
