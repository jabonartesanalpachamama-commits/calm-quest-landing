/**
 * Participaciones de Fransury ("Ha participado en"), mostradas en la franja de la portada.
 *
 * Cómo agregar logos:
 *  1. Guarda el archivo del logo en src/assets/participaciones/ (por ejemplo teleantioquia.webp).
 *  2. Impórtalo arriba:  import teleantioquia from "@/assets/participaciones/teleantioquia.webp";
 *  3. Asígnalo al campo `logo` de la entrada:  logo: teleantioquia
 *  Mientras `logo` no exista, se muestra el nombre como texto (wordmark).
 *
 * Leidy confirmará otras participaciones; agrégalas aquí, en este único arreglo.
 */
export type Participacion = { name: string; logo?: string; alt: string };

export const PARTICIPACIONES: Participacion[] = [
  { name: "Teleantioquia", alt: "Logo de Teleantioquia" },
  { name: "Centro de Bienestar Emocional María Elena Badillo", alt: "Logo del Centro de Bienestar Emocional María Elena Badillo" },
  { name: "Televid", alt: "Logo de Televid" },
];
