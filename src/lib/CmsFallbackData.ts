/* eslint-disable @typescript-eslint/no-explicit-any */
import sLogo from "@/assets/santosha-logo.webp";
import instructorImage from "@/assets/instructor.webp";

export type FontFamilyKey =
  | "cormorant-lora"       // Classic editorial serif (current default)
  | "playfair-lato"        // Elegant serif headline + modern body
  | "eb-garamond-nunito"   // Warm oldstyle serif + humanist sans
  | "cinzel-raleway"       // Majestic/spiritual uppercase + geometric
  | "dm-serif-inter"       // Contemporary editorial serif + neutral sans
  | "josefin-jost"         // Clean geometric sans pair
  | "poppins-nunito"       // Friendly rounded sans pair (high readability)
  | "marcellus-source"     // Refined display serif + clean sans
  | "fraunces-figtree"     // Expressive literary serif + modern sans
  | "bodoni-quicksand";    // High-contrast classical + soft rounded sans

export interface VisualIdentity {
  brandName: string;
  logoText: string;
  palette: "menta" | "lavanda" | "tierra" | "oceano" | "loto" | "prana" | "savia";
  fontFamily: FontFamilyKey;
  whatsappNumber: string;
  footerText: string;
}

/** Metadata for each font pair — used in admin UI and CSS application */
export const FONT_PAIRS: Record<FontFamilyKey, {
  name: string;
  description: string;
  headingFamily: string;
  bodyFamily: string;
  googleUrl: string;
  category: string;
}> = {
  "cormorant-lora": {
    name: "Cormorant & Lora",
    description: "Clásico editorial, meditativo",
    headingFamily: "'Cormorant Garamond', Georgia, serif",
    bodyFamily: "'Lora', Georgia, serif",
    googleUrl: "family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400",
    category: "Serif"
  },
  "playfair-lato": {
    name: "Playfair Display & Lato",
    description: "Elegante y equilibrado",
    headingFamily: "'Playfair Display', Georgia, serif",
    bodyFamily: "'Lato', system-ui, sans-serif",
    googleUrl: "family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700",
    category: "Serif"
  },
  "eb-garamond-nunito": {
    name: "EB Garamond & Nunito",
    description: "Cálido y humano, terapéutico",
    headingFamily: "'EB Garamond', Georgia, serif",
    bodyFamily: "'Nunito', system-ui, sans-serif",
    googleUrl: "family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Nunito:wght@300;400;500;600",
    category: "Serif"
  },
  "cinzel-raleway": {
    name: "Cinzel & Raleway",
    description: "Espiritual y poderoso",
    headingFamily: "'Cinzel', Georgia, serif",
    bodyFamily: "'Raleway', system-ui, sans-serif",
    googleUrl: "family=Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600",
    category: "Display"
  },
  "dm-serif-inter": {
    name: "DM Serif Display & Inter",
    description: "Editorial contemporáneo",
    headingFamily: "'DM Serif Display', Georgia, serif",
    bodyFamily: "'Inter', system-ui, sans-serif",
    googleUrl: "family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600",
    category: "Serif"
  },
  "josefin-jost": {
    name: "Josefin Sans & Jost",
    description: "Limpio, minimalista, moderno",
    headingFamily: "'Josefin Sans', system-ui, sans-serif",
    bodyFamily: "'Jost', system-ui, sans-serif",
    googleUrl: "family=Josefin+Sans:wght@300;400;500;600;700&family=Jost:wght@300;400;500",
    category: "Sans-Serif"
  },
  "poppins-nunito": {
    name: "Poppins & Nunito",
    description: "Amigable, accesible, legible",
    headingFamily: "'Poppins', system-ui, sans-serif",
    bodyFamily: "'Nunito', system-ui, sans-serif",
    googleUrl: "family=Poppins:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600",
    category: "Sans-Serif"
  },
  "marcellus-source": {
    name: "Marcellus & Source Serif",
    description: "Refinado y profesional",
    headingFamily: "'Marcellus', Georgia, serif",
    bodyFamily: "'Source Serif 4', Georgia, serif",
    googleUrl: "family=Marcellus&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400",
    category: "Serif"
  },
  "fraunces-figtree": {
    name: "Fraunces & Figtree",
    description: "Literario, expresivo y natural",
    headingFamily: "'Fraunces', Georgia, serif",
    bodyFamily: "'Figtree', system-ui, sans-serif",
    googleUrl: "family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Figtree:wght@300;400;500;600",
    category: "Serif"
  },
  "bodoni-quicksand": {
    name: "Libre Bodoni & Quicksand",
    description: "Alto contraste y elegancia",
    headingFamily: "'Libre Bodoni', Georgia, serif",
    bodyFamily: "'Quicksand', system-ui, sans-serif",
    googleUrl: "family=Libre+Bodoni:ital,wght@0,400;0,700;1,400&family=Quicksand:wght@300;400;500;600",
    category: "Display"
  },
};

