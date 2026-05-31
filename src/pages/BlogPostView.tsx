/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Edit } from "lucide-react";
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
import Header from "@/components/Header";
import santoshaLogo from "@/assets/santosha-logo.jpg";

export const BlogPostView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [settings, setSettings] = useState<VisualIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if administrator is logged in to show quick edit button
    const loggedIn = localStorage.getItem("sant_cms_logged_in") === "true";
    setIsAdmin(loggedIn);

    const loadPost = async () => {
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

        // 2. Load Blog Post matching slug
        let foundPost: CmsPost | undefined;
        try {
          const { data, error: pErr } = await supabase
            .from("cms_posts")
            .select("*")
            .eq("slug", slug)
            .single();

          if (!pErr && data) {
            foundPost = {
              id: data.id,
              title: data.title,
              slug: data.slug,
              content: data.content,
              excerpt: data.excerpt,
              imageUrl: data.image_url,
              published: data.published,
              publishedAt: data.published_at
            };
          }
        } catch (e) {
          console.warn("Using offline fallback for blog post lookup");
        }

        if (!foundPost) {
          const localPosts = getLocalPosts();
          foundPost = localPosts.find(p => p.slug === slug);
        }

        // Validate that post is published and schedule date is reached (unless user is admin checking a preview)
        if (foundPost) {
          const isFuture = new Date(foundPost.publishedAt) > new Date();
          const isDraft = !foundPost.published;

          if ((isFuture || isDraft) && !loggedIn) {
            setError("Artículo no disponible públicamente");
          } else {
            setPost(foundPost);
          }
        } else {
          setError("Artículo no encontrado");
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError("Ocurrió un error al cargar la lectura");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // A premium, lightweight markdown to HTML block parser
  const renderMarkdownContent = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    let inList = false;
    const renderedBlocks: any[] = [];

    const parseInlineStyles = (lineStr: string) => {
      // Bold **text**
      let parsed = lineStr.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Italic *text*
      parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>");
      // Inline code `code`
      parsed = parsed.replace(/`(.*?)`/g, "<code class='bg-muted border border-border/60 px-1 py-0.5 rounded text-xs font-mono font-bold text-primary'>$1</code>");
      return parsed;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Heading 1 (# title)
      if (trimmed.startsWith("# ")) {
        if (inList) {
          inList = false;
        }
        const textOnly = trimmed.slice(2);
        renderedBlocks.push(
          <h1 key={`h1-${idx}`} className="font-serif text-3xl md:text-4xl font-bold mt-10 mb-6 text-primary leading-tight">
            {textOnly}
          </h1>
        );
      } 
      // Heading 2 (## title)
      else if (trimmed.startsWith("## ")) {
        if (inList) {
          inList = false;
        }
        const textOnly = trimmed.slice(3);
        renderedBlocks.push(
          <h2 key={`h2-${idx}`} className="font-serif text-2xl md:text-3xl font-bold mt-8 mb-4 text-foreground/90 leading-snug">
            {textOnly}
          </h2>
        );
      } 
      // Heading 3 (### title)
      else if (trimmed.startsWith("### ")) {
        if (inList) {
          inList = false;
        }
        const textOnly = trimmed.slice(4);
        renderedBlocks.push(
          <h3 key={`h3-${idx}`} className="font-serif text-xl md:text-2xl font-bold mt-6 mb-3 text-foreground/80 leading-snug">
            {textOnly}
          </h3>
        );
      } 
      // Divider (--- or ***)
      else if (trimmed === "---" || trimmed === "***") {
        if (inList) {
          inList = false;
        }
        renderedBlocks.push(
          <hr key={`hr-${idx}`} className="my-10 border-border/60" />
        );
      } 
      // Bullet list items (* item or - item)
      else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const textOnly = trimmed.slice(2);
        const parsedText = parseInlineStyles(textOnly);

        if (!inList) {
          inList = true;
          renderedBlocks.push(
            <ul key={`ul-${idx}`} className="list-disc pl-6 space-y-2 mb-6 font-serif text-foreground/85 font-light leading-relaxed text-md md:text-lg">
              <li dangerouslySetInnerHTML={{ __html: parsedText }} />
            </ul>
          );
        } else {
          // Append to the previous list block
          const lastBlock = renderedBlocks[renderedBlocks.length - 1];
          renderedBlocks[renderedBlocks.length - 1] = (
            <ul key={lastBlock.key} className="list-disc pl-6 space-y-2 mb-6 font-serif text-foreground/85 font-light leading-relaxed text-md md:text-lg">
              {lastBlock.props.children}
              <li dangerouslySetInnerHTML={{ __html: parsedText }} />
            </ul>
          );
        }
      } 
      // Empty lines
      else if (trimmed === "") {
        if (inList) {
          inList = false;
        }
      } 
      // Standard Paragraph
      else {
        if (inList) {
          inList = false;
        }
        const parsedText = parseInlineStyles(trimmed);
        renderedBlocks.push(
          <p 
            key={`p-${idx}`} 
            className="leading-relaxed font-serif text-md md:text-lg text-foreground/85 font-light mb-6 text-justify"
            dangerouslySetInnerHTML={{ __html: parsedText }}
          />
        );
      }
    });

    return renderedBlocks;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg italic text-muted-foreground">Abriendo artículo...</p>
      </div>
    );
  }

  if (error || !post || !settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
        <span className="text-5xl mb-6">📚</span>
        <h1 className="font-serif text-3xl font-semibold mb-3">Lectura no disponible</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          {error || "El artículo que buscas no existe o está programado para publicarse más adelante."}
        </p>
        <Link to="/blog">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            Volver al Blog
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
          <Link to="/admin" state={{ tab: "blog", editPostId: post.id }}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full px-5 py-6 gap-2 flex items-center font-medium">
              <Edit className="w-4 h-4" /> ⚙️ Editar Artículo
            </Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <Header palette={palette} brandName={settings.brandName} />

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-8 select-text">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al listado de artículos
        </Link>

        {/* Article Meta */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {calculateReadingTime(post.content)} minutos de lectura
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl italic text-muted-foreground font-light leading-relaxed border-l-2 border-primary/30 pl-4 py-1 text-left">
            {post.excerpt}
          </p>
        </div>

        {/* Featured Image */}
        {post.imageUrl && (
          <div className="rounded-3xl overflow-hidden shadow-md border border-border/30 aspect-[16/9] bg-muted">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Mindful Body Text */}
        <article className="pt-4 pb-12 select-text font-serif leading-relaxed">
          {renderMarkdownContent(post.content)}
        </article>

        {/* Mindful Call to Action Block */}
        <div className={`p-8 md:p-10 rounded-3xl ${palette.cardBackground} border border-primary/20 text-center space-y-6 shadow-sm relative overflow-hidden`}>
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <span className="text-3xl block">🌿</span>
          <h3 className="font-serif text-2xl font-semibold">¿Sientes que es momento de iniciar tu camino?</h3>
          <p className="text-sm md:text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Te ofrecemos un espacio seguro, libre de juicios y compasivo para trabajar en tus emociones y recuperar la armonía. Agenda hoy tu primera consulta de terapia o clase de yoga con nosotros.
          </p>
          <div className="pt-2">
            <a 
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hola,%20leí%20el%20artículo%20"${encodeURIComponent(post.title)}"%20y%20me%20gustaría%20solicitar%20información%20sobre%20sus%20servicios.`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className={`${palette.primary} rounded-full font-medium px-8 py-5 text-sm`}>
                💬 Solicitar Información vía WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t border-border/40 ${palette.cardBackground} text-center text-sm text-muted-foreground`}>
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-serif font-semibold text-foreground">{settings.brandName}</p>
          <p className="font-light">{settings.footerText}</p>
        </div>
      </footer>

    </div>
  );
};

export default BlogPostView;
