import type { PayingSymbol, PowerupType } from "./types.js";

export const ROWS = 5;
export const COLS = 7;

export const PAYING_SYMBOLS: PayingSymbol[] = [
  "S1","S2","S3","S4","S5","S6","S7","S8","S9"
];

// v0.2 relative symbol weights. Lower symbols are deliberately more common
// to create enough cluster/cascade activity for the tile-multiplier engine.
export const SYMBOL_WEIGHTS: Record<PayingSymbol | "BONUS", number> = {
  S1: 24,
  S2: 20,
  S3: 16,
  S4: 12,
  S5: 9,
  S6: 7,
  S7: 5,
  S8: 3,
  S9: 2,
  BONUS: 1
};

export const TILE_MULTIPLIER_CAP = 4096;

export const PAY_BANDS = [
  { min: 5, max: 6 },
  { min: 7, max: 8 },
  { min: 9, max: 10 },
  { min: 11, max: 12 },
  { min: 13, max: 15 },
  { min: 16, max: 19 },
  { min: 20, max: 24 },
  { min: 25, max: 29 },
  { min: 30, max: 34 },
  { min: 35, max: 35 }
] as const;

// v0.2 seed paytable, calibrated from Monte Carlo around a ~96% total RTP target.
// Values remain provisional until the full feature/powerup implementation is finalized.
export const PAYTABLE: Record<PayingSymbol, number[]> = {
  S1: [0.85,1.30,1.70,2.55,4.25,8.50,17,34,68,170],
  S2: [0.85,1.30,2.10,3.40,6.40,12.75,25.50,51,102,255],
  S3: [1.30,1.70,2.55,4.25,8.50,17,34,68,136,340],
  S4: [1.30,2.10,3.40,6.40,12.75,25.50,51,102,204,510],
  S5: [1.70,2.55,4.25,8.50,17,34,68,136,272,680],
  S6: [2.10,3.40,6.40,12.75,25.50,51,102,204,408,1020],
  S7: [2.55,4.25,8.50,17,34,68,136,272,544,1360],
  S8: [3.40,6.40,12.75,25.50,51,102,204,408,816,2040],
  S9: [4.25,8.50,17,34,68,136,272,544,1088,2720]
};

export interface PowerupOdds {
  min: number;
  max: number;
  odds: Partial<Record<PowerupType, number>>;
}

export const POWERUP_ODDS: PowerupOdds[] = [
  { min: 5,  max: 6,  odds: { BLAST: 0.04 } },
  { min: 7,  max: 8,  odds: { BLAST: 0.07, CROSS: 0.01 } },
  { min: 9,  max: 10, odds: { BLAST: 0.09, CROSS: 0.03, COLOR_CLEAR: 0.01 } },
  { min: 11, max: 12, odds: { BLAST: 0.11, CROSS: 0.05, COLOR_CLEAR: 0.02 } },
  { min: 13, max: 15, odds: { BLAST: 0.13, CROSS: 0.07, COLOR_CLEAR: 0.04 } },
  { min: 16, max: 19, odds: { BLAST: 0.15, CROSS: 0.10, COLOR_CLEAR: 0.06 } },
  { min: 20, max: 35, odds: { BLAST: 0.18, CROSS: 0.13, COLOR_CLEAR: 0.09 } }
];
