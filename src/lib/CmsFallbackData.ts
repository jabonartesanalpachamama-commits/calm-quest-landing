/* eslint-disable @typescript-eslint/no-explicit-any */
import sLogo from "@/assets/santosha-logo.jpg";
import instructorImage from "@/assets/instructor.png";

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
  redirectUrl?: string;
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
    ],
    redirectUrl: "/clase-gratuita"
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

const DEFAULT_PAGES: CmsPage[] = [
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
          title: "Encuentra tu Paz Interior",
          subtitle: "Clase Maestra de Kundalini Yoga",
          tagline: "Clase Maestra Gratuita",
          buttonText: "Quiero mi clase gratuita",
          buttonLink: "#form-home-hero",
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
          items: [
            { icon: "✓", title: "Sin tarjeta de crédito", description: "Acceso 100% gratuito." },
            { icon: "✓", title: "Acceso inmediato", description: "Obtén tus credenciales al instante." },
            { icon: "✓", title: "100% gratuito", description: "Sin cobros ocultos ni sorpresas." }
          ]
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

// LocalStorage helpers to run fully offline
const KEYS = {
  SETTINGS: "sant_cms_settings",
  PAGES: "sant_cms_pages",
  FORMS: "sant_cms_forms",
  SUBMISSIONS: "sant_cms_submissions",
  POSTS: "sant_cms_posts"
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

export const getLocalPosts = (): CmsPost[] => loadFromLocalStorage(KEYS.POSTS, DEFAULT_POSTS);
export const saveLocalPosts = (posts: CmsPost[]): void => saveToLocalStorage(KEYS.POSTS, posts);

export const applyCssVariablesForPalette = (paletteName: keyof typeof COLOR_PALETTES) => {
  const palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES.menta;
  const root = document.documentElement;
  Object.entries(palette.variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};
