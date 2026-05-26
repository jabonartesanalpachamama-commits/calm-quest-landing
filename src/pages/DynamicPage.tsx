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
  DEFAULT_PAGES,
  getLocalPages, 
  getLocalSettings, 
  getLocalForms, 
  applyCssVariablesForPalette,
  applyFontPair
} from "@/lib/CmsFallbackData";
import { CmsFormRenderer } from "@/components/CmsFormRenderer";
import FloatingCTA from "@/components/FloatingCTA";
import AiChatWidget from "@/components/AiChatWidget";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import santoshaLogo from "@/assets/santosha-logo.jpg";

// ─── CtaButton: smart CTA that respects ctaLink field ───────────────────────
// • "#anchor"   → smooth-scrolls to the element with that id
// • "https://…" → navigates to the URL (external links open in new tab)
// • ""           → falls back to scroll to #form-home-hero
interface CtaButtonProps {
  text: string;
  link: string;
  className?: string;
  id?: string;
}
const CtaButton = ({ text, link, className, id }: CtaButtonProps) => {
  const handleClick = () => {
    const target = link.trim();
    if (!target || target === "#form-home-hero") {
      const anchor = document.querySelector("#form-home-hero");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (target.startsWith("#")) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    // External or absolute URL
    if (target.startsWith("http")) {
      window.open(target, "_blank", "noopener noreferrer");
    } else {
      window.location.href = target;
    }
  };
  return (
    <button id={id} onClick={handleClick} className={className}>
      {text}
    </button>
  );
};

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
        if (activeSettings) {
          applyCssVariablesForPalette(activeSettings.palette);
          applyFontPair(activeSettings.fontFamily);
          setSettings(activeSettings);
        }

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

        // ── Smart section merge ──────────────────────────────────────────────
        // If the page was loaded from cache/Supabase, it may be missing new
        // section types added since it was last saved (e.g. "transformation",
        // "cta"). We append any missing section types from the latest defaults
        // without touching existing sections the admin may have customised.
        if (foundPage) {
          const defaultPage = DEFAULT_PAGES.find(p => p.slug === pageSlug);
          if (defaultPage) {
            const existingTypes = new Set(foundPage.sections.map((s: any) => s.type));
            const missingSections = defaultPage.sections.filter(
              s => !existingTypes.has(s.type)
            );
            if (missingSections.length > 0) {
              foundPage = {
                ...foundPage,
                sections: [...foundPage.sections, ...missingSections],
              };
            }
          }
        }
        // ────────────────────────────────────────────────────────────────────

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg italic">Cargando tu espacio de calma...</p>
      </div>
    );
  }

  const tempPalette = settings ? (COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta) : COLOR_PALETTES.menta;

  if (error || !page || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <span className="text-5xl mb-6">🍃</span>
        <h1 className="font-serif text-3xl font-semibold mb-3">Página no encontrada</h1>
        <p className="text-muted-foreground max-w-md mb-8 font-light">
          Lo sentimos, la página que buscas no existe o no se encuentra publicada actualmente en nuestro espacio de calma.
        </p>
        <Link to="/">
          <Button className={`${tempPalette.primary} px-6 rounded-full font-medium shadow-sm`}>
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }


  const palette = COLOR_PALETTES[settings.palette] || COLOR_PALETTES.menta;

  return (
    <div className={`min-h-screen ${palette.background} ${palette.foreground} font-${settings.fontFamily} relative flex flex-col`}>
      
      {/* Floating CTA — appears when hero form scrolls out of view */}
      <FloatingCTA
        formAnchor="#form-home-hero"
        ctaText="Accede Gratis Ahora"
        subText="🔥 +247 personas ya se registraron esta semana"
      />

      {/* Floating admin quick edit button */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link to="/admin">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full px-5 py-6 gap-2 flex items-center font-medium">
              ⚙️ Editar esta página
            </Button>
          </Link>
        </div>
      )}

      {/* Dynamic Header */}
      <header className={`py-4 px-6 border-b border-border/40 ${palette.cardBackground} sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-90`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
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

          <div className="flex items-center gap-3">
            {/* Primary: scroll to registration form */}
            <button
              id="header-register-btn"
              onClick={() => {
                const anchor = document.querySelector("#form-home-hero");
                if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${palette.primary}`}
            >
              Clase Gratuita
            </button>

            {/* Secondary: WhatsApp link */}
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors hidden md:block"
            >
              💬 WhatsApp
            </a>
          </div>
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
                      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-gentle-pulse" />
                      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: "3s" }} />
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
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
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
                        <div className="bg-card p-8 md:p-10 rounded-[2rem] border border-border/60 shadow-md shadow-foreground/[0.01]">
                          <CmsFormRenderer 
                            form={heroForm} 
                            pageSlug={page.slug} 
                            buttonClassName={`${palette.primary} rounded-full py-6 font-semibold shadow-sm`}
                          />
                        </div>

                        {/* Urgency + social counter below the form card */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="mt-4 text-center space-y-2"
                        >
                          <p className="text-xs font-medium text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              {/* Mini avatar stack */}
                              <span className="flex -space-x-1.5">
                                {["PM", "LF", "CR"].map((init) => (
                                  <span key={init} className="w-5 h-5 rounded-full bg-primary/20 border border-card text-[8px] font-bold text-primary flex items-center justify-center">{init}</span>
                                ))}
                              </span>
                              <span>+247 personas ya se registraron esta semana</span>
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground/70">
                            ⏳ Cupos disponibles solo por tiempo limitado
                          </p>
                        </motion.div>
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-gentle-pulse" />
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
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
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
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10`}
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
                        <div className="p-2 bg-card border border-border/60 rounded-[2.5rem] shadow-md hover:scale-[1.01] transition-transform duration-500 relative">
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
                      <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-foreground">
                        {section.content.title}
                      </h2>
                      <div className="text-muted-foreground leading-relaxed space-y-4 font-light text-md whitespace-pre-line text-justify max-w-2xl">
                        {section.content.description}
                      </div>
                      {section.content.buttonText && (
                        <div className="pt-2">
                          <CtaButton
                            text={section.content.buttonText}
                            link={section.content.buttonLink || ""}
                            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${palette.primary}`}
                          />
                        </div>
                      )}
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
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-4xl mx-auto space-y-16">
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-center text-foreground leading-tight max-w-2xl mx-auto">
                      {section.content.title}
                    </h2>

                    <div className="max-w-3xl mx-auto divide-y divide-border/30 text-left">
                      {section.content.items?.map((item: any, i: number) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          className="py-8 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start group"
                        >
                          <span className="font-serif text-4xl md:text-5xl font-light text-primary/70 select-none sm:w-16">
                            0{i + 1}
                          </span>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-3">
                              <span className="text-primary text-sm bg-primary/5 border border-primary/10 w-9 h-9 rounded-xl flex items-center justify-center">
                                {item.icon && !["✨", "🌿"].includes(item.icon) ? item.icon : "🍃"}
                              </span>
                              {item.title}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light max-w-2xl">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Mid-section CTA after benefits */}
                    {section.content.showCta !== false && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center pt-4"
                      >
                        <CtaButton
                          text={section.content.ctaText || "Quiero estos beneficios ahora"}
                          link={section.content.ctaLink || ""}
                          className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${palette.primary}`}
                        />
                        <p className="text-xs text-muted-foreground mt-3">{section.content.ctaSubtext || "Sin costo · Sin tarjeta de crédito"}</p>
                      </motion.div>
                    )}
                  </div>
                </section>
              );

            // 3b. TRANSFORMATION SECTION (before/after emotional contrast)
            case "transformation": {
              const beforeItems: string[] = section.content.before || [];
              const afterItems: string[] = section.content.after || [];
              return (
                <section
                  key={section.id}
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-4xl mx-auto space-y-12">
                    {section.content.title && (
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-foreground leading-tight">
                        {section.content.title}
                      </h2>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      {/* Before column */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-muted/60 rounded-[1.5rem] p-8 border border-border/40 space-y-5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-muted border border-border/60 flex items-center justify-center text-muted-foreground text-sm font-bold">✕</span>
                          <h3 className="font-serif text-lg font-semibold text-foreground/70">
                            {section.content.beforeTitle || "Sin esta práctica..."}
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {beforeItems.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                              <span className="mt-0.5 w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* After column */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-primary/5 rounded-[1.5rem] p-8 border border-primary/20 space-y-5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">✓</span>
                          <h3 className="font-serif text-lg font-semibold text-foreground">
                            {section.content.afterTitle || "Con SantoSha"}
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {afterItems.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-light">
                              <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* CTA below transformation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center"
                    >
                      <CtaButton
                        text={section.content.ctaText || "Quiero transformar mi vida"}
                        link={section.content.ctaLink || ""}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${palette.primary}`}
                      />
                      <p className="text-xs text-muted-foreground mt-3">{section.content.ctaSubtext || "Gratuito · Sin compromisos · Acceso inmediato"}</p>
                    </motion.div>
                  </div>
                </section>
              );
            }

            // 4. FORM SECTION
            case "form": {
              const formToEmbed = forms.find(f => f.id === section.content.formId);
              return (
                <section 
                  key={section.id} 
                  id={`form-${section.id}`}
                  className={`py-24 md:py-32 px-6 text-center ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-xl mx-auto space-y-8">
                    <div className="space-y-3">
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
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
                      className="bg-card p-8 md:p-10 rounded-[2rem] border border-border/60 shadow-md shadow-foreground/[0.01]"
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
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-5xl mx-auto text-center space-y-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
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
                            className="p-8 rounded-[2rem] bg-card border border-border/60 text-left space-y-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group"
                          >
                            {/* Premium Editorial quotation mark graphic */}
                            <span className="font-serif text-7xl text-primary/10 leading-none select-none absolute top-4 left-6 pointer-events-none group-hover:text-primary/15 transition-colors">
                              &#8220;
                            </span>

                            <p className="text-muted-foreground leading-relaxed italic font-light text-sm md:text-base relative z-10 pt-4 pl-4">
                              &ldquo;{t.quote}&rdquo;
                            </p>
                            
                            <div className="flex items-center gap-4 border-t border-gray-100/50 pt-5 relative z-10">
                              {/* Beautiful initials circular badge */}
                              <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-xs font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                                {initials}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-foreground">{t.author}</h4>
                                <p className="text-xs text-muted-foreground font-light">{t.role || "Paciente"}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Post-testimonials CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="pt-4"
                    >
                      <CtaButton
                        text={section.content.ctaText || "Quiero mi transformación"}
                        link={section.content.ctaLink || ""}
                        className={`inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm ${palette.primary}`}
                      />
                      <p className="text-xs text-muted-foreground mt-3">{section.content.ctaSubtext || "Únete a +10,000 personas que ya cambiaron su vida"}</p>
                    </motion.div>
                  </div>
                </section>
              );

            // 6. FAQ SECTION
            case "faq":
              return (
                <section 
                  key={section.id} 
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10`}
                >
                  <div className="max-w-3xl mx-auto space-y-12">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center leading-tight">
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
                            className="border border-border/60 rounded-2xl px-6 bg-card shadow-xs hover:border-primary/20 transition-all duration-300"
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

            // 7. CLOSING CTA SECTION
            case "cta": {
              return (
                <section
                  key={section.id}
                  className={`py-24 md:py-32 px-6 ${bgSection} border-b border-border/10 relative overflow-hidden`}
                >
                  {/* Soft radial glow */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-3xl" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl mx-auto text-center space-y-8 relative z-10"
                  >
                    {/* Rhetorical question */}
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                      {section.content.title || "¿Cuántos días más quieres sentirte así?"}
                    </h2>

                    <p className="text-lg text-muted-foreground leading-relaxed font-light max-w-xl mx-auto">
                      {section.content.subtitle || "El cambio que buscas comienza con una sola decisión. Tu clase gratuita de Kundalini Yoga está a un clic de distancia."}
                    </p>

                    {/* Big CTA */}
                    <CtaButton
                      id="closing-cta-btn"
                      text={section.content.ctaText || "Quiero mi Clase Gratuita Ahora"}
                      link={section.content.ctaLink || ""}
                      className={`inline-flex items-center gap-2 px-10 py-5 rounded-full text-base font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-md ${palette.primary}`}
                    />

                    {/* Risk reversal */}
                    <p className="text-sm text-muted-foreground">
                      {section.content.disclaimer || "Sin riesgo · Sin tarjeta · Sin compromisos · Acceso inmediato"}
                    </p>

                    {/* Trust badges row */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                      {["100% Gratuita", "Respaldada por Neurociencia", "+10,000 Personas Transformadas"].map((badge) => (
                        <span key={badge} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </section>
              );
            }

            default:
              return null;
          }
        })}
      </main>

      {/* Dynamic Footer */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-foreground">{settings.brandName}</p>
          <p className="font-light">{settings.footerText}</p>
          <div className="pt-4 flex justify-center gap-6">
            <Link to="/admin/login" className="hover:underline text-xs text-muted-foreground/60 transition-colors">
              🔑 Acceso Administrador
            </Link>
          </div>
        </div>
      </footer>
      {/* AI Chat Widget */}
      <AiChatWidget pageSlug={page.slug} />

    </div>
  );
};

export default DynamicPage;
