import { COLS, ROWS, TILE_MULTIPLIER_CAP } from "./config.js";
export function createMultiplierGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(1));
}
export function upgradeMultiplier(value) {
    if (value <= 1)
        return 2;
    return Math.min(TILE_MULTIPLIER_CAP, value * 2);
}
export function upgradePositions(grid, positions) {
    const seen = new Set();
    for (const p of positions) {
        const key = `${p.row},${p.col}`;
        if (seen.has(key))
            continue;
        seen.add(key);
        grid[p.row][p.col] = upgradeMultiplier(grid[p.row][p.col]);
    }
}
export function clusterTileMultiplier(grid, positions) {
    let sum = 0;
    for (const p of positions) {
        const value = grid[p.row][p.col];
        if (value > 1)
            sum += value;
    }
    return sum > 0 ? sum : 1;
}
