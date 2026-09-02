import { COLS, ROWS, SYMBOL_WEIGHTS } from "./config.js";
const weightedEntries = Object.entries(SYMBOL_WEIGHTS);
const totalWeight = weightedEntries.reduce((sum, [, w]) => sum + w, 0);
export function drawSymbol(rng) {
    let roll = rng.next() * totalWeight;
    for (const [symbol, weight] of weightedEntries) {
        roll -= weight;
        if (roll < 0)
            return symbol;
    }
    return weightedEntries[weightedEntries.length - 1][0];
}
export function createBoard(rng) {
    return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ symbol: drawSymbol(rng) })));
}
export function cloneBoard(board) {
    return board.map(row => row.map(cell => ({ ...cell })));
}
export function countSymbol(board, symbol) {
    let n = 0;
    for (const row of board)
        for (const cell of row)
            if (cell.symbol === symbol)
                n++;
    return n;
}
export function tumble(board, removed, rng) {
    for (let col = 0; col < COLS; col++) {
        const survivors = [];
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!removed.has(`${row},${col}`))
                survivors.push(board[row][col]);
        }
        let writeRow = ROWS - 1;
        for (const cell of survivors) {
            board[writeRow][col] = cell;
            writeRow--;
        }
        while (writeRow >= 0) {
            board[writeRow][col] = { symbol: drawSymbol(rng) };
            writeRow--;
        }
    }
}
export function keyOf(p) {
    return `${p.row},${p.col}`;
}