export interface CmsField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select
}

export interface CmsForm {
  id: string;
  name: string;
  fields: CmsField[];
  redirectUrl?: string;
}

export interface CmsSection {
  id: string;
  type: "hero" | "connection" | "benefits" | "form" | "testimonials" | "faq" | "cta" | "transformation";
  content: any;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  sections: CmsSection[];
}

export interface CmsSubmission {
  id: string;
  formId: string;
  pageSlug: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  published: boolean;
  publishedAt: string; // ISO string
}

// 4 Harmonious and therapeutic color palettes
export const COLOR_PALETTES = {
  menta: {
    name: "Menta Silvestre (Calma y Renovación)",
    primary: "bg-[#7EA172] text-white hover:bg-[#6C8E61]",
    primaryText: "text-[#7EA172]",
    primaryBorder: "border-[#7EA172]",
    background: "bg-[#F7F4EF]",
    cardBackground: "bg-white",
    foreground: "text-[#2C3E2B]",
    mutedForeground: "text-[#5C6E5B]",
    secondary: "bg-[#D6E3D1]",
    secondaryText: "text-[#4C5E4B]",
    accent: "bg-[#E6C594]",
    accentText: "text-[#5C421B]",
    variables: {
      "--background": "0 0% 97%",
      "--foreground": "120 17% 20%",
      "--card": "0 0% 100%",
      "--card-foreground": "120 17% 20%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "120 17% 20%",
      "--primary": "104 22% 54%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "105 21% 85%",
      "--secondary-foreground": "120 12% 33%",
      "--muted": "105 21% 94%",
      "--muted-foreground": "120 10% 40%",
      "--accent": "37 62% 74%",
      "--accent-foreground": "37 55% 24%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "120 12% 90%",
      "--input": "120 12% 90%",
      "--ring": "104 22% 54%",
      "--radius": "1rem"
    }
  },
  lavanda: {
    name: "Lavanda Serena (Paz Mental y Espiritualidad)",
    primary: "bg-[#8E83A3] text-white hover:bg-[#7D7194]",
    primaryText: "text-[#8E83A3]",
    primaryBorder: "border-[#8E83A3]",
    background: "bg-[#FAF8FC]",
    cardBackground: "bg-white",
    foreground: "text-[#382E47]",
    mutedForeground: "text-[#625970]",
    secondary: "bg-[#E5E1EC]",
    secondaryText: "text-[#4E445C]",
    accent: "bg-[#D1A6A0]",
    accentText: "text-[#5C322C]",
    variables: {
      "--background": "270 20% 98%",
      "--foreground": "265 22% 23%",
      "--card": "0 0% 100%",
      "--card-foreground": "265 22% 23%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "265 22% 23%",
      "--primary": "261 16% 58%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "260 21% 90%",
      "--secondary-foreground": "265 15% 31%",
      "--muted": "260 21% 96%",
      "--muted-foreground": "265 11% 40%",
      "--accent": "7 37% 72%",
      "--accent-foreground": "7 36% 27%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "260 12% 91%",
      "--input": "260 12% 91%",
      "--ring": "261 16% 58%",
      "--radius": "1rem"
    }
  },
  tierra: {
    name: "Tierra Cálida (Conexión y Acogida)",
    primary: "bg-[#C98A72] text-white hover:bg-[#B57A63]",
    primaryText: "text-[#C98A72]",
    primaryBorder: "border-[#C98A72]",
    background: "bg-[#F8F3EC]",
    cardBackground: "bg-white",
    foreground: "text-[#4A3026]",
    mutedForeground: "text-[#755D54]",
    secondary: "bg-[#ECDDCF]",
    secondaryText: "text-[#5D463D]",
    accent: "bg-[#8E9B8D]",
    accentText: "text-[#344033]",
    variables: {
      "--background": "35 38% 95%",
      "--foreground": "16 32% 22%",
      "--card": "0 0% 100%",
      "--card-foreground": "16 32% 22%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "16 32% 22%",
      "--primary": "16 46% 62%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "28 35% 87%",
      "--secondary-foreground": "16 21% 30%",
      "--muted": "28 35% 94%",
      "--muted-foreground": "16 16% 41%",
      "--accent": "120 8% 58%",
      "--accent-foreground": "120 11% 23%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "28 15% 88%",
      "--input": "28 15% 88%",
      "--ring": "16 46% 62%",
      "--radius": "1rem"
    }
  },
  oceano: {
    name: "Océano Profundo (Confianza y Claridad)",
    primary: "bg-[#5E8A9E] text-white hover:bg-[#4D768A]",
    primaryText: "text-[#5E8A9E]",
    primaryBorder: "border-[#5E8A9E]",
    background: "bg-[#F3F7F9]",
    cardBackground: "bg-white",
    foreground: "text-[#1F323E]",
    mutedForeground: "text-[#465966]",
    secondary: "bg-[#D8E5EC]",
    secondaryText: "text-[#2B3F4B]",
    accent: "bg-[#D9A07E]",
    accentText: "text-[#5E321B]",
    variables: {
      "--background": "200 30% 96%",
      "--foreground": "203 33% 18%",
      "--card": "0 0% 100%",
      "--card-foreground": "203 33% 18%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "203 33% 18%",
      "--primary": "198 26% 49%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "202 31% 89%",
      "--secondary-foreground": "203 27% 23%",
      "--muted": "202 31% 95%",
      "--muted-foreground": "203 18% 34%",
      "--accent": "22 52% 67%",
      "--accent-foreground": "22 55% 24%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "202 18% 88%",
      "--input": "202 18% 88%",
      "--ring": "198 26% 49%",
      "--radius": "1rem"
    }
  },
  loto: {
    name: "Loto Místico (Despertar y Kundalini Yoga)",
    primary: "bg-[#846D89] text-white hover:bg-[#745D79]",
    primaryText: "text-[#846D89]",
    primaryBorder: "border-[#846D89]",
    background: "bg-[#FAF7F2]",
    cardBackground: "bg-white",
    foreground: "text-[#3B2E3E]",
    mutedForeground: "text-[#695D6C]",
    secondary: "bg-[#E3D3D5]",
    secondaryText: "text-[#684E51]",
    accent: "bg-[#E5CE9F]",
    accentText: "text-[#5D4B26]",
    variables: {
      "--background": "38 25% 96%",
      "--foreground": "289 15% 21%",
      "--card": "0 0% 100%",
      "--card-foreground": "289 15% 21%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "289 15% 21%",
      "--primary": "289 11% 48%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "352 18% 86%",
      "--secondary-foreground": "353 14% 36%",
      "--muted": "352 10% 94%",
      "--muted-foreground": "288 8% 39%",
      "--accent": "40 55% 76%",
      "--accent-foreground": "40 42% 26%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "352 12% 90%",
      "--input": "352 12% 90%",
      "--ring": "289 11% 48%",
      "--radius": "1rem"
    }
  },
  prana: {
    name: "Prana Dorado (Energía Vital, Sol y Radiancia)",
    primary: "bg-[#CD7A5B] text-white hover:bg-[#B96A4C]",
    primaryText: "text-[#CD7A5B]",
    primaryBorder: "border-[#CD7A5B]",
    background: "bg-[#FCFAF6]",
    cardBackground: "bg-white",
    foreground: "text-[#4E362A]",
    mutedForeground: "text-[#826658]",
    secondary: "bg-[#ECDDCF]",
    secondaryText: "text-[#684C38]",
    accent: "bg-[#ECC07E]",
    accentText: "text-[#61441E]",
    variables: {
      "--background": "40 25% 98%",
      "--foreground": "20 30% 24%",
      "--card": "0 0% 100%",
      "--card-foreground": "20 30% 24%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "20 30% 24%",
      "--primary": "16 54% 58%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "29 44% 87%",
      "--secondary-foreground": "25 30% 31%",
      "--muted": "29 20% 95%",
      "--muted-foreground": "20 19% 43%",
      "--accent": "36 74% 71%",
      "--accent-foreground": "34 53% 25%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "29 15% 88%",
      "--input": "29 15% 88%",
      "--ring": "16 54% 58%",
      "--radius": "1rem"
    }
  },
  savia: {
    name: "Savia Eucalipto (Tranquilidad Natural y Respiración)",
    primary: "bg-[#5F7D6B] text-white hover:bg-[#4F6D5C]",
    primaryText: "text-[#5F7D6B]",
    primaryBorder: "border-[#5F7D6B]",
    background: "bg-[#F2F5F3]",
    cardBackground: "bg-white",
    foreground: "text-[#233229]",
    mutedForeground: "text-[#516358]",
    secondary: "bg-[#D9E3DC]",
    secondaryText: "text-[#3F4F45]",
    accent: "bg-[#D5C0A7]",
    accentText: "text-[#524332]",
    variables: {
      "--background": "140 10% 95%",
      "--foreground": "144 18% 17%",
      "--card": "0 0% 100%",
      "--card-foreground": "144 18% 17%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "144 18% 17%",
      "--primary": "144 14% 43%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "138 14% 87%",
      "--secondary-foreground": "142 11% 28%",
      "--muted": "138 8% 94%",
      "--muted-foreground": "143 10% 35%",
      "--accent": "33 39% 75%",
      "--accent-foreground": "32 24% 26%",
      "--destructive": "0 84% 60%",
      "--destructive-foreground": "0 0% 98%",
      "--border": "138 8% 90%",
      "--input": "138 8% 90%",
      "--ring": "144 14% 43%",
      "--radius": "1rem"
    }
  }
};

