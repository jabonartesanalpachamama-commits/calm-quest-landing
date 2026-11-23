import { describe, expect, it } from "vitest";
import { proximityShift } from "./LineSidebar";
import { START_OPTIONS } from "@/data/caminos";

describe("Home path selector", () => {
  it("limits cursor displacement to 26 px", () => {
    expect(proximityShift(0)).toBe(26);
    expect(proximityShift(90)).toBe(13);
    expect(proximityShift(180)).toBe(0);
    expect(proximityShift(-180)).toBe(0);
  });
  it("preserves all five requested destinations", () => {
    expect(START_OPTIONS.map(item => item.href)).toEqual([
      "/mi-proceso-individual", "/proceso-de-pareja", "/acompanamiento-individual",
      "/curso-iniciacion-yoga", "/sabiduria-ciclica-esencia-femenina",
    ]);
  });
});