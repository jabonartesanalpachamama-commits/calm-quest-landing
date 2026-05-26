import { motion } from "framer-motion";
import { Users, Clock, BookOpen } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Profesionales Transformados" },
  { icon: Clock, value: "30 min", label: "Práctica Diaria" },
  { icon: BookOpen, value: "Ciencia", label: "Respaldada" },
];

const SocialProofSection = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Únete a una Comunidad de <span className="text-primary">Transformación</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16">
            Miles de profesionales ya están utilizando estas herramientas para transformar su bienestar y lograr resultados reales.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 border border-primary/30 rounded-full mb-4">
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Research note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-b border-border/60 py-8"
          >
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Esta técnica ha sido investigada por organizaciones de salud por su impacto positivo en la <span className="text-foreground">longevidad cerebral</span> y la <span className="text-foreground">reducción del cortisol</span>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
