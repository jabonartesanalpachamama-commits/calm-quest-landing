import { PATH_PHOTOS } from "@/data/caminos";

/** «Mis programas y espacios»: se muestran en /programas. Editar aquí textos, enlaces e imágenes. */
export const PROGRAMS = [
  {
    ...PATH_PHOTOS.curso,
    title: "Curso de Iniciación al Yoga",
    subtitle: "Habitar el yoga como una práctica del día a día",
    desc: "Un viaje de un año dividido en 6 módulos, para integrar el yoga, la meditación y la conciencia en tu vida cotidiana.",
    features: ["100% Virtual", "Encuentros bimensuales", "Acompañamiento continuo"],
    href: "/curso-iniciacion-yoga",
  },
  {
    ...PATH_PHOTOS.ciclica,
    title: "Sabiduría Cíclica, Esencia Femenina",
    subtitle: "Reconecta con tu naturaleza. Habita tu poder. Recuerda tu ritmo.",
    desc: "Experiencia grupal de reconexión profunda para mujeres que desean comprender su naturaleza cíclica, transformar su relación con la menstruación e intuición.",
    features: ["100% Virtual", "Comunidad de apoyo", "Sabiduría ancestral & corporal"],
    href: "/sabiduria-ciclica-esencia-femenina",
  },
  {
    ...PATH_PHOTOS.yoga,
    title: "Acompañamiento Individual 1:1",
    subtitle: "YogaTerapia, Kundalini Yoga y Meditación",
    desc: "Clases privadas y programas adaptados a tu momento vital, tu historia y tu camino personal. Es un espacio diseñado para cultivar claridad y regulación interna.",
    features: ["Sesiones personalizadas", "Formato 1 a 1", "100% Virtual"],
    href: "/acompanamiento-individual",
  },
];
