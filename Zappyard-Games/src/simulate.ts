import { resolveFeature, resolveSpin } from "./game.js";
import { RNG } from "./rng.js";

function arg(name: string, fallback: number): number {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && process.argv[idx + 1]) return Number(process.argv[idx + 1]);
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

const buckets = {
  "0x": 0,
  "(0,1)x": 0,
  "[1,5)x": 0,
  "[5,10)x": 0,
  "[10,50)x": 0,
  "[50,100)x": 0,
  "[100,1000)x": 0,
  "1000x+": 0
};

function bucket(win: number): keyof typeof buckets {
  if (win === 0) return "0x";
  if (win < 1) return "(0,1)x";
  if (win < 5) return "[1,5)x";
  if (win < 10) return "[5,10)x";
  if (win < 50) return "[10,50)x";
  if (win < 100) return "[50,100)x";
  if (win < 1000) return "[100,1000)x";
  return "1000x+";
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
  }

  if (spinReturn > 0) hits++;
  totalReturn += spinReturn;
  biggestWin = Math.max(biggestWin, spinReturn);
  buckets[bucket(spinReturn)]++;
}

const pct = (v: number) => `${(v * 100).toFixed(4)}%`;
const rate = bonusCount ? (spins / bonusCount).toFixed(2) : "∞";

console.log("");
console.log("ZAPPYARD SLOT 01 — v0.1 MONTE CARLO");
console.log("-----------------------------------");
console.log(`Spins:               ${spins.toLocaleString()}`);
console.log(`Seed:                ${seed}`);
console.log(`RTP:                 ${pct(totalReturn / totalBet)}`);
console.log(`Base RTP:            ${pct(baseReturn / totalBet)}`);
console.log(`Bonus RTP:           ${pct(bonusReturn / totalBet)}`);
console.log(`Hit frequency:       ${pct(hits / spins)}`);
console.log(`Bonus frequency:     1 / ${rate}`);
console.log(`Avg cascades/spin:   ${(totalCascades / spins).toFixed(4)}`);
console.log(`Largest total win:   ${biggestWin.toFixed(2)}x`);
console.log(`Largest base win:    ${biggestBase.toFixed(2)}x`);
console.log(`Largest feature:     ${biggestFeature.toFixed(2)}x`);
console.log("");
console.log("WIN DISTRIBUTION");
for (const [name, count] of Object.entries(buckets)) {
  console.log(`${name.padEnd(14)} ${pct(count / spins)}`);
}