const DEFAULT_SETTINGS: VisualIdentity = {
  brandName: "SantoSha",
  logoText: "SantoSha",
  palette: "menta",
  fontFamily: "cormorant-lora",
  whatsappNumber: "+573105679517",
  footerText: "© 2026 SantoSha - Espacio de Bienestar, Psicología y Kundalini Yoga."
};


const DEFAULT_FORMS: CmsForm[] = [
  {
    id: "b191c71b-a5d6-4767-9d7a-11f879685a4a",
    name: "Registro Clase Gratis",
    fields: [
      { id: "name", label: "Nombre Completo", type: "text", placeholder: "Tu nombre completo", required: true },
      { id: "email", label: "Correo Electrónico", type: "email", placeholder: "ejemplo@correo.com", required: true }
    ],
    redirectUrl: "https://wa.me/573105679517"
  },

  {
    id: "e2a2c82c-b6e7-5878-ae8b-22f980796b5b",
    name: "Consulta de Terapia",
    fields: [
      { id: "name", label: "Nombre Completo", type: "text", placeholder: "Tu nombre", required: true },
      { id: "whatsapp", label: "Teléfono / WhatsApp", type: "tel", placeholder: "+54 9 11 ...", required: true },
      { id: "age", label: "Edad", type: "number", placeholder: "Tu edad", required: false },
      { id: "message", label: "Motivo de Consulta", type: "textarea", placeholder: "¿En qué podemos ayudarte hoy?", required: true }
    ],
    redirectUrl: ""
  }
];

