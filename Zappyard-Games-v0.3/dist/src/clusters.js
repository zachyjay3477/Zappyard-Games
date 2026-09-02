import { COLS, ROWS, PAYING_SYMBOLS } from "./config.js";
const payingSet = new Set(PAYING_SYMBOLS);
export function findClusters(board) {
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const clusters = [];
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (visited[row][col])
                continue;
            const symbol = board[row][col].symbol;
            if (!payingSet.has(symbol)) {
                visited[row][col] = true;
                continue;
            }
            const positions = [];
            const stack = [{ row, col }];
            visited[row][col] = true;
            while (stack.length) {
                const p = stack.pop();
                positions.push(p);
                const neighbors = [
                    { row: p.row - 1, col: p.col },
                    { row: p.row + 1, col: p.col },
                    { row: p.row, col: p.col - 1 },
                    { row: p.row, col: p.col + 1 }
                ];
                for (const n of neighbors) {
                    if (n.row < 0 || n.row >= ROWS || n.col < 0 || n.col >= COLS)
                        continue;
                    if (visited[n.row][n.col])
                        continue;
                    if (board[n.row][n.col].symbol !== symbol)
                        continue;
                    visited[n.row][n.col] = true;
                    stack.push(n);
                }
            }
            if (positions.length >= 5) {
                clusters.push({ symbol: symbol, positions });
            }
        }
    }
    return clusters;
}
