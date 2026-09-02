import { COLS, PAYING_SYMBOLS, POWERUP_ODDS, ROWS } from "./config.js";
import { keyOf } from "./board.js";
function oddsFor(size) {
    return POWERUP_ODDS.find(x => size >= x.min && size <= x.max)?.odds ?? {};
}
export function maybeSpawnPowerup(cluster, rng) {
    const odds = oddsFor(cluster.positions.length);
    const roll = rng.next();
    let cursor = 0;
    const order = ["BLAST", "CROSS", "COLOR_CLEAR"];
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
function blastPositions(center) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const row = center.row + dr;
            const col = center.col + dc;
            if (row >= 0 && row < ROWS && col >= 0 && col < COLS)
                out.push({ row, col });
        }
    }
    return out;
}
function crossPositions(center) {
    const out = [];
    for (let col = 0; col < COLS; col++)
        out.push({ row: center.row, col });
    for (let row = 0; row < ROWS; row++)
        out.push({ row, col: center.col });
    return out;
}
function colorClearPositions(board, rng) {
    const present = new Set();
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const s = board[row][col].symbol;
            if (PAYING_SYMBOLS.includes(s))
                present.add(s);
        }
    }
    if (!present.size)
        return [];
    const chosen = rng.pick([...present]);
    const out = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col].symbol === chosen)
                out.push({ row, col });
        }
    }
    return out;
}
export function resolvePowerups(board, spawns, rng) {
    // v0.1: powerups are generated from wins and resolve immediately.
    // Chain-reaction infrastructure is represented here; future powerups
    // can be queued if we later allow spawned powerups to occupy board cells.
    const queue = [...spawns];
    const destroyed = new Map();
    while (queue.length) {
        const p = queue.shift();
        let affected = [];
        if (p.type === "BLAST")
            affected = blastPositions(p.position);
        else if (p.type === "CROSS")
            affected = crossPositions(p.position);
        else
            affected = colorClearPositions(board, rng);
        for (const pos of affected)
            destroyed.set(keyOf(pos), pos);
    }
    return [...destroyed.values()];
}
