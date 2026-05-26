/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  CmsPage, 
  CmsForm, 
  VisualIdentity, 
  COLOR_PALETTES,
  getLocalPages, 
  getLocalSettings, 
  getLocalForms, 
  applyCssVariablesForPalette 
} from "@/lib/CmsFallbackData";
import { CmsFormRenderer } from "@/components/CmsFormRenderer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import santoshaLogo from "@/assets/santosha-logo.jpg";

export const DynamicPage = () => {
  const params = useParams<{ slug?: string; "*"?: string }>();
  const rawSlug = params.slug || params["*"];
  const pageSlug = rawSlug && rawSlug !== "" ? rawSlug : "home";

  const [page, setPage] = useState<CmsPage | null>(null);
  const [settings, setSettings] = useState<VisualIdentity | null>(null);
  const [forms, setForms] = useState<CmsForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if administrator is logged in to show quick edit button
    const loggedIn = localStorage.getItem("sant_cms_logged_in") === "true";
    setIsAdmin(loggedIn);

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Load Settings
        let activeSettings = getLocalSettings();
        try {
          const { data, error: sErr } = await supabase.from("cms_settings").select("*");
          if (!sErr && data && data.length > 0) {
            const parsed = data.find(item => item.key === "visual_identity")?.value;
            if (parsed) activeSettings = parsed as VisualIdentity;
          }
        } catch (e) {
          console.warn("Using offline fallback for CMS settings");
        }
        setSettings(activeSettings);
        applyCssVariablesForPalette(activeSettings.palette);

        // 2. Load Forms (for rendering embedded forms)
        let activeForms = getLocalForms();
        try {
          const { data, error: fErr } = await supabase.from("cms_forms").select("*");
          if (!fErr && data && data.length > 0) {
            activeForms = data.map(d => ({
              id: d.id,
              name: d.name,
              fields: d.fields as any,
              redirectUrl: d.redirect_url || ""
            }));
          }
        } catch (e) {
          console.warn("Using offline fallback for CMS forms");
        }
        setForms(activeForms);

        // 3. Load dynamic page matching slug
        let foundPage: CmsPage | undefined;
        try {
          const { data, error: pErr } = await supabase
            .from("cms_pages")
            .select("*")
            .eq("slug", pageSlug)
            .eq("published", true)
            .single();

          if (!pErr && data) {
            foundPage = {
              id: data.id,
              title: data.title,
              slug: data.slug,
              published: data.published,
              sections: data.sections as any
            };
          }
        } catch (e) {
          console.warn("Using offline fallback for CMS page lookup");
        }

        if (!foundPage) {
          // Check local fallbacks
          const localPages = getLocalPages();
          foundPage = localPages.find(p => p.slug === pageSlug && p.published);
        }

        if (foundPage) {
          setPage(foundPage);
        } else {
          setError("Página no encontrada");
        }
      } catch (err: any) {
        console.error("Error loading dynamic page data:", err);
        setError("Ocurrió un error al cargar la página");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2C3E2B]">
        <div className="w-10 h-10 border-t-2 border-r-2 border-[#7EA172] rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg italic">Cargando tu espacio de calma...</p>
      </div>
    );
  }

  if (error || !page || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2C3E2B] px-4 text-center">
        <span className="text-5xl mb-6">🍃</span>
        <h1 className="font-serif text-3xl font-semibold mb-3">Página no encontrada</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Lo sentimos, la página que buscas no existe o no se encuentra publicada actualmente en nuestro espacio.
        </p>
        <Link to="/">
          <Button className="bg-[#7EA172] hover:bg-[#6C8E61] text-white px-6">
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }

  const palette = COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta;

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} font-${settings.fontFamily} relative flex flex-col`}>
      
      {/* Floating admin quick edit button */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link to="/admin">
            <Button className="bg-[#C98A72] text-white hover:bg-[#B57A63] shadow-lg rounded-full px-5 py-6 gap-2 flex items-center font-medium">
              ⚙️ Editar esta página
            </Button>
          </Link>
        </div>
      )}

      {/* Dynamic Header */}
      <header className={`py-4 px-6 border-b border-border/40 ${palette.cardBackground} sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-90`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={santoshaLogo} 
              alt="Logo" 
              className="h-10 w-auto rounded-lg border border-border/20"
              onError={(e) => (e.target as HTMLElement).style.display = "none"}
            />
            <span className={`font-serif text-xl font-semibold ${palette.primaryText}`}>
              {settings.brandName}
            </span>
          </Link>

          <a 
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button size="sm" className={`${palette.primary} font-medium gap-1 rounded-full`}>
              💬 Contactar WhatsApp
            </Button>
          </a>
        </div>
      </header>

      {/* Render Dynamic Sections */}
      <main className="flex-grow">
        {page.sections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          const bgSection = isEven ? palette.background : palette.cardBackground;
          
          switch (section.type) {
            
            // 1. HERO SECTION
            case "hero": {
              const heroForm = section.content.formId ? forms.find(f => f.id === section.content.formId) : null;
              
              if (heroForm) {
                return (
                  <section 
                    key={section.id} 
                    id="form-home-hero"
                    className={`py-20 md:py-28 px-6 relative overflow-hidden ${bgSection} border-b border-border/10`}
                  >
                    {/* Decorative blurred glow circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
                      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s", animationDuration: "10s" }} />
                    </div>

                    <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
                      {/* Left text column */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 text-center lg:text-left space-y-6"
                      >
                        {section.content.tagline && (
                          <span className={`inline-block px-5 py-2 text-xs font-semibold tracking-wider uppercase text-primary border border-primary/20 rounded-full ${palette.secondaryText} ${palette.secondary}`}>
                            ✨ {section.content.tagline}
                          </span>
                        )}
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#2C3E2B]">
                          {section.content.title}
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-light">
                          {section.content.subtitle}
                        </p>
                        {section.content.description && (
                          <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-light border-l border-primary/20 pl-4 py-1 max-w-lg text-left inline-block">
                            {section.content.description}
                          </p>
                        )}
                      </motion.div>

                      {/* Right form column */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative z-10 w-full max-w-md mx-auto"
                      >
                        <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#EBE7DF] shadow-[0_20px_50px_-20px_rgba(126,161,114,0.12)]">
                          <CmsFormRenderer 
                            form={heroForm} 
                            pageSlug={page.slug} 
                            buttonClassName={`${palette.primary} rounded-full py-6 font-semibold shadow-sm`}
                          />
                        </div>
                      </motion.div>
                    </div>
                  </section>
                );
              }

              return (
                <section 
                  key={section.id} 
                  className={`py-20 md:py-28 px-6 text-center ${bgSection} relative overflow-hidden border-b border-border/10`}
                >
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "12s" }} />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto space-y-6 relative z-10"
                  >
                    {section.content.tagline && (
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${palette.secondary} ${palette.secondaryText}`}>
                        {section.content.tagline}
                      </span>
                    )}
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#2C3E2B]">
                      {section.content.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto">
                      {section.content.subtitle}
                    </p>
                    {section.content.buttonText && (
                      <div className="pt-4">
                        <a href={section.content.buttonLink || "#"} target="_blank" rel="noopener noreferrer">
                          <Button size="lg" className={`${palette.primary} text-base px-8 py-6 rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300`}>
                            {section.content.buttonText}
                          </Button>
                        </a>
                      </div>
                    )}
                  </motion.div>
                </section>
              );
            }

            // 2. TEXT + IMAGE CONNECTION SECTION
            case "connection": {
              const isImageLeft = section.content.layout === "image-left";
              return (
                <section 
                  key={section.id} 
                  className={`py-20 md:py-24 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    
                    {/* Column Image */}
                    <motion.div 
                      initial={{ opacity: 0, x: isImageLeft ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`order-2 ${isImageLeft ? "md:order-1" : "md:order-2"}`}
                    >
                      {section.content.imageUrl ? (
                        <div className="p-2 bg-white border border-[#EBE7DF] rounded-[2.5rem] shadow-xl hover:scale-[1.01] transition-transform duration-500 relative">
                          <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs">🌿</div>
                          <div className="rounded-[2.2rem] overflow-hidden aspect-[4/3] md:aspect-square bg-muted">
                            <img 
                              src={section.content.imageUrl} 
                              alt={section.content.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-[4/3] rounded-[2.5rem] bg-muted border border-border/30 flex items-center justify-center text-4xl shadow-inner">
                          🧘
                        </div>
                      )}
                    </motion.div>

                    {/* Column Text */}
                    <motion.div 
                      initial={{ opacity: 0, x: isImageLeft ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`order-1 ${isImageLeft ? "md:order-2" : "md:order-1"} space-y-6`}
                    >
                      <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-[#2C3E2B]">
                        {section.content.title}
                      </h2>
                      <div className="text-muted-foreground leading-relaxed space-y-4 font-light text-md whitespace-pre-line text-justify">
                        {section.content.description}
                      </div>
                    </motion.div>

                  </div>
                </section>
              );
            }

            // 3. BENEFITS GRID SECTION
            case "benefits":
              return (
                <section 
                  key={section.id} 
                  className={`py-20 md:py-24 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-5xl mx-auto text-center space-y-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold max-w-2xl mx-auto text-[#2C3E2B] leading-tight">
                      {section.content.title}
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {section.content.items?.map((item: any, i: number) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className="p-8 rounded-[2rem] bg-white border border-[#EBE7DF] text-left space-y-5 shadow-sm hover:shadow-[0_15px_40px_-15px_rgba(126,161,114,0.15)] hover:-translate-y-1.5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group"
                        >
                          {/* Large elegant serif index background number */}
                          <span className="absolute top-6 right-8 font-serif text-5xl font-bold opacity-10 select-none text-primary group-hover:opacity-15 transition-opacity duration-300">
                            0{i + 1}
                          </span>

                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-primary/5 border border-primary/10 text-primary`}>
                            {item.icon && !["✨", "🌿"].includes(item.icon) ? item.icon : "🍃"}
                          </div>
                          
                          <h3 className="font-serif text-lg font-bold text-[#2C3E2B]">
                            {item.title}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">
                            {item.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            // 4. FORM SECTION
            case "form": {
              const formToEmbed = forms.find(f => f.id === section.content.formId);
              return (
                <section 
                  key={section.id} 
                  id={`form-${section.id}`}
                  className={`py-20 md:py-24 px-6 text-center ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-xl mx-auto space-y-8">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2B]">
                        {section.content.title}
                      </h2>
                      {section.content.subtitle && (
                        <p className="text-muted-foreground font-light text-sm md:text-base">
                          {section.content.subtitle}
                        </p>
                      )}
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white p-8 md:p-10 rounded-[2rem] border border-[#EBE7DF] shadow-[0_20px_50px_-20px_rgba(126,161,114,0.12)]"
                    >
                      {formToEmbed ? (
                        <CmsFormRenderer 
                          form={formToEmbed} 
                          pageSlug={page.slug} 
                          buttonClassName={`${palette.primary} rounded-full py-6 font-semibold`}
                        />
                      ) : (
                        <div className="text-amber-600 bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-sm text-left">
                          ⚠️ Formulario no configurado o eliminado. Edita la página desde el administrador.
                        </div>
                      )}
                    </motion.div>
                  </div>
                </section>
              );
            }

            // 5. TESTIMONIALS SECTION
            case "testimonials":
              return (
                <section 
                  key={section.id} 
                  className={`py-20 md:py-24 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-5xl mx-auto text-center space-y-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2B]">
                      {section.content.title || "Lo que dicen nuestros pacientes"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      {section.content.testimonials?.map((t: any, i: number) => {
                        // Generate initials for the avatar
                        const initials = t.author
                          ? t.author.split(" ").map((n: string) => n[0]).join("").slice(0, 2)
                          : "P";
                        return (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="p-8 rounded-[2rem] bg-white border border-[#EBE7DF] text-left space-y-6 shadow-sm hover:shadow-[0_15px_40px_-15px_rgba(126,161,114,0.12)] hover:-translate-y-1 hover:border-primary/10 transition-all duration-300 relative overflow-hidden group"
                          >
                            {/* Premium Editorial quotation mark graphic */}
                            <span className="font-serif text-7xl text-primary/10 leading-none select-none absolute top-4 left-6 pointer-events-none group-hover:text-primary/15 transition-colors">
                              “
                            </span>

                            <p className="text-muted-foreground leading-relaxed italic font-light text-sm md:text-base relative z-10 pt-4 pl-4">
                              "{t.quote}"
                            </p>
                            
                            <div className="flex items-center gap-4 border-t border-gray-100 pt-5 relative z-10">
                              {/* Beautiful initials circular badge */}
                              <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-xs font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                                {initials}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-[#2C3E2B]">{t.author}</h4>
                                <p className="text-xs text-muted-foreground font-light">{t.role || "Paciente"}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

            // 6. FAQ SECTION
            case "faq":
              return (
                <section 
                  key={section.id} 
                  className={`py-20 md:py-24 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-3xl mx-auto space-y-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C3E2B] text-center leading-tight">
                      {section.content.title || "Preguntas Frecuentes"}
                    </h2>

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {section.content.faqs?.map((faq: any, i: number) => (
                          <AccordionItem 
                            key={i} 
                            value={`faq-${i}`}
                            className="border border-[#EBE7DF] rounded-2xl px-6 bg-white shadow-xs hover:border-primary/20 transition-all duration-300"
                          >
                            <AccordionTrigger className="font-serif font-semibold text-left text-base md:text-lg hover:no-underline hover:text-primary py-4 transition-colors">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground font-light pb-4 pt-1 leading-relaxed text-xs md:text-sm">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </motion.div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </main>

      {/* Dynamic Footer */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-[#2C3E2B]">{settings.brandName}</p>
          <p className="font-light">{settings.footerText}</p>
          <div className="pt-4 flex justify-center gap-6">
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">
              🔑 Acceso Administrador
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default DynamicPage;
