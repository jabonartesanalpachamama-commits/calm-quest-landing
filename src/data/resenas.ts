import img0 from "@/assets/resenas/marcos-jesus.webp";
import img1 from "@/assets/resenas/luii-gomez.webp";
import img2 from "@/assets/resenas/angie-garzon.webp";
import img3 from "@/assets/resenas/roxana-hernandez.webp";
import img4 from "@/assets/resenas/paula-jaramillo.webp";
import img5 from "@/assets/resenas/ana-preciado.webp";
import img6 from "@/assets/resenas/heal-u-fitness.webp";
import img7 from "@/assets/resenas/martha-gaitan.webp";
import img8 from "@/assets/resenas/jessika-florez.webp";
import img9 from "@/assets/resenas/wanda-helguero.webp";
import img10 from "@/assets/resenas/estefania-cespedes.webp";
import img11 from "@/assets/resenas/milena-val.webp";
import img12 from "@/assets/resenas/johanna-torres.webp";
import img13 from "@/assets/resenas/ana-ma-cedeno.webp";
import img14 from "@/assets/resenas/angie-echeverri.webp";

export type Resena = { id: string; nombre: string; categoria: "individual" | "pareja" | "yoga"; img: string };

export const RESENAS: Resena[] = [
  { id: "marcos-jesus", nombre: "Marcos Jesus", categoria: "individual", img: img0 },
  { id: "luii-gomez", nombre: "Luii Gomez", categoria: "individual", img: img1 },
  { id: "angie-garzon", nombre: "Angie Garzón", categoria: "pareja", img: img2 },
  { id: "roxana-hernandez", nombre: "Roxana Hernandez", categoria: "individual", img: img3 },
  { id: "paula-jaramillo", nombre: "Paula Jaramillo", categoria: "individual", img: img4 },
  { id: "ana-preciado", nombre: "Ana Preciado", categoria: "individual", img: img5 },
  { id: "heal-u-fitness", nombre: "Heal U Fitness", categoria: "yoga", img: img6 },
  { id: "martha-gaitan", nombre: "Martha Gaitan", categoria: "individual", img: img7 },
  { id: "jessika-florez", nombre: "Jessika Florez", categoria: "individual", img: img8 },
  { id: "wanda-helguero", nombre: "wanda helguero", categoria: "individual", img: img9 },
  { id: "estefania-cespedes", nombre: "Estefania Céspedes", categoria: "individual", img: img10 },
  { id: "milena-val", nombre: "Milena Val", categoria: "individual", img: img11 },
  { id: "johanna-torres", nombre: "Johanna Torres Almonacid", categoria: "yoga", img: img12 },
  { id: "ana-ma-cedeno", nombre: "Ana Ma Cedeño", categoria: "individual", img: img13 },
  { id: "angie-echeverri", nombre: "Angie Echeverri", categoria: "individual", img: img14 },
];

export const CATEGORIAS_RESENAS: { id: Resena["categoria"]; titulo: string }[] = [
  { id: "individual", titulo: "Terapia individual" },
  { id: "pareja", titulo: "Terapia de pareja" },
  { id: "yoga", titulo: "Yoga y meditación" },
];

export const agruparResenas = (resenas: Resena[] = RESENAS) => CATEGORIAS_RESENAS.map((categoria) => ({
  ...categoria,
  resenas: resenas.filter((resena) => resena.categoria === categoria.id),
}));

export const porIdsResena = (ids: string[]): Resena[] => ids.map((id) => RESENAS.find((r) => r.id === id)).filter((r): r is Resena => r !== undefined);

/** Original dimensions reserve space without cropping the screenshots. */
export const RESENA_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "marcos-jesus": { width: 1200, height: 264 },
  "luii-gomez": { width: 1200, height: 372 },
  "angie-garzon": { width: 1200, height: 759 },
  "roxana-hernandez": { width: 1200, height: 606 },
  "paula-jaramillo": { width: 1200, height: 833 },
  "ana-preciado": { width: 1200, height: 308 },
  "heal-u-fitness": { width: 1200, height: 340 },
  "martha-gaitan": { width: 1200, height: 542 },
  "jessika-florez": { width: 1200, height: 670 },
  "wanda-helguero": { width: 1200, height: 546 },
  "estefania-cespedes": { width: 1200, height: 573 },
  "milena-val": { width: 1200, height: 451 },
  "johanna-torres": { width: 1200, height: 340 },
  "ana-ma-cedeno": { width: 1200, height: 245 },
  "angie-echeverri": { width: 1200, height: 510 },
};
