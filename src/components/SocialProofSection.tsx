import { motion } from "framer-motion";
import { Users, Award, BookOpen } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Profesionales Transformados" },
  { icon: Award, value: "12 min", label: "Práctica Diaria" },
  { icon: BookOpen, value: "Ciencia", label: "Respaldada" },
];

const SocialProofSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Únete a una Comunidad de <span className="text-gradient">Transformación</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
            Únete a una comunidad de miles de profesionales que ya están utilizando estas herramientas para transformar su bienestar y <strong className="text-foreground">lograr resultados reales</strong>.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8"
          >
            <p className="text-muted-foreground leading-relaxed">
              Esta técnica ha sido investigada por organizaciones de salud por su impacto positivo en la <strong className="text-foreground">longevidad cerebral</strong> y la <strong className="text-foreground">reducción del cortisol</strong>.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
