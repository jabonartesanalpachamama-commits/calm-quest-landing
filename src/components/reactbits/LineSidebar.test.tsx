import { describe, expect, it } from "vitest";
import { START_OPTIONS } from "@/data/caminos";

describe("Home path selector", () => {
  it("preserves all five requested destinations", () => {
    expect(START_OPTIONS.map(item => item.href)).toEqual([
      "/mi-proceso-individual", "/proceso-de-pareja", "/acompanamiento-individual",
      "/curso-iniciacion-yoga", "/sabiduria-ciclica-esencia-femenina",
    ]);
  });
});