export const DEFAULT_PAGES: CmsPage[] = [
  {
    id: "home",
    title: "Inicio SantoSha",
    slug: "home",
    published: true,
    sections: [
      {
        id: "home-hero",
        type: "hero",
        content: {
          title: "Reduce tu Ansiedad en Solo 30 Minutos",
          subtitle: "Clase Maestra Gratuita de Kundalini Yoga con Técnicas Respaldadas por la Neurociencia",
          tagline: "Clase Maestra Gratuita",
          description: "Aprende la técnica exacta que +10,000 profesionales ya usan para calmar su sistema nervioso, recuperar la claridad mental y eliminar la reactividad emocional.",
          buttonText: "Quiero mi clase gratuita",
          buttonLink: "https://wa.me/573105679517",
          formId: "b191c71b-a5d6-4767-9d7a-11f879685a4a"

        }
      },
      {
        id: "home-connection",
        type: "connection",
        content: {
          title: "¿La incapacidad para gestionar tus emociones está ganando la batalla?",
          description: "Las sensaciones de incomodidad que te drenan en tu día a día por no tener la capacidad o las herramientas para gestionar tus emociones y que están afectando no solo tu vitalidad, tu motivación, también la relación con los demás, sí tienen solución.\n\nNo tienes que aceptar vivir en un estado de descontento, constante irritabilidad y reactividad que nubla tu juicio y afecta tu salud mental y física.\n\nNuestra clase gratuita para Crear Equilibrio Emocional te ofrece una solución práctica para calmar tu sistema nervioso y recuperar el control de tus emociones.",
          imageUrl: instructorImage,
          layout: "image-right",
          buttonText: "Quiero mi clase gratuita",
          buttonLink: "#home-hero"
        }
      },
      {
        id: "home-benefits",
        type: "benefits",
        content: {
          title: "Beneficios que Obtendrás",
          showCta: true,
          ctaText: "Quiero estos beneficios ahora",
          ctaLink: "",
          ctaSubtext: "Sin costo · Sin tarjeta de crédito",
          items: [
            { icon: "🧠", title: "Claridad Mental", description: "Estimula las áreas motoras y sensoriales del cerebro para mejorar tu memoria y agudeza cognitiva." },
            { icon: "❤️", title: "Equilibrio Emocional", description: "Reduce los niveles de ansiedad y depresión, fomentando un estado de paz interior y resiliencia." },
            { icon: "✨", title: "Vitalidad", description: "Utiliza la respiración consciente y mudras para estimular tus recursos naturales desde la primera práctica." },
            { icon: "🌙", title: "Descanso Profundo", description: "Entrena tu cerebro para silenciar el ruido mental, accediendo a niveles de relajación más profundos." }
          ]
        }
      },
      {
        id: "home-social-proof",
        type: "benefits",
        content: {
          title: "Únete a una Comunidad de Transformación",
          showCta: false,
          items: [
            { icon: "👥", title: "10,000+", description: "Profesionales Transformados" },
            { icon: "⏱️", title: "30 min", description: "Práctica Diaria" },
            { icon: "📖", title: "Ciencia", description: "Respaldada Científicamente" }
          ]
        }
      },
      {
        id: "home-testimonials",
        type: "testimonials",
        content: {
          title: "Historias de Transformación Real",
          ctaText: "Quiero mi transformación ahora",
          ctaLink: "",
          ctaSubtext: "Únete a +10,000 personas que ya cambiaron su vida",
          testimonials: [
            { author: "Patricia Mendoza", role: "Directora de Marketing, 45 años", quote: "Después de 15 años en el mundo corporativo, sentía que había perdido el control de mis emociones. Los primeros 30 minutos de práctica ya marcaron una diferencia. Ahora manejo las reuniones difíciles con una calma que antes me parecía imposible." },
            { author: "Laura Fernández", role: "Emprendedora, 38 años", quote: "Entre mis hijos y mi negocio, vivía en un estado de agotamiento constante. Esta práctica me devolvió la energía y la paciencia que necesitaba. Mi familia ha notado el cambio." },
            { author: "Dr. Carlos Ruiz", role: "Médico Internista, 52 años", quote: "Como médico, estaba escéptico al principio. Pero los resultados fueron innegables: mejor sueño, menos irritabilidad y más claridad para tomar decisiones clínicas. Ahora lo recomiendo a mis pacientes." },
            { author: "Andrea Morales", role: "Diseñadora UX, 29 años", quote: "La ansiedad estaba afectando mi trabajo creativo. Después de un mes practicando, recuperé mi capacidad de concentración y mi confianza. Es la mejor inversión de tiempo que he hecho." }
          ]
        }
      },
      {
        id: "home-guarantees",
        type: "benefits",
        content: {
          title: "Acceso Inmediato y Gratuito",
          showCta: false,
          items: [
            { icon: "✓", title: "Sin tarjeta de crédito", description: "Acceso 100% gratuito." },
            { icon: "✓", title: "Acceso inmediato", description: "Obtén tus credenciales al instante." },
            { icon: "✓", title: "100% gratuito", description: "Sin cobros ocultos ni sorpresas." }
          ]
        }
      },
      {
        id: "home-transformation",
        type: "transformation",
        content: {
          title: "¿Reconoces alguna de estas situaciones?",
          beforeTitle: "Sin herramientas para gestionarlo...",
          afterTitle: "Con solo 30 minutos al día",
          before: [
            "Irritabilidad constante que afecta tus relaciones",
            "Noches de insomnio o sueño no reparador",
            "Niebla mental que frena tu productividad",
            "Fatiga emocional que drena tu energía",
            "Reactividad ante situaciones cotidianas",
            "Sensación de no poder 'desconectar'"
          ],
          after: [
            "Calma profunda ante situaciones de estrés",
            "Descanso reparador y sueño de calidad",
            "Claridad mental y enfoque sostenido",
            "Energía vital renovada cada mañana",
            "Respuestas conscientes, no reacciones impulsivas",
            "Presencia plena en tu vida y relaciones"
          ],
          ctaText: "Quiero esta transformación",
          ctaLink: "",
          ctaSubtext: "Gratuito · Sin compromisos · Acceso inmediato"
        }
      },
      {
        id: "home-closing-cta",
        type: "cta",
        content: {
          title: "¿Cuántos días más quieres vivir con esa tensión?",
          subtitle: "Miles de personas ya encontraron el equilibrio que buscas. Tu clase gratuita de Kundalini Yoga está esperando por ti.",
          ctaText: "Accede Gratis Ahora",
          ctaLink: "",
          disclaimer: "Sin riesgo · Sin tarjeta · Sin compromisos · Acceso inmediato"
        }
      }
    ]
  },
  {
    id: "terapia-individual",
    title: "Terapia Individual y Bienestar",
    slug: "terapia-individual",
    published: true,
    sections: [
      {
        id: "hero-section-1",
        type: "hero",
        content: {
          title: "Un espacio seguro para tu mente y tu alma",
          subtitle: "YogaTerapia y técnicas holísticas que se convierten en una herramienta para cultivar conciencia corporal, regulación del sistema nervioso, conexión interna, resiliencia emocional y una relación más compasiva con nuestra humanidad.",
          buttonText: "Reserva tu Primera Sesión",
          buttonLink: "#form-form-section-1",
          tagline: "Terapia Presencial y Online • Enfoque Integrativo"
        }
      },
      {
        id: "connect-section-1",
        type: "connection",
        content: {
          title: "¿Sientes que la ansiedad o el estrés están controlando tu vida?",
          description: "Hola, soy el equipo de SantoSha. Entendemos que dar el primer paso hacia la terapia puede ser abrumador. Aquí no encontrarás juicios, solo un espacio cálido, profesional y compasivo para explorar tus emociones, comprender tus patrones y adquirir herramientas prácticas para tu día a día.",
          imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
          layout: "image-right"
        }
      },
      {
        id: "benefits-section-1",
        type: "benefits",
        content: {
          title: "¿Cómo puede ayudarte nuestro enfoque?",
          showCta: true,
          ctaText: "Reserva tu primera sesión",
          ctaLink: "#form-form-section-1",
          ctaSubtext: "Primera consulta sin compromiso",
          items: [
            { icon: "🌿", title: "Reducción de la Ansiedad", description: "Aprende técnicas corporales y de respiración para calmar el sistema nervioso en momentos de crisis." },
            { icon: "🧘", title: "Autoconocimiento Profundo", description: "Comprende el origen de tus pensamientos y cómo influyen en tus emociones y decisiones." },
            { icon: "💡", title: "Gestión Emocional", description: "Adquiere recursos efectivos para procesar la tristeza, el enojo y el miedo de forma saludable." }
          ]
        }
      },
      {
        id: "form-section-1",
        type: "form",
        content: {
          title: "Da el primer paso hoy",
          subtitle: "Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para coordinar tu cita.",
          formId: "e2a2c82c-b6e7-5878-ae8b-22f980796b5b"
        }
      }
    ]
  }
];

