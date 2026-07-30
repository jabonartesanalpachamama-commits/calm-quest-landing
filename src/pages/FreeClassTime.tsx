import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  VisualIdentity,
  COLOR_PALETTES,
  getLocalSettings,
  applyCssVariablesForPalette,
  applyFontPair,
} from "@/lib/CmsFallbackData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import santoshaLogo from "@/assets/santosha-logo.webp";
import { Timer, Lightbulb, MessageCircle, Star, User, Leaf, HeartHandshake } from "lucide-react";

const FreeClassTime = () => {
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());

  useEffect(() => {
    const loadSettings = async () => {
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find((item) => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch { /* use local fallback */ }
      applyCssVariablesForPalette(activeSettings.palette);
      applyFontPair(activeSettings.fontFamily);
      setSettings(activeSettings);
    };
    loadSettings();
  }, []);

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <main className={`min-h-screen ${palette.background} ${palette.foreground} flex flex-col items-center px-4 py-8 md:py-12`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center mb-8 md:mb-12"
            >
                <img
                    src={santoshaLogo}
                    alt="SantoSha Logo"
                    className="h-20 md:h-24 w-auto"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-10">
                    <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                        Tu Clase Gratuita
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        ¡Felicidades! Ya tienes acceso a esta herramienta de transformación.
                    </p>
                </div>

                <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden border border-border/60">
                    <iframe
                        src="https://www.youtube.com/embed/73lQA_Lyz_I?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3"
                        title="Clase Gratuita"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                </div>

                {/* Mantras Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-12 bg-card rounded-2xl p-8 md:p-10 border border-border/60"
                >
                    <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-primary italic mb-8">
                        Kundalini Yoga<br />
                        Kriya y mantras para Crear Equilibrio
                    </h2>

                    <div className="space-y-8">
                        {/* Ong Namo Guru dev namo */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                                <Lightbulb className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl mb-2">Ong Namo Guru dev namo</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Es el Adi Mantra del Kundalini Yoga, que significa "Me inclino ante la sabiduría divina, me inclino ante el maestro divino interior", conectándote con la sabiduría universal y tu guía espiritual para centrarte y recibir energía en la práctica, uniendo tu yo finito con la conciencia infinita.
                                </p>
                            </div>
                        </div>

                        {/* Sat nam */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl mb-2">Sat nam</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    "Yo soy la verdad", "Mi esencia es la verdad", o "La verdad que habita en mi, saluda la verdad que habita en ti"
                                </p>
                            </div>
                        </div>

                        {/* AR */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl mb-2">AR</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Representa el <span className="font-semibold text-foreground">aspecto creativo infinito de Dios</span>, conectando con la abundancia, la prosperidad y el poder de la creación para manifestar oportunidades, eliminar bloqueos y atraer riqueza, ya sea material o espiritual, mediante la vibración y la contracción del punto del ombligo.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Next Steps / CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-12 bg-card rounded-2xl p-8 md:p-10 border border-border/60"
                >
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-4">
                        ¿Listo para transformar tu vida?
                    </h2>
                    <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                        Esta clase es solo el comienzo. Descubre el programa completo de Kundalini Yoga
                        y lleva tu práctica al siguiente nivel con meditaciones guiadas, kriyas poderosos
                        y una comunidad de apoyo.
                    </p>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
                        <Timer className="w-5 h-5 text-primary animate-pulse" />
                        <p className="font-medium text-foreground">
                            Esta oferta especial expira en: <span className="text-primary text-xl font-bold font-mono ml-2">{formatTime(timeLeft)} min</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-10">
                        <div className="text-center">
                            <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Práctica Diaria</h3>
                            <p className="text-sm text-muted-foreground">Acceso a meditaciones y kriyas exclusivos</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Leaf className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Transformación</h3>
                            <p className="text-sm text-muted-foreground">Reduce el estrés y mejora tu claridad mental</p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <HeartHandshake className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-2">Comunidad</h3>
                            <p className="text-sm text-muted-foreground">Conecta con otros practicantes</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="https://wa.link/xy0brl" target="_blank" rel="noopener noreferrer">
                            <Button size="lg" className="text-lg px-10 py-6 w-full md:w-auto">
                                Quiero el Programa Completo
                            </Button>
                        </a>
                        <p className="text-sm text-muted-foreground mt-4">
                            Plazas limitadas • Acceso inmediato
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
};

export default FreeClassTime;
