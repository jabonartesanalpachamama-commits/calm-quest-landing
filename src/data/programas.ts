import bannerAcompanamiento from "@/assets/fransury-individual.webp";
import paraQuienImage from "@/assets/pareja-manos.webp";
import paraQuienImage900 from "@/assets/pareja-manos-900.webp";
import fransuryYogaHome from "@/assets/fransury-yoga-home.webp";

/** «Mis programas y espacios»: se muestran en /programas. Editar aquí textos, enlaces e imágenes. */
export const PROGRAMS = [
  {
    title: "Mi Proceso Individual",
    subtitle: "Psicoterapia Individual",
    desc: "Un espacio terapéutico para comprender lo que estás viviendo, reconocer tus patrones emocionales y desarrollar nuevas maneras de responder ante aquello que hoy genera malestar.",
    features: ["1 o 3 Sesiones", "Espacio Terapéutico", "100% Virtual"],
    href: "/mi-proceso-individual",
    image: bannerAcompanamiento,
  },
  {
    title: "Proceso de Pareja",
    subtitle: "Psicoterapia de Pareja",
    desc: "Un espacio donde ambos puedan observar lo que está ocurriendo, mejorar la comunicación y asumir responsabilidad sobre aquello que sí pueden transformar.",
    features: ["Mejorar la comunicación", "Gestión de conflictos", "100% Virtual"],
    href: "/proceso-de-pareja",
    image: paraQuienImage,
    imageSrcSet: `${paraQuienImage900} 900w, ${paraQuienImage} 1657w`,
  },
  {
    title: "Cultivar Mi Bienestar",
    subtitle: "Kundalini Yoga",
    desc: "Espacios diseñados para habitar el cuerpo, encontrar equilibrio y conectar con tu verdadera esencia a través de la práctica constante.",
    features: ["Curso de Iniciación", "Sabiduría Cíclica", "Acompañamiento 1:1"],
    href: "/cultivar-bienestar",
    image: fransuryYogaHome,
    position: "object-[50%_30%]",
    alt: "Fransury González practicando yoga, en una postura de torsión con el brazo extendido",
  },
];
