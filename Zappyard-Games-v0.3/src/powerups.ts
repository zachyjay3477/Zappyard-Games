import { COLS, PAYING_SYMBOLS, POWERUP_ODDS, ROWS } from "./config.js";
import type { Cluster, PayingSymbol, Position, PowerupSpawn, PowerupType } from "./types.js";
import type { Board } from "./board.js";
import { keyOf } from "./board.js";
import { RNG } from "./rng.js";

function oddsFor(size: number): Partial<Record<PowerupType, number>> {
  return POWERUP_ODDS.find(x => size >= x.min && size <= x.max)?.odds ?? {};
}

export function maybeSpawnPowerup(
  cluster: Cluster,
  rng: RNG,
  oddsMultiplier = 1
): PowerupSpawn | null {
  const rawOdds = oddsFor(cluster.positions.length);
  const odds: Partial<Record<PowerupType, number>> = {
    BLAST: Math.min(1, (rawOdds.BLAST ?? 0) * oddsMultiplier),
    CROSS: Math.min(1, (rawOdds.CROSS ?? 0) * oddsMultiplier),
    COLOR_CLEAR: Math.min(1, (rawOdds.COLOR_CLEAR ?? 0) * oddsMultiplier)
  };
  const roll = rng.next();
  let cursor = 0;

  const order: PowerupType[] = ["BLAST", "CROSS", "COLOR_CLEAR"];
  for (const type of order) {
    cursor += odds[type] ?? 0;
    if (roll < cursor) {
      return {
        type,
        position: rng.pick(cluster.positions)
      };
    }
  }

  return null;
}

function blastPositions(center: Position): Position[] {
  const out: Position[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const row = center.row + dr;
      const col = center.col + dc;
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) out.push({ row, col });
    }
  }
  return out;
}

function crossPositions(center: Position): Position[] {
  const out: Position[] = [];
  for (let col = 0; col < COLS; col++) out.push({ row: center.row, col });
  for (let row = 0; row < ROWS; row++) out.push({ row, col: center.col });
  return out;
}

function colorClearPositions(board: Board, rng: RNG): Position[] {
  const present = new Set<PayingSymbol>();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const s = board[row]![col]!.symbol;
      if ((PAYING_SYMBOLS as readonly string[]).includes(s)) present.add(s as PayingSymbol);
    }
  }

  if (!present.size) return [];
  const chosen = rng.pick([...present]);
  const out: Position[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row]![col]!.symbol === chosen) out.push({ row, col });
    }
  }
  return out;
}

export function resolvePowerups(
  board: Board,
  spawns: PowerupSpawn[],
  rng: RNG
): Position[] {
  // v0.1: powerups are generated from wins and resolve immediately.
  // Chain-reaction infrastructure is represented here; future powerups
  // can be queued if we later allow spawned powerups to occupy board cells.
  const queue = [...spawns];
  const destroyed = new Map<string, Position>();

  while (queue.length) {
    const p = queue.shift()!;
    let affected: Position[] = [];

    if (p.type === "BLAST") affected = blastPositions(p.position);
    else if (p.type === "CROSS") affected = crossPositions(p.position);
    else affected = colorClearPositions(board, rng);

    for (const pos of affected) destroyed.set(keyOf(pos), pos);
  }

  return [...destroyed.values()];
}
