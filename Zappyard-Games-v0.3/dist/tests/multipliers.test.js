import { describe, expect, it } from "vitest";
import { clusterTileMultiplier, createMultiplierGrid, upgradeMultiplier, upgradePositions } from "../src/multipliers.js";
describe("tile multipliers", () => {
    it("follows the doubling ladder and caps at 4096", () => {
        expect(upgradeMultiplier(1)).toBe(2);
        expect(upgradeMultiplier(2)).toBe(4);
        expect(upgradeMultiplier(2048)).toBe(4096);
        expect(upgradeMultiplier(4096)).toBe(4096);
    });
    it("adds developed multipliers and excludes x1 tiles", () => {
        const grid = createMultiplierGrid();
        grid[0][0] = 2;
        grid[0][1] = 4;
        grid[0][2] = 8;
        expect(clusterTileMultiplier(grid, [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 }
        ])).toBe(14);
    });
    it("upgrades a tile only once when duplicate positions are supplied", () => {
        const grid = createMultiplierGrid();
        upgradePositions(grid, [
            { row: 0, col: 0 },
            { row: 0, col: 0 }
        ]);
        expect(grid[0][0]).toBe(2);
    });
});
