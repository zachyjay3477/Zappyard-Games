# Zappyard Games — Slot 01 Math Simulator

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
