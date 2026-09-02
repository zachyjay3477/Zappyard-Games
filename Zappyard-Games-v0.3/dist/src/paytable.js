import { PAY_BANDS, PAYTABLE } from "./config.js";
export function basePay(symbol, clusterSize) {
    const idx = PAY_BANDS.findIndex(b => clusterSize >= b.min && clusterSize <= b.max);
    if (idx < 0)
        return 0;
    return PAYTABLE[symbol][idx];
}
