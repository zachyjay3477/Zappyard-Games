# Zappyard Games — Slot 01 Math Simulator — v0.2

Initial math prototype for a 7×5 modern cluster/cascade slot.

## Current rules

- 7 columns × 5 rows
- 9 progressively rarer paying symbols
- 5+ orthogonally connected symbols form a cluster
- Cascades/tumbles continue until no new cluster exists
- No Wild
- BONUS symbols do not pay
- 3 BONUS symbols trigger 5 Free Spins
- 4+ BONUS symbols trigger 10 Free Spins
- During Free Spins, every BONUS symbol that lands adds +1 spin
- Tile multipliers:
  - start at ×1
  - winning/destroyed tiles advance ×1 → ×2 → ×4 ... → ×4096
  - developed multipliers are added together for a cluster
  - ×1 tiles do not contribute to the multiplier sum
  - base-game tile multipliers reset after the paid spin finishes
  - Free Spin tile multipliers persist through the full feature
- Powerups:
  - Blast: destroys a 3×3 area
  - Cross: destroys full row + column
  - Color Clear: destroys all instances of one paying symbol currently on the board
  - powerups may trigger other powerups
  - destroyed tiles upgrade once per resolution event
  - powerup spawn odds increase with winning cluster size

## Important

This is a **v0.1 simulator**, not final certified math.

The BONUS symbol weight, paytable, symbol weights, and powerup probabilities are seed values to be tuned from simulation output.

## Setup

```bash
npm install
npm run simulate -- --spins 100000
npm test
```

For a larger Monte Carlo run:

```bash
npm run simulate -- --spins 10000000
```

Optional deterministic seed:

```bash
npm run simulate -- --spins 1000000 --seed 3477
```


## v0.2 baseline calibration

A 500,000-spin Monte Carlo pass using the v0.2 symbol weights and paytable produced approximately:

- Total RTP: **95.71%**
- Base RTP: **80.66%**
- Bonus RTP: **15.06%**
- Hit frequency: **33.12%**
- Bonus frequency: **1 in 191.4** paid spins
- Average cascades per paid spin: **0.399**
- Largest observed total win: **2,570.35x**

These are development measurements, not certified production figures. Longer runs and further feature validation are required.


## v0.2.1 reporting update

`simulate.ts` now reports modern-slot volatility buckets and Free Spin length distribution. See `results/v0.2-volatility-2m.txt` for the 2,000,000-spin validation run.
