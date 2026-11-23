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

export type Resena = { id: string; nombre: string; categoria: "individual" | "pareja" | "yoga"; img: string; texto: string; estrellas: number; antiguedad: string };

export const RESENAS: Resena[] = [
  { id: "marcos-jesus", nombre: "Marcos Jesus", categoria: "individual", img: img0, texto: "El precio que pagué por la terapia vale completamente cada centavo. Vine súper perdido sobre dónde estoy y cómo estoy y puedo decir que desde la primera sesión con Fransury me sentí lo suficientemente orientado para saber qué quiero y a dónde quiero ir. Nuestra tercera y última sesión terminó con un propósito de vida tatuado en mi corazón. El método que emplean de combinar psicología y espiritualidad es transformador.", estrellas: 5, antiguedad: "2 años" },
  { id: "luii-gomez", nombre: "Luii Gomez", categoria: "individual", img: img1, texto: "Las terapias del centro de bienestar son excepcionales! Tuve la fortuna de vivir mi proceso terapéutico con Fransury donde me sentí cómoda, escuchada y confrontada amorosamente.\nSiento que en definitiva este acompañamiento fue clave para llegar a comprensiones esenciales y darle la vuelta a diferentes situaciones. Aún me son útiles las herramientas brindadas, siento profunda gratitud de este proceso. El amor con el que se acompaña, se guía, se da la mano es hermoso. Gratitud!", estrellas: 5, antiguedad: "6 meses" },
  { id: "angie-garzon", nombre: "Angie Garzón", categoria: "pareja", img: img2, texto: "Quiero recomendar con mucho cariño el Centro de Bienestar María Elena Badillo y, especialmente, el acompañamiento de Fransury González en terapia de pareja. 🤍\n\nEs una inversión que vale la pena. Se nota la preparación, la experiencia y la vocación de sus profesionales, así como todo el trabajo que han puesto en formarse para comprender temas como las heridas de infancia y las dinámicas emocionales que llevamos a nuestras relaciones.\n\nSu acompañamiento nos ayudó a entender mejor nuestras heridas, nuestra manera de reaccionar y cómo comunicarnos sin lastimarnos. Tener una mirada profesional, externa y neutral hizo una gran diferencia para nosotros.\n\nHoy estamos esperando a nuestro bebé y preparándonos para casarnos. Nuestra relación no es perfecta, pero sí es mucho más consciente: tenemos menos conflictos y, cuando aparecen, sabemos resolverlos con mayor comprensión y rapidez.\n\nCreo que trabajar en pareja y trabajar en uno mismo es una decisión que vale la pena tomar todos los días. A veces pedir ayuda no significa que algo esté mal, sino que queremos aprender a hacerlo mejor. 🤍", estrellas: 5, antiguedad: "2 meses" },
  { id: "roxana-hernandez", nombre: "Roxana Hernandez", categoria: "individual", img: img3, texto: "Fransura ha sido mi terapeuta desde hace algunos meses, y la verdad me ayudo cuando mas los necesitava y estoy muy agradecida con ella. Me considero una persona reservada y me cuesta abrirme a contar mis problemas a personas que no conozco pero con Fransury y Adriana que han sido mis terapeuras no he tenido ningun problema de conectar con ellas. Gracias Fransury y Adriana. 🤗", estrellas: 5, antiguedad: "un año" },
  { id: "paula-jaramillo", nombre: "Paula Jaramillo", categoria: "individual", img: img4, texto: "Recomiendo muchísimo! Invertir en mi misma guiada por María Elena en las clases, entrenamientos de 30 días me ha permitido avanzar en mi proceso de autoconocimiento y ampliar mi visión de vida. También agradezco a la terapeuta Fransury quien con su amabilidad, profesionalismo y sensibilidad ha podido acompañarme en mi proceso de sanacion particularmente en heridas de infancia y me ha entregado herramientas muy valiosas que me han ayudado a ser más observadora, en mi caso podría haber tomado terapia psicológica desde mi servicio médico pero decidí hacerlo aquí porque confío en sus valores y metodología.\n\nMuchas gracias", estrellas: 5, antiguedad: "un año" },
  { id: "ana-preciado", nombre: "Ana Preciado", categoria: "individual", img: img5, texto: "Fransury. Me ayudó a muchísimo a entenderme y sanar partes de mi que ni siquiera sabía que necesitaban atención. Ella es una persona muy empatica y profesional y me hace sentir segura hablando de todo. Me Ayudó a poner límites y prioritizarme. Gracias por toda tu ayuda. En un momento muy difícil.", estrellas: 5, antiguedad: "un año" },
  { id: "heal-u-fitness", nombre: "Heal U Fitness", categoria: "yoga", img: img6, texto: "Maria Elena y su equipo han sido espectacular desde el dia 1. He tomado sus cursos de 30 dias: CCTC, CAVA, PACO, MAGIA CUANTICA. Repeti CAVA para ayudarme a mejorar mi abundancia y siempre aprender mas. También he tomado sesiones privadas con Fransury. Mil gracias por todo y por ayudarme a mejorar en todo sentido. No buscaría nadie mas para mejorar mi psicología y espiritualidad. GRACIAS GRACIAS GRACIAS!", estrellas: 5, antiguedad: "3 meses" },
  { id: "martha-gaitan", nombre: "Martha Gaitan", categoria: "individual", img: img7, texto: "Hola mi nombre es Martha Gaitan, y quiero agradecer a Fransury mi terapeuta. Gracias por tu ayuda ,gracias por decirme las cosas que necesitaba , no las que yo queria oir. Recomiendo al Centro de bienestar Maria Elena badillo porque realmente funciona ellas son amables y dispuestas a acompañar tu proceso. Fransury otra ves gracias 🙏", estrellas: 5, antiguedad: "2 años" },
  { id: "jessika-florez", nombre: "Jessika Florez", categoria: "individual", img: img8, texto: "Excelente experiencia, nunca llegué a pensar en el beneficio infinito para el alma, al contar con el acompañamiento de un gran ser humano como lo es Fransury González, Psicóloga del equipo de María Elena. Ha sido un antes y un después que me han permitido recuperar la paz mental.\n\nCon muchísimo amor,\n\nJessika", estrellas: 5, antiguedad: "2 años" },
  { id: "wanda-helguero", nombre: "wanda helguero", categoria: "individual", img: img9, texto: "Ha sido una experiencia maravillosa, mi sesiones con Fransury. Siento que ella aportado un gran cambio en mi vida, con los método que maneja las prácticas que te deja a realizar. Ha sido un te acompaño de la mano en esto que estamos sanando. Siempre volvería a ella una vez más.", estrellas: 5, antiguedad: "2 años" },
  { id: "estefania-cespedes", nombre: "Estefanía Céspedes", categoria: "individual", img: img10, texto: "Tuve la oportunidad de tener sesiones con Fransury, donde compartió herramientas valiosas sobre relaciones y esencia femenina.Actualmente estoy trabajando con Elizabet, ha sido una experiencia increíble, para sanar heridas y cortar patrones familiares. Si estas pensando en trabajar en tu crecimiento personal, te recomiendo este centro, es un espacio seguro que te dará claridad.", estrellas: 5, antiguedad: "2 años" },
  { id: "milena-val", nombre: "Milena Val", categoria: "individual", img: img11, texto: "Excelentes sesiones con Fransury. La super recomiendo por la experiencia, paciencia,sabiduria y un trato especial.\nMuy dulce ella. Muchas gracias Fransury!, has sido un gran orientadora y me dio mucho gusto conocerte.\nBendiciones!", estrellas: 5, antiguedad: "2 años" },
  { id: "johanna-torres", nombre: "Johanna Torres Almonacid", categoria: "yoga", img: img12, texto: "Fransury gracias por todas las herramientas que me has permitido conocer en las terapias.\nMaria Elena y todo su equipo bendigo el día que inicié a escuchar sus meditaciónes y empecé a hacer los retos maravillosos.\nCursos , retos, retiros, que emoción y con toda lo que aún pienso tengo por descubrir y disfrutar.", estrellas: 5, antiguedad: "un año" },
  { id: "ana-ma-cedeno", nombre: "Ana Ma Cedeño", categoria: "individual", img: img13, texto: "Amo este centro desde María Elena hasta mi terapeuta Fransury González, recomendada al 1000% 🫶🏽la mejor!!", estrellas: 5, antiguedad: "un año" },
  { id: "angie-echeverri", nombre: "Angie Echeverri", categoria: "individual", img: img14, texto: "Hola !! Quería darles las gracias al equipo completo en especial al Fransury González , llegué a ella por un video en Youtube con María Elena y de una vez hice click , Fransury me brindó un acompañamiento bastante sanador y expansivo para un proceso de duelo que estaba transitando ; me ayudó a comprender mucho mejor mis heridas y sanar con mi niña 🤍 así que muchas gracias", estrellas: 5, antiguedad: "3 años" },
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
  "roxana-hernandez": { width: 1200, height: 338 },
  "paula-jaramillo": { width: 1200, height: 467 },
  "ana-preciado": { width: 1200, height: 308 },
  "heal-u-fitness": { width: 1200, height: 340 },
  "martha-gaitan": { width: 1200, height: 307 },
  "jessika-florez": { width: 1200, height: 434 },
  "wanda-helguero": { width: 1200, height: 306 },
  "estefania-cespedes": { width: 1200, height: 338 },
  "milena-val": { width: 1200, height: 307 },
  "johanna-torres": { width: 1200, height: 340 },
  "ana-ma-cedeno": { width: 1200, height: 245 },
  "angie-echeverri": { width: 1200, height: 339 },
};
