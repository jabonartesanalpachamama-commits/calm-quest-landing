import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

const testimonials = [
  {
    name: "Patricia Mendoza",
    role: "Directora de Marketing",
    age: 45,
    initials: "PM",
    quote: "Después de 15 años en el mundo corporativo, sentía que había perdido el control de mis emociones. Los primeros 30 minutos de práctica ya marcaron una diferencia. Ahora manejo las reuniones difíciles con una calma que antes me parecía imposible.",
    timeframe: "Practicando desde hace 3 meses"
  },
  {
    name: "Laura Fernández",
    role: "Emprendedora",
    age: 38,
    initials: "LF",
    quote: "Entre mis hijos y mi negocio, vivía en un estado de agotamiento constante. Esta práctica me devolvió la energía y la paciencia que necesitaba. Mi familia ha notado el cambio.",
    timeframe: "Practicando desde hace 2 meses"
  },
  {
    name: "Dr. Carlos Ruiz",
    role: "Médico Internista",
    age: 52,
    initials: "CR",
    quote: "Como médico, estaba escéptico al principio. Pero los resultados fueron innegables: mejor sueño, menos irritabilidad y más claridad para tomar decisiones clínicas. Ahora lo recomiendo a mis pacientes.",
    timeframe: "Practicando desde hace 4 meses"
  },
  {
    name: "Andrea Morales",
    role: "Diseñadora UX",
    age: 29,
    initials: "AM",
    quote: "La ansiedad estaba afectando mi trabajo creativo. Después de un mes practicando, recuperé mi capacidad de concentración y mi confianza. Es la mejor inversión de tiempo que he hecho.",
    timeframe: "Practicando desde hace 6 semanas"
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-card rounded-2xl p-6 md:p-8 border border-border/60 hover:border-primary/30 transition-colors duration-300 h-full"
  >
    {/* Header with avatar and info */}
    <div className="flex items-start gap-4 mb-5">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="font-serif text-primary font-semibold text-lg">
          {testimonial.initials}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">
            {testimonial.name}
          </h3>
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
        </div>
        <p className="text-sm text-muted-foreground">
          {testimonial.role}, {testimonial.age} años
        </p>
      </div>
    </div>

    {/* Quote */}
    <blockquote className="font-serif text-foreground/90 leading-relaxed mb-4 italic">
      "{testimonial.quote}"
    </blockquote>

    {/* Timeframe */}
    <p className="text-xs text-muted-foreground/80">
      {testimonial.timeframe}
    </p>
  </motion.div>
);

const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
            Historias de <span className="text-gradient">Transformación Real</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Profesionales como tú que han recuperado el equilibrio emocional y transformado su bienestar.
          </p>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.name} 
                  className="flex-[0_0_100%] min-w-0 pl-1 pr-1"
                >
                  <TestimonialCard testimonial={testimonial} index={0} />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex 
                      ? "bg-primary" 
                      : "bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Ir a testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.name} 
              testimonial={testimonial} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
