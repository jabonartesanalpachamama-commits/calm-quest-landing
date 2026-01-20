import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FreeClass = () => {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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

        {/* Next Steps / CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-card rounded-2xl p-8 md:p-10 border border-border/60"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-center mb-4">
            ¿Listo para transformar tu vida?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Esta clase es solo el comienzo. Descubre el programa completo de Kundalini Yoga 
            y lleva tu práctica al siguiente nivel con meditaciones guiadas, kriyas poderosos 
            y una comunidad de apoyo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="text-center">
              <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-semibold mb-2">Práctica Diaria</h3>
              <p className="text-sm text-muted-foreground">Acceso a meditaciones y kriyas exclusivos</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-semibold mb-2">Transformación</h3>
              <p className="text-sm text-muted-foreground">Reduce el estrés y mejora tu claridad mental</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">Comunidad</h3>
              <p className="text-sm text-muted-foreground">Conecta con otros practicantes</p>
            </div>
          </div>
          
          <div className="text-center">
            <a href="https://wa.link/xy0brl" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-10 py-6">
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

export default FreeClass;
