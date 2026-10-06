/**
 * Participaciones de Fransury, mostradas en la franja de logos de la portada.
 *
 * Los logos viven en src/assets/participaciones/ (webp, fondo transparente; uso autorizado).
 * Para agregar uno: guarda el archivo allí, impórtalo abajo y añade una entrada con
 * `logo`, `alt` y `h` (alto óptico en clases de Tailwind, para que todos pesen parecido).
 * Sin `logo`, se muestra el nombre como texto.
 */
import teleantioquia from "@/assets/participaciones/teleantioquia.webp";
import telemedellin from "@/assets/participaciones/telemedellin.webp";
import caracolRadio from "@/assets/participaciones/caracol-radio.webp";
import mariaElenaBadillo from "@/assets/participaciones/maria-elena-badillo.webp";
import mindalia from "@/assets/participaciones/mindalia.webp";
import televid from "@/assets/participaciones/televid.webp";

export type Participacion = { name: string; logo?: string; alt: string; h?: string };

export const PARTICIPACIONES: Participacion[] = [
  { name: "Teleantioquia", logo: teleantioquia, alt: "Logo de Teleantioquia", h: "h-10 md:h-12" },
  { name: "TeleMedellín", logo: telemedellin, alt: "Logo de TeleMedellín", h: "h-14 md:h-16" },
  { name: "Caracol Radio", logo: caracolRadio, alt: "Logo de Caracol Radio", h: "h-14 md:h-16" },
  { name: "Centro de Bienestar Emocional María Elena Badillo", logo: mariaElenaBadillo, alt: "Logo del Centro de Bienestar Emocional María Elena Badillo", h: "h-10 md:h-12" },
  { name: "Mindalia", logo: mindalia, alt: "Logo de Mindalia", h: "h-7 md:h-8" },
  { name: "Televid", logo: televid, alt: "Logo de Televid", h: "h-14 md:h-16" },
];
