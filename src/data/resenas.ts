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

export type Resena = { id: string; nombre: string; antiguedad: string; img: string };

export const RESENAS: Resena[] = [
  { id: "marcos-jesus", nombre: "Marcos Jesus", antiguedad: "hace 2 años", img: img0 },
  { id: "luii-gomez", nombre: "Luii Gomez", antiguedad: "hace 6 meses", img: img1 },
  { id: "angie-garzon", nombre: "Angie Garzón", antiguedad: "Editado hace 2 meses", img: img2 },
  { id: "roxana-hernandez", nombre: "Roxana Hernandez", antiguedad: "editado hace un año", img: img3 },
  { id: "paula-jaramillo", nombre: "Paula Jaramillo", antiguedad: "hace un año", img: img4 },
  { id: "ana-preciado", nombre: "Ana Preciado", antiguedad: "hace un año", img: img5 },
  { id: "heal-u-fitness", nombre: "Heal U Fitness", antiguedad: "hace 3 meses", img: img6 },
  { id: "martha-gaitan", nombre: "Martha Gaitan", antiguedad: "editado hace 2 años", img: img7 },
  { id: "jessika-florez", nombre: "Jessika Florez", antiguedad: "hace 2 años", img: img8 },
  { id: "wanda-helguero", nombre: "wanda helguero", antiguedad: "hace 2 años", img: img9 },
  { id: "estefania-cespedes", nombre: "Estefania Céspedes", antiguedad: "hace 2 años", img: img10 },
  { id: "milena-val", nombre: "Milena Val", antiguedad: "hace 2 años", img: img11 },
  { id: "johanna-torres", nombre: "Johanna Torres Almonacid", antiguedad: "editado hace un año", img: img12 },
  { id: "ana-ma-cedeno", nombre: "Ana Ma Cedeño", antiguedad: "hace un año", img: img13 },
  { id: "angie-echeverri", nombre: "Angie Echeverri", antiguedad: "hace 3 años", img: img14 },
];

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
