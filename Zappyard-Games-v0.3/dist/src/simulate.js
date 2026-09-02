import { resolveFeature, resolveSpin } from "./game.js";
import { RNG } from "./rng.js";
function arg(name, fallback) {
    const idx = process.argv.indexOf(name);
    if (idx >= 0 && process.argv[idx + 1])
        return Number(process.argv[idx + 1]);
    return fallback;
}
const spins = Math.max(1, Math.floor(arg("--spins", 100000)));
const seed = Math.floor(arg("--seed", 3477));
const rng = new RNG(seed);
let totalBet = 0;
let totalReturn = 0;
let baseReturn = 0;
let bonusReturn = 0;
let hits = 0;
let bonusCount = 0;
let totalCascades = 0;
let biggestWin = 0;
let biggestBase = 0;
let biggestFeature = 0;
let totalFeatureSpins = 0;
let totalExtraFeatureSpins = 0;
const buckets = {
    "0x": 0,
    "(0,1)x": 0,
    "[1,5)x": 0,
    "[5,20)x": 0,
    "[20,100)x": 0,
    "[100,500)x": 0,
    "[500,1000)x": 0,
    "[1000,5000)x": 0,
    "5000x+": 0
};
const featureLengthBuckets = {
    "<=5": 0,
    "6-10": 0,
    "11-15": 0,
    "16-20": 0,
    "21-30": 0,
    "31+": 0
};
function bucket(win) {
    if (win === 0)
        return "0x";
    if (win < 1)
        return "(0,1)x";
    if (win < 5)
        return "[1,5)x";
    if (win < 20)
        return "[5,20)x";
    if (win < 100)
        return "[20,100)x";
    if (win < 500)
        return "[100,500)x";
    if (win < 1000)
        return "[500,1000)x";
    if (win < 5000)
        return "[1000,5000)x";
    return "5000x+";
}
function featureLengthBucket(n) {
    if (n <= 5)
        return "<=5";
    if (n <= 10)
        return "6-10";
    if (n <= 15)
        return "11-15";
    if (n <= 20)
        return "16-20";
    if (n <= 30)
        return "21-30";
    return "31+";
}
for (let i = 0; i < spins; i++) {
    totalBet += 1;
    const base = resolveSpin(rng);
    baseReturn += base.totalWin;
    totalCascades += base.cascades;
    let spinReturn = base.totalWin;
    biggestBase = Math.max(biggestBase, base.totalWin);
    if (base.bonusTriggered) {
        bonusCount++;
        const feature = resolveFeature(rng, base.bonusSpinsAwarded);
        bonusReturn += feature.totalWin;
        spinReturn += feature.totalWin;
        biggestFeature = Math.max(biggestFeature, feature.totalWin);
        totalFeatureSpins += feature.spinsPlayed;
        totalExtraFeatureSpins += feature.extraSpinsAwarded;
        featureLengthBuckets[featureLengthBucket(feature.spinsPlayed)]++;
    }
    if (spinReturn > 0)
        hits++;
    totalReturn += spinReturn;
    biggestWin = Math.max(biggestWin, spinReturn);
    buckets[bucket(spinReturn)]++;
}
const pct = (v) => `${(v * 100).toFixed(5)}%`;
const rate = bonusCount ? (spins / bonusCount).toFixed(2) : "∞";
console.log("");
console.log("ZAPPYARD SLOT 01 — VOLATILITY REPORT");
console.log("------------------------------------");
console.log(`Spins:                    ${spins.toLocaleString()}`);
console.log(`Seed:                     ${seed}`);
console.log(`RTP:                      ${pct(totalReturn / totalBet)}`);
console.log(`Base RTP:                 ${pct(baseReturn / totalBet)}`);
console.log(`Bonus RTP:                ${pct(bonusReturn / totalBet)}`);
console.log(`Hit frequency:            ${pct(hits / spins)}`);
console.log(`Bonus frequency:          1 / ${rate}`);
console.log(`Avg cascades/paid spin:   ${(totalCascades / spins).toFixed(5)}`);
console.log(`Largest total win:        ${biggestWin.toFixed(2)}x`);
console.log(`Largest base win:         ${biggestBase.toFixed(2)}x`);
console.log(`Largest feature win:      ${biggestFeature.toFixed(2)}x`);
if (bonusCount > 0) {
    console.log(`Avg feature spins played: ${(totalFeatureSpins / bonusCount).toFixed(3)}`);
    console.log(`Avg +1 spins / feature:   ${(totalExtraFeatureSpins / bonusCount).toFixed(3)}`);
}
console.log("");
console.log("WIN DISTRIBUTION");
for (const [name, count] of Object.entries(buckets)) {
    console.log(`${name.padEnd(18)} ${pct(count / spins)}  (${count.toLocaleString()})`);
}
console.log("");
console.log("FEATURE LENGTH DISTRIBUTION");
for (const [name, count] of Object.entries(featureLengthBuckets)) {
    const share = bonusCount ? count / bonusCount : 0;
    console.log(`${name.padEnd(18)} ${pct(share)}  (${count.toLocaleString()})`);
}
