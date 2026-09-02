import { PAY_BANDS, PAYTABLE } from "./config.js";
import type { PayingSymbol } from "./types.js";

export function basePay(symbol: PayingSymbol, clusterSize: number): number {
  const idx = PAY_BANDS.findIndex(b => clusterSize >= b.min && clusterSize <= b.max);
  if (idx < 0) return 0;
  return PAYTABLE[symbol][idx]!;
}
