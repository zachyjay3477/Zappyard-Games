import { describe, expect, it } from "vitest";
import { findClusters } from "../src/clusters.js";
import type { Board } from "../src/board.js";

const c = (symbol: any) => ({ symbol });

describe("findClusters", () => {
  it("finds orthogonal clusters of 5+", () => {
    const board: Board = [
      [c("S1"),c("S1"),c("S1"),c("S2"),c("S3"),c("S4"),c("S5")],
      [c("S1"),c("S1"),c("S2"),c("S2"),c("S3"),c("S4"),c("S5")],
      [c("S2"),c("S2"),c("S2"),c("S3"),c("S4"),c("S5"),c("S6")],
      [c("S3"),c("S4"),c("S5"),c("S6"),c("S7"),c("S8"),c("S9")],
      [c("S9"),c("S8"),c("S7"),c("S6"),c("S5"),c("S4"),c("S3")]
    ];

    const clusters = findClusters(board);
    expect(clusters.some(x => x.symbol === "S1" && x.positions.length === 5)).toBe(true);
  });

  it("does not count diagonal-only connections", () => {
    const board: Board = [
      [c("S1"),c("S2"),c("S3"),c("S4"),c("S5"),c("S6"),c("S7")],
      [c("S2"),c("S1"),c("S3"),c("S4"),c("S5"),c("S6"),c("S7")],
      [c("S2"),c("S3"),c("S1"),c("S4"),c("S5"),c("S6"),c("S7")],
      [c("S2"),c("S3"),c("S4"),c("S1"),c("S5"),c("S6"),c("S7")],
      [c("S2"),c("S3"),c("S4"),c("S5"),c("S1"),c("S6"),c("S7")]
    ];

    expect(findClusters(board).some(x => x.symbol === "S1")).toBe(false);
  });
});
