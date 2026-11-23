import { describe, expect, it } from "vitest";
import { PROGRAMS } from "./programas";
import { PATH_PHOTOS } from "./caminos";

describe("Programas yoga-only catalog", () => {
  it("shows only the three requested yoga and wellbeing destinations in order", () => {
    expect(PROGRAMS.map(program => program.href)).toEqual([
      "/curso-iniciacion-yoga",
      "/sabiduria-ciclica-esencia-femenina",
      "/acompanamiento-individual",
    ]);
  });
  it("uses each program's existing photograph", () => {
    expect(PROGRAMS.map(program => program.image)).toEqual([
      PATH_PHOTOS.curso.image, PATH_PHOTOS.ciclica.image, PATH_PHOTOS.yoga.image,
    ]);
  });
});