const DEFAULT_SUBMISSIONS: CmsSubmission[] = [
  {
    id: "sub-1",
    formId: "e2a2c82c-b6e7-5878-ae8b-22f980796b5b",
    pageSlug: "terapia-individual",
    data: {
      name: "Mariana López",
      whatsapp: "+5491158439281",
      age: 32,
      message: "Siento mucha ansiedad constante por el trabajo y me cuesta dormir por las noches."
    },
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "sub-2",
    formId: "e2a2c82c-b6e7-5878-ae8b-22f980796b5b",
    pageSlug: "terapia-individual",
    data: {
      name: "Esteban Ramírez",
      whatsapp: "+5491143829102",
      age: 28,
      message: "Busco apoyo terapéutico para superar una ruptura amorosa reciente."
    },
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

export const DEFAULT_POSTS: CmsPost[] = [
  {
    id: "a191c71b-a5d6-4767-9d7a-11f879685a4b",
    title: "Mindfulness y Respiración: Calma tu Ansiedad en 5 Minutos",
    slug: "calma-tu-ansiedad-en-5-minutos",
    excerpt: "Descubre cómo la respiración consciente y sencillas técnicas corporales pueden reiniciar tu sistema nervioso y devolverte la paz en momentos de tensión.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    content: `# Mindfulness y Respiración: Calma tu Ansiedad en 5 Minutos\n\nLa ansiedad es una respuesta natural del cuerpo ante el peligro, pero en nuestro mundo moderno, a menudo se activa ante tensiones del día a día, como un correo electrónico urgente, la sobrecarga laboral o pensamientos persistentes sobre el futuro. Cuando esto ocurre, nuestro sistema nervioso entra en modo de "lucha o huida", aumentando el cortisol y acelerando el corazón.\n\nLa buena noticia es que tienes un interruptor biológico integrado para apagar esta alarma: **tu respiración**.\n\nA través de la respiración consciente y técnicas sencillas de Mindfulness, puedes enviar una señal directa a tu cerebro para activar el sistema nervioso parasimpático, el encargado de la relajación y la calma.\n\n---\n\n## La Técnica del Suspiro Terapéutico (Respiración 4-7-8)\n\nEsta técnica, respaldada por la neurociencia moderna, es uno de los tranquilizantes naturales más eficaces para el sistema nervioso. Puedes hacerla en cualquier lugar:\n\n1. **Inhala profundamente por la nariz** durante 4 segundos.\n2. **Sostén el aire** en tus pulmones durante 7 segundos.\n3. **Exhala completamente por la boca**, haciendo un suave sonido de suspiro, durante 8 segundos.\n\nRepite este ciclo 4 veces. Notarás de inmediato cómo tus hombros caen, tu ritmo cardíaco disminuye y tu mente se enfoca en el momento presente.\n\n---\n\n## Mindfulness en la Rutina Diaria\n\nNo necesitas meditar durante horas en una montaña para experimentar los beneficios de la atención plena. El Mindfulness se trata de **presencia**. Aquí tienes tres formas de integrarlo hoy:\n\n* **Al tomar una taza de té o café**: Concéntrate en la calidez de la taza entre tus manos, el aroma que se eleva y los matices del sabor. Si tu mente divaga hacia los pendientes, regrésala suavemente a la taza.\n* **Caminar consciente**: Mientras caminas hacia tu oficina o das un paseo, siente el contacto de tus pies con el suelo. Observa los colores del entorno sin juzgar.\n* **Escucha atenta**: En tu próxima conversación, escucha a la otra persona con el 100% de tu presencia, sin pensar en lo que vas a responder a continuación.\n\nEl bienestar y la calma mental no son metas lejanas, sino pequeñas decisiones conscientes que tomamos momento a momento. ¡Prueba a respirar conscientemente hoy!`,
    published: true,
    publishedAt: new Date().toISOString()
  },
  {
    id: "e2a2c82c-b6e7-5878-ae8b-22f980796b5c",
    title: "Kundalini Yoga: La Ciencia de la Vitalidad Diaria y Claridad Mental",
    slug: "kundalini-yoga-vitalidad-diaria",
    excerpt: "Conoce el poder de esta práctica milenaria que combina mantras, mudras y respiración consciente para desbloquear tu energía vital y mejorar tu claridad mental.",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
    content: `# Kundalini Yoga: La Ciencia de la Vitalidad Diaria y Claridad Mental\n\nEn la búsqueda constante de equilibrio, a menudo nos enfocamos únicamente en la salud mental o en la física, olvidando que somos una unidad integrada. **Kundalini Yoga**, conocido históricamente como el yoga de la conciencia, es una tecnología holística diseñada precisamente para armonizar nuestro cuerpo, mente y energía vital.\n\nA diferencia de otros estilos de yoga, Kundalini combina posturas físicas dinámicas (*asanas*) con técnicas respiratorias avanzadas (*pranayamas*), cantos de sonidos sagrados (*mantras*) y gestos con las manos (*mudras*).\n\nEsta combinación produce un estímulo directo en el sistema glandular, fortalece el sistema nervioso y despeja la niebla mental en pocos minutos de práctica.\n\n---\n\n## ¿Por qué se le llama una "Ciencia de la Vitalidad"?\n\nDesde una perspectiva biológica, la práctica regular de Kundalini Yoga estimula la glándula pituitaria y la glándula pineal, regulando la liberación de hormonas del bienestar como la dopamina y la serotonina.\n\nAdemás, los ejercicios dinámicos incrementan la circulación de líquido cefalorraquídeo hacia el cerebro, mejorando la agudeza cognitiva, la memoria y permitiéndote tomar decisiones bajo presión con una calma inquebrantable.\n\n---\n\n## Una Pequeña Práctica para Iniciar tu Día\n\nSi quieres experimentar el efecto vitalizante del Kundalini, te sugiero iniciar tus mañanas con la **Ego Eradicator** (Eliminador del Ego), una respiración diseñada para recargar tus centros de energía y expandir tus pulmones:\n\n1. Siéntate con las piernas cruzadas de manera cómoda y mantén tu columna recta.\n2. Eleva los brazos a un ángulo de 60 grados. Dobla los dedos sobre las palmas de las manos de modo que las yemas toquen la base de los dedos, manteniendo **los pulgares apuntando hacia el cielo**.\n3. Cierra los ojos y enfoca tu atención en el entrecejo (tercer ojo).\n4. Comienza la **Respiración de Fuego**: una respiración rápida, rítmica y continua a través de la nariz (unas 2-3 respiraciones por segundo). Al exhalar, contrae el ombligo hacia la columna; al inhalar, relájalo.\n5. Continúa durante 1 a 3 minutos. Para finalizar, inhala profundo, junta los pulgares arriba de tu cabeza, sostén la respiración unos segundos, exhala y relaja los brazos.\n\nEsta sencilla práctica despejará cualquier somnolencia de tu mente y te dará una claridad e intuición excepcionales para afrontar los desafíos de tu día. Recuerda que la consistencia es la llave que abre la puerta al bienestar duradero.`,
    published: true,
    publishedAt: new Date().toISOString()
  }
];

// ─── LocalStorage versioned cache ───────────────────────────────────────────
// Bump SCHEMA_VERSION any time DEFAULT_PAGES or DEFAULT_FORMS change structure.
// On mismatch, the stale page/form cache is wiped and rebuilt from the new defaults.
const SCHEMA_VERSION = "v6"; // bump this when page sections change
const VERSION_KEY    = "sant_cms_schema_version";

const KEYS = {
  SETTINGS:    "sant_cms_settings",
  PAGES:       "sant_cms_pages",
  FORMS:       "sant_cms_forms",
  SUBMISSIONS: "sant_cms_submissions",
  POSTS:       "sant_cms_posts",
};

/** Wipe stale structural cache when the schema version changes. */
const migrateIfNeeded = (): void => {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored !== SCHEMA_VERSION) {
      // Clear only structural data — preserve user submissions
      localStorage.removeItem(KEYS.PAGES);
      localStorage.removeItem(KEYS.FORMS);
      // Keep SETTINGS so admin's palette/brand choices survive the reset
      localStorage.setItem(VERSION_KEY, SCHEMA_VERSION);
      console.info(`[CMS] Schema updated to ${SCHEMA_VERSION}. Page cache refreshed.`);
    }
  } catch (_) {
    // localStorage may be blocked in some environments — fail silently
  }
};

