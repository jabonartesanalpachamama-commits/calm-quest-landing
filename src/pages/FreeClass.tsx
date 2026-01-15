import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FreeClass = () => {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
            Tu Clase Gratuita
          </h1>
          <p className="text-muted-foreground text-lg">
            ¡Felicidades! Ya tienes acceso a esta herramienta de transformación.
          </p>
        </div>

        <div className="relative w-full aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl glow-primary">
          {/* Replace VIDEO_ID with your actual YouTube or Vimeo video ID */}
          <iframe
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Clase Gratuita"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default FreeClass;
