import { createMockPot, createMockSession } from "~/models/mock-data";
import { calculatePotProfit, sumSessionsTotal } from "..";
import { describe, expect, it } from "@jest/globals";

describe("sumSessionsTotal", () => {
  it("should return 0 if sessions is empty", () => {
    expect(sumSessionsTotal([])).toBe(0);
  });
  it("should return the session total when passed one session", () => {
    const session = createMockSession({ total: 100 });
    expect(sumSessionsTotal([session])).toBe(100);
  });
  it("should return the session total when passed multiple sessions", () => {
    const session1 = createMockSession({ total: 100 });
    const session2 = createMockSession({ total: 200 });
    expect(sumSessionsTotal([session1, session2])).toBe(300);
  });
});
describe("calculatePotProfit", () => {
  it("should return 0 if there is no recent session", () => {
    const pot = createMockPot({ float: 100 });
    expect(calculatePotProfit(pot, undefined)).toBe(0);
  });
  it("should return the difference between the float and the total from the most recent session", () => {
    const pot = createMockPot({ float: 1000 });
    const session = createMockSession({ total: 1100 });
    expect(calculatePotProfit(pot, session)).toBe(100);
  });
  it("should return the difference between the float and the total from the most recent session deducting top_ups", () => {
    const pot = createMockPot({ float: 1000 });
    const session = createMockSession({ total: 2000, top_ups_total: 100 });
    expect(calculatePotProfit(pot, session)).toBe(900);
  });
  it("should return negative numbers", () => {
    const pot = createMockPot({ float: 1000 });
    const session = createMockSession({ total: 100 });
    expect(calculatePotProfit(pot, session)).toBe(-900);
  });
});