// Run migration once at module load time (fires when app starts)
migrateIfNeeded();

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage, using default.`, e);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const getLocalSettings    = (): VisualIdentity   => loadFromLocalStorage(KEYS.SETTINGS,    DEFAULT_SETTINGS);
export const saveLocalSettings   = (s: VisualIdentity)  => saveToLocalStorage(KEYS.SETTINGS,    s);

export const getLocalPages       = (): CmsPage[]        => loadFromLocalStorage(KEYS.PAGES,       DEFAULT_PAGES);
export const saveLocalPages      = (p: CmsPage[])       => saveToLocalStorage(KEYS.PAGES,       p);

export const getLocalForms       = (): CmsForm[]        => loadFromLocalStorage(KEYS.FORMS,       DEFAULT_FORMS);
export const saveLocalForms      = (f: CmsForm[])       => saveToLocalStorage(KEYS.FORMS,       f);

export const getLocalSubmissions = (): CmsSubmission[]  => loadFromLocalStorage(KEYS.SUBMISSIONS, DEFAULT_SUBMISSIONS);
export const saveLocalSubmissions= (s: CmsSubmission[]) => saveToLocalStorage(KEYS.SUBMISSIONS, s);

export const getLocalPosts       = (): CmsPost[]        => loadFromLocalStorage(KEYS.POSTS,       DEFAULT_POSTS);
export const saveLocalPosts      = (p: CmsPost[])       => saveToLocalStorage(KEYS.POSTS,       p);

// ─── AI Agent Config ─────────────────────────────────────────────────────────

export interface AiAgentConfig {
  enabled: boolean;
  botName: string;
  avatarEmoji: string;
  welcomeMessage: string;
  systemPrompt: string;
  captureLeadPrompt: string;
  faqs: Array<{ question: string; answer: string }>;
}

const DEFAULT_AGENT_CONFIG: AiAgentConfig = {
  enabled: true,
  botName: "SantoBot",
  avatarEmoji: "🌿",
  welcomeMessage: "Hola \ud83c\udf3f \u00bfEn qu\u00e9 puedo ayudarte hoy?",
  systemPrompt: "Eres un asistente virtual c\u00e1lido y empático de SantoSha, un centro de bienestar y yoga. Tu objetivo es ayudar a los visitantes a resolver sus dudas sobre los servicios, y si muestran inter\u00e9s, invitarlos amablemente a dejar su nombre y WhatsApp para que el equipo les contacte. Habla siempre en espa\u00f1ol con un tono profesional pero cercano.",
  captureLeadPrompt: "Me alegra tu inter\u00e9s \ud83d\ude4f \u00bfMe puedes dejar tu nombre y n\u00famero de WhatsApp para que nuestro equipo te contacte hoy mismo?",
  faqs: [
    { question: "\u00bfCu\u00e1nto cuesta la clase?", answer: "La primera clase es completamente gratuita. Puedes registrarte en el formulario de esta p\u00e1gina." },
    { question: "\u00bfD\u00f3nde son las clases?", answer: "Tenemos clases presenciales y online. Nuestro equipo te informar\u00e1 de los horarios disponibles al contactarte." },
    { question: "\u00bfQu\u00e9 necesito para la clase?", answer: "Solo ropa c\u00f3moda y ganas de aprender. Para las clases online, un espacio tranquilo con tapete." }
  ]
};

const AGENT_KEY = "sant_cms_agent_config";

export const getLocalAgentConfig = (): AiAgentConfig => {
  try {
    const raw = localStorage.getItem(AGENT_KEY);
    if (raw) return { ...DEFAULT_AGENT_CONFIG, ...JSON.parse(raw) };
  } catch { /* noop */ }
  return DEFAULT_AGENT_CONFIG;
};

export const saveLocalAgentConfig = (config: AiAgentConfig): void => {
  try {
    localStorage.setItem(AGENT_KEY, JSON.stringify(config));
  } catch { /* noop */ }
};

export const applyCssVariablesForPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
  const palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES.menta;
  const root = document.documentElement;
  Object.entries(palette.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

/**
 * Dynamically loads the correct Google Fonts for the selected font pair
 * and sets --font-heading + --font-body CSS variables on :root.
 *
 * Safe to call multiple times — replaces the existing font <link> tag
 * instead of duplicating it.
 */
export const applyFontPair = (fontKey: FontFamilyKey) => {
  // Backward-compat: map old values that might be stored in Supabase/localStorage
  const normalized: FontFamilyKey =
    (fontKey as string) === "serif" ? "cormorant-lora" :
    (fontKey as string) === "sans"  ? "dm-serif-inter" :
    fontKey;

  const pair = FONT_PAIRS[normalized] || FONT_PAIRS["cormorant-lora"];

  // 1. Inject / replace Google Fonts <link>
  const LINK_ID = "sant-google-fonts";
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?${pair.googleUrl}&display=swap`;

  // 2. Set CSS variables
  const root = document.documentElement;
  root.style.setProperty("--font-heading", pair.headingFamily);
  root.style.setProperty("--font-body",    pair.bodyFamily);
};
