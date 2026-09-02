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

// Free Spins deliberately concentrate more return in rare chain events.
export const FREE_SPIN_POWERUP_ODDS_MULTIPLIER = 2.5;

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

// v0.3 paytable: v0.2 values reduced by 3% to move a small amount of RTP
// out of ordinary wins and toward rarer Free Spin powerup chains.
export const PAYTABLE: Record<PayingSymbol, number[]> = {
  S1: [0.8245,1.261,1.649,2.4735,4.1225,8.245,16.49,32.98,65.96,164.9],
  S2: [0.8245,1.261,2.037,3.298,6.208,12.3675,24.735,49.47,98.94,247.35],
  S3: [1.261,1.649,2.4735,4.1225,8.245,16.49,32.98,65.96,131.92,329.8],
  S4: [1.261,2.037,3.298,6.208,12.3675,24.735,49.47,98.94,197.88,494.7],
  S5: [1.649,2.4735,4.1225,8.245,16.49,32.98,65.96,131.92,263.84,659.6],
  S6: [2.037,3.298,6.208,12.3675,24.735,49.47,98.94,197.88,395.76,989.4],
  S7: [2.4735,4.1225,8.245,16.49,32.98,65.96,131.92,263.84,527.68,1319.2],
  S8: [3.298,6.208,12.3675,24.735,49.47,98.94,197.88,395.76,791.52,1978.8],
  S9: [4.1225,8.245,16.49,32.98,65.96,131.92,263.84,527.68,1055.36,2638.4]
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
