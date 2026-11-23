import { describe, expect, it } from "vitest";
import { agruparResenas, FEATURED_RESENAS, RESENAS } from "./resenas";

describe("Google review categories", () => {
  it("limits shared reviews to the four client-selected screenshots in order", () => {
    expect(FEATURED_RESENAS.map(r => r.id)).toEqual(["luii-gomez", "ana-preciado", "jessika-florez", "marcos-jesus"]);
  });
  it("retains all fifteen screenshots for the grouped gallery", () => {
    expect(agruparResenas().flatMap(group => group.resenas)).toHaveLength(15);
  });
  it("groups the twelve individual therapy reviews in the requested order", () => {
    expect(agruparResenas()[0].resenas.map((r) => r.id)).toEqual([
      "marcos-jesus", "luii-gomez", "roxana-hernandez", "paula-jaramillo", "ana-preciado", "martha-gaitan",
      "jessika-florez", "wanda-helguero", "estefania-cespedes", "milena-val", "ana-ma-cedeno", "angie-echeverri",
    ]);
  });
  it("groups Angie Garzón under couple therapy", () => {
    expect(agruparResenas()[1].resenas.map((r) => r.id)).toEqual(["angie-garzon"]);
  });
  it("groups the two yoga reviews in the requested order", () => {
    expect(agruparResenas()[2].resenas.map((r) => r.id)).toEqual(["heal-u-fitness", "johanna-torres"]);
  });
  it("moves a review by changing only its category data", () => {
    const moved = RESENAS.map((r) => r.id === "marcos-jesus" ? { ...r, categoria: "yoga" as const } : r);
    const grouped = agruparResenas(moved);
    expect(grouped[0].resenas.some((r) => r.id === "marcos-jesus")).toBe(false);
    expect(grouped[2].resenas.map((r) => r.id)).toContain("marcos-jesus");
  });
});