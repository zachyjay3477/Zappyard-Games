import type { PayingSymbol, PowerupType } from "./types.js";

export const ROWS = 5;
export const COLS = 7;

export const PAYING_SYMBOLS: PayingSymbol[] = [
  "S1","S2","S3","S4","S5","S6","S7","S8","S9"
];

// Relative reel weights. BONUS is intentionally a conservative v0.1 seed.
// We will tune this after measuring bonus frequency.
export const SYMBOL_WEIGHTS: Record<PayingSymbol | "BONUS", number> = {
  S1: 18,
  S2: 17,
  S3: 15,
  S4: 13,
  S5: 11,
  S6: 9,
  S7: 7,
  S8: 6,
  S9: 4,
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

export const PAYTABLE: Record<PayingSymbol, number[]> = {
  S1: [0.10,0.15,0.20,0.30,0.50,1,2,4,8,20],
  S2: [0.10,0.15,0.25,0.40,0.75,1.5,3,6,12,30],
  S3: [0.15,0.20,0.30,0.50,1,2,4,8,16,40],
  S4: [0.15,0.25,0.40,0.75,1.5,3,6,12,24,60],
  S5: [0.20,0.30,0.50,1,2,4,8,16,32,80],
  S6: [0.25,0.40,0.75,1.5,3,6,12,24,48,120],
  S7: [0.30,0.50,1,2,4,8,16,32,64,160],
  S8: [0.40,0.75,1.5,3,6,12,24,48,96,240],
  S9: [0.50,1,2,4,8,16,32,64,128,320]
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
