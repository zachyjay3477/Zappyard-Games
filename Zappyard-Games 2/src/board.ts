import { COLS, ROWS, SYMBOL_WEIGHTS } from "./config.js";
import type { Cell, Position, SymbolId } from "./types.js";
import { RNG } from "./rng.js";

export type Board = Cell[][];

const weightedEntries = Object.entries(SYMBOL_WEIGHTS) as [SymbolId, number][];
const totalWeight = weightedEntries.reduce((sum, [, w]) => sum + w, 0);

export function drawSymbol(rng: RNG): SymbolId {
  let roll = rng.next() * totalWeight;
  for (const [symbol, weight] of weightedEntries) {
    roll -= weight;
    if (roll < 0) return symbol;
  }
  return weightedEntries[weightedEntries.length - 1]![0];
}

export function createBoard(rng: RNG): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ symbol: drawSymbol(rng) }))
  );
}

export function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}

export function countSymbol(board: Board, symbol: SymbolId): number {
  let n = 0;
  for (const row of board) for (const cell of row) if (cell.symbol === symbol) n++;
  return n;
}

export function tumble(board: Board, removed: Set<string>, rng: RNG): void {
  for (let col = 0; col < COLS; col++) {
    const survivors: Cell[] = [];
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!removed.has(`${row},${col}`)) survivors.push(board[row]![col]!);
    }

    let writeRow = ROWS - 1;
    for (const cell of survivors) {
      board[writeRow]![col] = cell;
      writeRow--;
    }

    while (writeRow >= 0) {
      board[writeRow]![col] = { symbol: drawSymbol(rng) };
      writeRow--;
    }
  }
}

export function keyOf(p: Position): string {
  return `${p.row},${p.col}`;
}
