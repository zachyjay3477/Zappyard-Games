export type PayingSymbol =
  | "S1" | "S2" | "S3" | "S4" | "S5"
  | "S6" | "S7" | "S8" | "S9";

export type SymbolId = PayingSymbol | "BONUS";

export type PowerupType = "BLAST" | "CROSS" | "COLOR_CLEAR";

export interface Cell {
  symbol: SymbolId;
}

export interface Position {
  row: number;
  col: number;
}

export interface Cluster {
  symbol: PayingSymbol;
  positions: Position[];
}

export interface PowerupSpawn {
  type: PowerupType;
  position: Position;
}

export interface CascadeWin {
  symbol: PayingSymbol;
  size: number;
  basePay: number;
  tileMultiplier: number;
  payout: number;
}

export interface SpinResult {
  totalWin: number;
  cascades: number;
  hadWin: boolean;
  bonusSymbols: number;
  bonusTriggered: boolean;
  bonusSpinsAwarded: number;
  maxCascadeWin: number;
}

export interface FeatureResult {
  totalWin: number;
  spinsPlayed: number;
  extraSpinsAwarded: number;
  cascades: number;
}
