/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VisualIdentity {
  brandName: string;
  logoText: string;
  palette: "menta" | "lavanda" | "tierra" | "oceano";
  fontFamily: "serif" | "sans";
  whatsappNumber: string;
  footerText: string;
}

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
}

export interface CmsSection {
  id: string;
  type: "hero" | "connection" | "benefits" | "form" | "testimonials" | "faq" | "cta";
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
  }
};

const DEFAULT_SETTINGS: VisualIdentity = {
  brandName: "SantoSha",
  logoText: "SantoSha",
  palette: "menta",
  fontFamily: "serif",
  whatsappNumber: "+5491123456789",
  footerText: "© 2026 SantoSha - Espacio de Bienestar, Psicología y Kundalini Yoga."
};

const DEFAULT_FORMS: CmsForm[] = [
  {
    id: "b191c71b-a5d6-4767-9d7a-11f879685a4a",
    name: "Registro Clase Gratis",
    fields: [
      { id: "name", label: "Nombre Completo", type: "text", placeholder: "Tu nombre completo", required: true },
      { id: "email", label: "Correo Electrónico", type: "email", placeholder: "ejemplo@correo.com", required: true }
    ]
  },
  {
    id: "e2a2c82c-b6e7-5878-ae8b-22f980796b5b",
    name: "Consulta de Terapia",
    fields: [
      { id: "name", label: "Nombre Completo", type: "text", placeholder: "Tu nombre", required: true },
      { id: "whatsapp", label: "Teléfono / WhatsApp", type: "tel", placeholder: "+54 9 11 ...", required: true },
      { id: "age", label: "Edad", type: "number", placeholder: "Tu edad", required: false },
      { id: "message", label: "Motivo de Consulta", type: "textarea", placeholder: "¿En qué podemos ayudarte hoy?", required: true }
    ]
  }
];

const DEFAULT_PAGES: CmsPage[] = [
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
          subtitle: "Acompañamiento psicoterapéutico profesional y técnicas holísticas para ayudarte a encontrar el equilibrio y sanar desde adentro.",
          buttonText: "Reserva tu Primera Sesión",
          buttonLink: "https://wa.link/xy0brl",
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

// LocalStorage helpers to run fully offline
const KEYS = {
  SETTINGS: "sant_cms_settings",
  PAGES: "sant_cms_pages",
  FORMS: "sant_cms_forms",
  SUBMISSIONS: "sant_cms_submissions"
};

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

export const getLocalSettings = (): VisualIdentity => loadFromLocalStorage(KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveLocalSettings = (settings: VisualIdentity): void => saveToLocalStorage(KEYS.SETTINGS, settings);

export const getLocalPages = (): CmsPage[] => loadFromLocalStorage(KEYS.PAGES, DEFAULT_PAGES);
export const saveLocalPages = (pages: CmsPage[]): void => saveToLocalStorage(KEYS.PAGES, pages);

export const getLocalForms = (): CmsForm[] => loadFromLocalStorage(KEYS.FORMS, DEFAULT_FORMS);
export const saveLocalForms = (forms: CmsForm[]): void => saveToLocalStorage(KEYS.FORMS, forms);

export const getLocalSubmissions = (): CmsSubmission[] => loadFromLocalStorage(KEYS.SUBMISSIONS, DEFAULT_SUBMISSIONS);
export const saveLocalSubmissions = (subs: CmsSubmission[]): void => saveToLocalStorage(KEYS.SUBMISSIONS, subs);

export const applyCssVariablesForPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
  const palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES.menta;
  const root = document.documentElement;
  Object.entries(palette.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};
