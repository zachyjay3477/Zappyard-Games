import { countSymbol, createBoard, keyOf, tumble } from "./board.js";
import { findClusters } from "./clusters.js";
import { basePay } from "./paytable.js";
import { clusterTileMultiplier, createMultiplierGrid, upgradePositions } from "./multipliers.js";
import { maybeSpawnPowerup, resolvePowerups } from "./powerups.js";
function bonusAward(count) {
    if (count >= 4)
        return 10;
    if (count >= 3)
        return 5;
    return 0;
}
export function resolveSpin(rng, persistentMultipliers) {
    const board = createBoard(rng);
    const multipliers = persistentMultipliers ?? createMultiplierGrid();
    const initialBonusCount = countSymbol(board, "BONUS");
    const bonusSpinsAwarded = bonusAward(initialBonusCount);
    let totalWin = 0;
    let cascades = 0;
    let maxCascadeWin = 0;
    while (true) {
        const clusters = findClusters(board);
        if (!clusters.length)
            break;
        cascades++;
        const wins = [];
        const clusterPositions = new Map();
        const powerupSpawns = [];
        // Calculate payout BEFORE upgrading the tiles from this winning event.
        for (const cluster of clusters) {
            const b = basePay(cluster.symbol, cluster.positions.length);
            const tileMultiplier = clusterTileMultiplier(multipliers, cluster.positions);
            const payout = b * tileMultiplier;
            wins.push({
                symbol: cluster.symbol,
                size: cluster.positions.length,
                basePay: b,
                tileMultiplier,
                payout
            });
            for (const p of cluster.positions)
                clusterPositions.set(keyOf(p), p);
            const spawn = maybeSpawnPowerup(cluster, rng);
            if (spawn)
                powerupSpawns.push(spawn);
        }
        const cascadeWin = wins.reduce((sum, w) => sum + w.payout, 0);
        totalWin += cascadeWin;
        maxCascadeWin = Math.max(maxCascadeWin, cascadeWin);
        // Winning cells advance once.
        upgradePositions(multipliers, [...clusterPositions.values()]);
        // Powerup destruction is a separate resolution event, so affected cells
        // advance once for that event, even if multiple effects overlap.
        const powerupDestroyed = resolvePowerups(board, powerupSpawns, rng);
        if (powerupDestroyed.length)
            upgradePositions(multipliers, powerupDestroyed);
        const removed = new Set();
        for (const p of clusterPositions.values())
            removed.add(keyOf(p));
        for (const p of powerupDestroyed)
            removed.add(keyOf(p));
        tumble(board, removed, rng);
    }
    return {
        totalWin,
        cascades,
        hadWin: totalWin > 0,
        bonusSymbols: initialBonusCount,
        bonusTriggered: bonusSpinsAwarded > 0,
        bonusSpinsAwarded,
        maxCascadeWin
    };
}
export function resolveFeature(rng, startingSpins) {
    const multipliers = createMultiplierGrid();
    let remaining = startingSpins;
    let totalWin = 0;
    let spinsPlayed = 0;
    let extraSpinsAwarded = 0;
    let cascades = 0;
    while (remaining > 0) {
        remaining--;
        spinsPlayed++;
        const result = resolveSpin(rng, multipliers);
        totalWin += result.totalWin;
        cascades += result.cascades;
        // During Free Spins: every BONUS symbol appearing on the initial board grants +1.
        if (result.bonusSymbols > 0) {
            remaining += result.bonusSymbols;
            extraSpinsAwarded += result.bonusSymbols;
        }
        // No separate 3/4 BONUS retrigger award inside the feature;
        // the user-defined +1 per BONUS rule is the retrigger mechanic.
    }
    return { totalWin, spinsPlayed, extraSpinsAwarded, cascades };
}
