/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  CmsPost, 
  VisualIdentity, 
  COLOR_PALETTES,
  getLocalPosts, 
  getLocalSettings, 
  applyCssVariablesForPalette 
} from "@/lib/CmsFallbackData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import santoshaLogo from "@/assets/santosha-logo.webp";

export const BlogList = () => {
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [settings, setSettings] = useState<VisualIdentity>(() => getLocalSettings());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadBlogData = async () => {
      setLoading(true);
      try {
        // 1. Load Settings
        let activeSettings = getLocalSettings();
        try {
          const { data, error: sErr } = await supabase.from("cms_settings").select("*");
          if (!sErr && data && data.length > 0) {
            const parsed = data.find(item => item.key === "visual_identity")?.value;
            if (parsed) activeSettings = parsed as unknown as VisualIdentity;
          }
        } catch (e) {
          console.warn("Using offline fallback for CMS settings");
        }
        setSettings(activeSettings);
        applyCssVariablesForPalette(activeSettings.palette);

        // 2. Load Blog Posts
        let activePosts = getLocalPosts();
        try {
          const { data, error: pErr } = await supabase
            .from("cms_posts")
            .select("*")
            .eq("published", true)
            .lte("published_at", new Date().toISOString()) // Natively filter out future scheduled posts!
            .order("published_at", { ascending: false });

          if (!pErr && data && data.length > 0) {
            activePosts = data.map(d => ({
              id: d.id,
              title: d.title,
              slug: d.slug,
              content: d.content,
              excerpt: d.excerpt,
              imageUrl: d.image_url,
              published: d.published,
              publishedAt: d.published_at
            }));
          }
        } catch (e) {
          console.warn("Using offline fallback for blog posts");
        }

        // Apply fallback filters locally just in case offline data contains drafts/scheduled posts
        const now = new Date();
        const filteredLocal = activePosts.filter(
          p => p.published && new Date(p.publishedAt) <= now
        );

        setPosts(filteredLocal);
      } catch (err) {
        console.error("Error loading blog posts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg italic text-muted-foreground">Abriendo biblioteca de bienestar...</p>
      </div>
    );
  }

  const palette = COLOR_PALETTES[settings?.palette] || COLOR_PALETTES.menta;

  return (
    <div className={`min-h-screen flex flex-col ${palette.background} ${palette.foreground} font-${settings?.fontFamily || "serif"}`}>
      {/* Header */}
      <Header palette={palette} brandName={settings?.brandName} />

      {/* Hero Banner */}
      <section className="py-12 md:py-16 px-6 text-center max-w-4xl mx-auto space-y-4">
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${palette.secondary} ${palette.secondaryText}`}>
          Espacio de Lectura y Reflexión
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
          El Blog de SantoSha
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Encuentra artículos sobre salud mental, técnicas de respiración, Kundalini Yoga y herramientas prácticas para cultivar tu paz interior en el día a día.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto pt-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Buscar artículos por título o tema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-card border-border/60 rounded-2xl shadow-sm focus:border-primary focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-24 flex-grow w-full">
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`flex flex-col justify-between rounded-3xl ${palette.cardBackground} border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group`}
              >
                <div>
                  {/* Thumbnail */}
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/10] bg-muted relative">
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🧘
                      </div>
                    )}
                  </Link>

                  {/* Metadata and Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {calculateReadingTime(post.content)} min
                      </span>
                    </div>

                    <Link to={`/blog/${post.slug}`} className="block">
                      <h2 className="font-serif text-xl font-bold leading-snug group-hover:text-primary transition-colors duration-200">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Read Button */}
                <div className="p-6 pt-0">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 rounded-2xl group-hover:text-primary border border-border/40">
                      <span className="text-xs font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Leer Artículo Completo
                      </span>
                      <span>→</span>
                    </Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/40 border border-border/60 rounded-3xl p-8 max-w-md mx-auto space-y-4">
            <span className="text-4xl block">📚</span>
            <h3 className="font-serif text-xl font-semibold">No se encontraron artículos</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Prueba a buscar con otras palabras clave o explora de nuevo más tarde cuando el equipo publique nuevas lecturas.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="rounded-full"
            >
              Mostrar todos los artículos
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-foreground">{settings?.brandName || "SantoSha"}</p>
          <p className="font-light">{settings?.footerText || "© 2026 SantoSha - Espacio de Bienestar."}</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogList;
