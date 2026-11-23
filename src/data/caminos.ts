import individual from "@/assets/fransury-individual.webp";
import pareja from "@/assets/pareja-manos.webp";
import parejaMobile from "@/assets/pareja-manos-900.webp";
import yoga from "@/assets/fransury-yoga-nueva.webp";
import curso from "@/assets/curso-hero.png.asset.json";

export const PATH_PHOTOS = {
  individual: { image: individual, position: "object-[50%_20%]", alt: "Fransury González en su espacio de acompañamiento individual" },
  pareja: { image: pareja, imageSrcSet: `${parejaMobile} 900w, ${pareja} 1657w`, position: "object-center", alt: "Manos de una pareja entrelazadas" },
  yoga: { image: yoga, position: "object-[50%_20%]", alt: "Fransury González practicando yoga" },
  curso: { image: curso.url, position: "object-center", alt: "Fotografía del Curso de Iniciación al Yoga" },
  ciclica: { image: "/sabiduria-ciclica-hero.webp", position: "object-center", alt: "Fotografía principal de Sabiduría Cíclica, Esencia Femenina" },
};

export const START_OPTIONS = [
  { title: "Quiero comprender por qué me pasa lo que me pasa", href: "/mi-proceso-individual", desc: "Un espacio terapéutico para comprender lo que estás viviendo.", ...PATH_PHOTOS.individual },
  { title: "Mi relación atraviesa un conflicto", href: "/proceso-de-pareja", desc: "Un espacio para observar lo que está ocurriendo y mejorar la comunicación.", ...PATH_PHOTOS.pareja },
  { title: "Quiero calmar mi cuerpo y mi mente", href: "/acompanamiento-individual", desc: "Yoga y meditación en un espacio adaptado a tu momento vital.", ...PATH_PHOTOS.yoga },
  { title: "Quiero aprender yoga desde cero", href: "/curso-iniciacion-yoga", desc: "Habitar el yoga como una práctica del día a día.", ...PATH_PHOTOS.curso },
  { title: "Quiero comprender mi ciclo", href: "/sabiduria-ciclica-esencia-femenina", desc: "Reconecta con tu naturaleza. Recuerda tu ritmo.", ...PATH_PHOTOS.ciclica },
];