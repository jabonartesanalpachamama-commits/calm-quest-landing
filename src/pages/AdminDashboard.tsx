/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  VisualIdentity, 
  CmsPage, 
  CmsForm, 
  CmsSubmission, 
  CmsPost,
  AiAgentConfig,
  COLOR_PALETTES,
  FONT_PAIRS,
  FontFamilyKey,
  applyFontPair,
  getLocalPages, 
  saveLocalPages,
  getLocalSettings, 
  saveLocalSettings,
  getLocalForms, 
  saveLocalForms,
  getLocalSubmissions, 
  saveLocalSubmissions,
  getLocalPosts,
  saveLocalPosts,
  getLocalAgentConfig,
  saveLocalAgentConfig
} from "@/lib/CmsFallbackData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  FileText, 
  Database, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Download, 
  Search, 
  Check, 
  LogOut, 
  Copy, 
  Sparkles, 
  Heart,
  ChevronRight,
  BookOpen,
  Calendar,
  Bot,
  MessageSquare,
  Users,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Key,
  Save
} from "lucide-react";

export const AdminDashboard = () => {
  const [settings, setSettings] = useState<VisualIdentity | null>(null);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [forms, setForms] = useState<CmsForm[]>([]);
  const [submissions, setSubmissions] = useState<CmsSubmission[]>([]);
  
  // App state
  const [activeTab, setActiveTab] = useState("pages");
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [editingForm, setEditingForm] = useState<CmsForm | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormFilter, setSelectedFormFilter] = useState("all");

  // ─── AI Agent state ────────────────────────────────────────────────────────
  const [agentConfig, setAgentConfig] = useState<AiAgentConfig | null>(null);
  const [agentSaving, setAgentSaving] = useState(false);
  const [agentTestResult, setAgentTestResult] = useState<string | null>(null);

  // ─── Datos/Pacientes — 3 sources ──────────────────────────────────────────
  const [registrations, setRegistrations] = useState<Array<{ id: string; name: string; email: string; created_at: string }>>([]);
  const [chatLeads, setChatLeads] = useState<Array<{ id: string; page_slug: string; name: string; contact: string; conversation: any[]; created_at: string }>>([]);
  const [dataSubTab, setDataSubTab] = useState<"forms" | "registrations" | "chatbot">("forms");
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  
  // Blog states
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [editingPost, setEditingPost] = useState<CmsPost | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTone, setAiTone] = useState("empatico");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  
  const location = useLocation();
  
  // Real-time Preview states
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  const { toast } = useToast();
  const navigate = useNavigate();


  // Authentication check: require a signed-in user with the admin role
  useEffect(() => {
    const verify = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        await supabase.auth.signOut();
        navigate("/admin/login");
      }
    };
    verify();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);


  // Load all data
  useEffect(() => {
    const loadAllCmsData = async () => {
      // 1. Load Settings
      let activeSettings = getLocalSettings();
      try {
        const { data } = await supabase.from("cms_settings").select("*");
        if (data && data.length > 0) {
          const parsed = data.find(item => item.key === "visual_identity")?.value;
          if (parsed) activeSettings = parsed as unknown as VisualIdentity;
        }
      } catch (e) {
        console.warn("Db access error, using local settings");
      }
      setSettings(activeSettings);
      applyFontPair(activeSettings.fontFamily);

      // 2. Load Pages
      let activePages = getLocalPages();
      try {
        const { data } = await supabase.from("cms_pages").select("*");
        if (data && data.length > 0) {
          activePages = data.map(d => ({
            id: d.id,
            title: d.title,
            slug: d.slug,
            published: d.published,
            sections: d.sections as any
          }));
        }
      } catch (e) {
        console.warn("Db access error, using local pages");
      }
      setPages(activePages);

      // 3. Load Forms
      let activeForms = getLocalForms();
      try {
        const { data } = await supabase.from("cms_forms").select("*");
        if (data && data.length > 0) {
          activeForms = data.map(d => ({
            id: d.id,
            name: d.name,
            fields: d.fields as any,
            redirectUrl: d.redirect_url || ""
          }));
        }
      } catch (e) {
        console.warn("Db access error, using local forms");
      }
      setForms(activeForms);

      // 4. Load Submissions / Leads
      let activeSubs = getLocalSubmissions();
      try {
        const { data } = await supabase.from("cms_submissions").select("*").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          activeSubs = data.map(d => ({
            id: d.id,
            formId: d.form_id,
            pageSlug: d.page_slug,
            data: d.data as any,
            createdAt: d.created_at
          }));
        }
      } catch (e) {
        console.warn("Db access error, using local submissions");
      }
      setSubmissions(activeSubs);

      // 5. Load Posts
      let activePosts = getLocalPosts();
      try {
        const { data, error } = await supabase.from("cms_posts").select("*").order("published_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
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
        console.warn("Db access error, using local posts:", e);
      }
      setPosts(activePosts);

      // 6. Load AI Agent Config
      let activeCfg = getLocalAgentConfig();
      try {
        const { data: cfgRows } = await supabase.from("cms_settings").select("*");
        const agentRow = cfgRows?.find((r: any) => r.key === "ai_agent_config");
        if (agentRow?.value) activeCfg = { ...activeCfg, ...(agentRow.value as any) };
      } catch { /* noop */ }
      setAgentConfig(activeCfg);

      // 7. Load Registrations (Lovable table)
      try {
        const { data: regsData } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
        if (regsData) setRegistrations(regsData as any);
      } catch { /* noop */ }

      // 8. Load Chat Leads
      try {
        const { data: chatData } = await (supabase as any).from("chat_leads").select("*").order("created_at", { ascending: false });
        if (chatData) setChatLeads(chatData);
      } catch {
        // Table might not exist yet — also try localStorage
        try {
          const local = JSON.parse(localStorage.getItem("sant_chat_leads") || "[]");
          if (local.length) setChatLeads(local);
        } catch { /* noop */ }
      }
    };

    loadAllCmsData();
  }, []);

  // Quick jump edit from view route
  useEffect(() => {
    if (location.state && (location.state as any).tab === "blog") {
      setActiveTab("blog");
      const editPostId = (location.state as any).editPostId;
      if (editPostId) {
        const targetPost = posts.find(p => p.id === editPostId);
        if (targetPost) {
          setEditingPost(targetPost);
        }
      }
    }
  }, [location.state, posts]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("sant_cms_logged_in");
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración.",
    });
    navigate("/admin/login");
  };

  // --- SAVE AI AGENT CONFIG ---
  const handleSaveAgent = async () => {
    if (!agentConfig) return;
    setAgentSaving(true);
    saveLocalAgentConfig(agentConfig);
    try {
      const { error } = await supabase
        .from("cms_settings")
        .upsert({ key: "ai_agent_config", value: agentConfig as any });
      if (error) throw error;
      toast({ title: "✅ Agente guardado", description: "La configuración del asistente IA se ha actualizado." });
    } catch {
      toast({ title: "💾 Guardado localmente", description: "Sin conexión con la base de datos, guardado en el navegador." });
    } finally {
      setAgentSaving(false);
    }
  };

  // --- TEST AI AGENT via Edge Function ---
  const handleTestAgent = async () => {
    setAgentTestResult("🔄 Probando conexión con la Edge Function...");
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const res = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          message: "Responde solo con estas palabras exactas: Conexión exitosa",
          systemPrompt: "Eres un asistente de prueba. Responde con lo que el usuario te pide.",
          history: []
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        if (err.includes("GEMINI_API_KEY")) {
          setAgentTestResult("⚠️ Edge Function activa, pero falta configurar el secreto GEMINI_API_KEY en Supabase.");
        } else {
          setAgentTestResult(`❌ Edge Function error ${res.status}: ${err.slice(0, 120)}`);
        }
        return;
      }
      const data = await res.json();
      setAgentTestResult(`✅ IA activa y respondiendo: "${(data.text || "").slice(0, 80)}"`);
    } catch (err: any) {
      setAgentTestResult(`❌ Error: ${err?.message || "No se pudo conectar con la Edge Function"}`);
    }
  };

  // --- SAVE SETTINGS ---
  const handleSaveSettings = async (updatedSettings: VisualIdentity) => {
    setSettings(updatedSettings);
    saveLocalSettings(updatedSettings);

    try {
      const { error } = await supabase
        .from("cms_settings")
        .upsert({ key: "visual_identity", value: updatedSettings as any });
      
      if (error) throw error;
      toast({
        title: "Ajustes guardados",
        description: "El estilo visual del sitio se ha actualizado con éxito.",
      });
    } catch (e) {
      console.warn("Could not save settings to Supabase, saved locally:", e);
      toast({
        title: "Guardado localmente",
        description: "Los ajustes se guardaron en tu navegador (Supabase sin conexión).",
      });
    }
  };

  // --- SAVE DYNAMIC PAGE ---
  const handleSavePage = async (updatedPage: CmsPage) => {
    const isNew = !pages.some(p => p.id === updatedPage.id);
    let newPagesList = [];

    if (isNew) {
      newPagesList = [...pages, updatedPage];
    } else {
      newPagesList = pages.map(p => p.id === updatedPage.id ? updatedPage : p);
    }

    setPages(newPagesList);
    saveLocalPages(newPagesList);

    try {
      const { error } = await supabase.from("cms_pages").upsert({
        id: isNew ? undefined : updatedPage.id,
        title: updatedPage.title,
        slug: updatedPage.slug,
        published: updatedPage.published,
        sections: updatedPage.sections as any
      });

      if (error) throw error;
      
      toast({
        title: isNew ? "Página creada" : "Página actualizada",
        description: `Se ha guardado "${updatedPage.title}" correctamente.`,
      });
      setEditingPage(null);
    } catch (e) {
      console.warn("Could not sync page with Supabase, saved locally:", e);
      toast({
        title: "Guardado localmente",
        description: "Se guardó en tu dispositivo. Aplica la migración SQL para sincronizar.",
      });
      setEditingPage(null);
    }
  };

  // --- DELETE PAGE ---
  const handleDeletePage = async (pageId: string) => {
    const targetPage = pages.find(p => p.id === pageId);
    if (!targetPage) return;

    if (targetPage.slug === "home") {
      toast({
        title: "Operación no permitida",
        description: "No puedes eliminar la página de portada principal de tu web. Primero establece otra página como portada.",
        variant: "destructive"
      });
      return;
    }

    if (!window.confirm(`¿Estás seguro de que deseas eliminar la página "${targetPage.title}"?`)) return;

    const filtered = pages.filter(p => p.id !== pageId);
    setPages(filtered);
    saveLocalPages(filtered);

    try {
      const { error } = await supabase.from("cms_pages").delete().eq("id", pageId);
      if (error) throw error;
      toast({
        title: "Página eliminada",
        description: `La página "${targetPage.title}" fue removida.`,
      });
    } catch (e) {
      console.warn("Removed locally only:", e);
      toast({
        title: "Eliminada del navegador",
        description: "Se eliminó localmente.",
      });
    }
  };

  // --- SET PAGE AS HOMEPAGE ---
  const handleSetAsHomepage = async (targetPage: CmsPage) => {
    if (!window.confirm(`¿Estás seguro de que deseas establecer "${targetPage.title}" como la Portada Principal de tu web? La portada actual se guardará como una página secundaria.`)) {
      return;
    }

    // 1. Find the current home page
    const currentHome = pages.find(p => p.slug === "home");
    let updatedPages = [...pages];

    // If there is a current home page, rename its slug to a safe one based on its title or timestamp
    if (currentHome) {
      const sanitizedTitle = currentHome.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      
      const newSlug = sanitizedTitle && sanitizedTitle !== "home" 
        ? `${sanitizedTitle}-anterior`
        : `inicio-previo-${Date.now().toString().slice(-4)}`;

      // Update in our memory list
      updatedPages = updatedPages.map(p => 
        p.id === currentHome.id 
          ? { ...p, slug: newSlug } 
          : p
      );

      // Sincronizar el renombre en la base de datos
      try {
        await supabase
          .from("cms_pages")
          .update({ slug: newSlug })
          .eq("id", currentHome.id);
      } catch (dbErr) {
        console.warn("Could not rename old home in database, working with local fallback:", dbErr);
      }
    }

    // 2. Set target page slug to "home"
    updatedPages = updatedPages.map(p => 
      p.id === targetPage.id 
        ? { ...p, slug: "home" } 
        : p
    );

    // Save lists locally and in state
    setPages(updatedPages);
    saveLocalPages(updatedPages);

    // Sincronizar el nuevo slug de portada en Supabase
    try {
      const { error } = await supabase
        .from("cms_pages")
        .update({ slug: "home" })
        .eq("id", targetPage.id);

      if (error) throw error;

      toast({
        title: "¡Nueva Portada Activada!",
        description: `"${targetPage.title}" es ahora la página de inicio principal de tu web.`,
      });
    } catch (dbErr) {
      console.warn("Could not set new home in Supabase, saved locally:", dbErr);
      toast({
        title: "Portada cambiada localmente",
        description: "Se guardó en tu dispositivo. Aplica la migración para sincronizar.",
      });
    }
  };

  // --- SAVE DYNAMIC FORM ---
  const handleSaveForm = async (updatedForm: CmsForm) => {
    const isNew = !forms.some(f => f.id === updatedForm.id);
    let newFormsList = [];

    if (isNew) {
      newFormsList = [...forms, updatedForm];
    } else {
      newFormsList = forms.map(f => f.id === updatedForm.id ? updatedForm : f);
    }

    setForms(newFormsList);
    saveLocalForms(newFormsList);

    try {
      const { error } = await supabase.from("cms_forms").upsert({
        id: isNew ? undefined : updatedForm.id,
        name: updatedForm.name,
        fields: updatedForm.fields as any,
        redirect_url: updatedForm.redirectUrl || ""
      });

      if (error) throw error;

      toast({
        title: isNew ? "Formulario creado" : "Formulario actualizado",
        description: `"${updatedForm.name}" listo para ser insertado en páginas.`,
      });
      setEditingForm(null);
    } catch (e) {
      console.warn("Could not save form to Supabase:", e);
      toast({
        title: "Guardado localmente",
        description: "Formulario listo en el navegador.",
      });
      setEditingForm(null);
    }
  };

  // --- SAVE BLOG POST ---
  const handleSavePost = async (updatedPost: CmsPost) => {
    const isNew = updatedPost.id.startsWith("post-");
    
    // Prepare database payload (mapping imageUrl -> image_url)
    const postPayload: any = {
      title: updatedPost.title,
      slug: updatedPost.slug,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt || "",
      image_url: updatedPost.imageUrl || "",
      published: updatedPost.published,
      published_at: updatedPost.publishedAt
    };

    if (!isNew) {
      postPayload.id = updatedPost.id;
    }

    try {
      const { data, error } = await supabase
        .from("cms_posts")
        .upsert(postPayload)
        .select()
        .single();

      if (error) throw error;

      // Map response back to CmsPost
      const savedPost: CmsPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        imageUrl: data.image_url,
        published: data.published,
        publishedAt: data.published_at
      };

      let newPostsList = [];
      if (isNew) {
        // Remove temporary post if present, and append the true saved post with Supabase UUID
        newPostsList = [...posts.filter(p => p.id !== updatedPost.id), savedPost];
      } else {
        newPostsList = posts.map(p => p.id === updatedPost.id ? savedPost : p);
      }

      setPosts(newPostsList);
      saveLocalPosts(newPostsList);

      toast({
        title: isNew ? "Artículo publicado" : "Artículo actualizado",
        description: `Se ha guardado "${savedPost.title}" correctamente.`,
      });
      setEditingPost(null);
    } catch (e) {
      console.warn("Could not save post to Supabase, saving locally:", e);
      
      // Fallback: Save local-only keeping the post's current ID
      const postToSave = { ...updatedPost };
      let newPostsList = [];
      
      if (posts.some(p => p.id === updatedPost.id)) {
        newPostsList = posts.map(p => p.id === updatedPost.id ? postToSave : p);
      } else {
        newPostsList = [...posts, postToSave];
      }

      setPosts(newPostsList);
      saveLocalPosts(newPostsList);

      toast({
        title: "Guardado en tu navegador",
        description: "Se guardó localmente. Aplica la migración SQL en Supabase para sincronizar con la nube.",
      });
      setEditingPost(null);
    }
  };

  // --- DELETE BLOG POST ---
  const handleDeletePost = async (postId: string) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    if (!window.confirm(`¿Estás seguro de que deseas eliminar el artículo "${targetPost.title}"?`)) return;

    const filtered = posts.filter(p => p.id !== postId);
    setPosts(filtered);
    saveLocalPosts(filtered);

    // If it's a temporary ID, it's not in the database, so we don't need to call Supabase
    if (postId.startsWith("post-")) {
      toast({
        title: "Artículo eliminado",
        description: `El artículo "${targetPost.title}" fue removido de tu navegador.`,
      });
      return;
    }

    try {
      const { error } = await supabase.from("cms_posts").delete().eq("id", postId);
      if (error) throw error;
      toast({
        title: "Artículo eliminado",
        description: `El artículo "${targetPost.title}" fue removido de la base de datos.`,
      });
    } catch (e) {
      console.warn("Removed locally only:", e);
      toast({
        title: "Eliminado del navegador",
        description: "Se eliminó de tu dispositivo. Aplica la migración SQL para sincronizar con la nube.",
      });
    }
  };

  // --- GENERATE AI ARTICLE ---
  /**
   * handleGenerateAiArticle
   * Uses the seo-content-writer skill (CORE-EEAT framework) via the blog-writer
   * Supabase Edge Function. Falls back to static templates if the edge function
   * is unavailable (e.g. GEMINI_API_KEY not yet configured).
   *
   * Skill source: https://github.com/aaron-he-zhu/seo-geo-claude-skills
   */
  const handleGenerateAiArticle = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    // Map UI tone selector to API-compatible values
    const toneMap: Record<string, "professional" | "casual" | "friendly" | "inspirational"> = {
      empatico: "friendly",
      cientifico: "professional",
      inspirador: "inspirational",
      sencillo: "casual"
    };

    try {
      // ── 1. Try the AI Edge Function (CORE-EEAT skill) ─────────────────────
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      const res = await fetch(`${supabaseUrl}/functions/v1/blog-writer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`
        },
        body: JSON.stringify({
          topic: aiPrompt.trim(),
          primaryKeyword: aiPrompt.trim(),
          targetAudience: "personas interesadas en bienestar, yoga, mindfulness y salud mental",
          tone: toneMap[aiTone] || "friendly",
          wordCount: 1200,
          businessContext: "SantoSha es un centro de bienestar que ofrece clases de Kundalini Yoga y herramientas de salud mental"
        })
      });

      if (res.ok) {
        const data = await res.json();
        const blog = data.blogPost;

        if (blog && blog.title) {
          setEditingPost({
            ...editingPost!,
            title: blog.title,
            slug: blog.slug || blog.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
            excerpt: blog.excerpt || blog.metaDescription || "",
            content: blog.content || "",
            publishedAt: new Date().toISOString()
          });

          setAiPrompt("");
          toast({
            title: "🎯 Artículo SEO generado con CORE-EEAT",
            description: `Skill: seo-content-writer v9.9.9 · Score estimado: ${blog.seoScore ?? "~85"}/100 · ${blog.readingTime ?? 5} min de lectura`,
          });
          return;
        }
      }

      // ── 2. Fallback — static templates (no API key configured) ────────────
      const prompt = aiPrompt.trim();
      const capitalizedPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
      let title = "";
      let excerpt = "";
      let content = "";

      if (aiTone === "empatico") {
        title = `${capitalizedPrompt}: Un Camino de Compasión y Autocuidado`;
        excerpt = `Aprende a validar tus emociones y a transitar momentos difíciles con compasión, cuidado y un espacio seguro para tu mente.`;
        content = `## Introducción\n\nEn la búsqueda constante de bienestar, a menudo nos enfrentamos a desafíos emocionales que nos abruman relacionados con **${prompt}**. La compasión es la primera y más importante respuesta.\n\n## Validar tus Emociones\n\nReconoce la emoción tal como es. Date permiso para sentir.\n\n## Ejercicio Práctico\n\n1. Coloca una mano sobre tu pecho.\n2. Respira profundo y exhala suavemente.\n3. Repítete: *\"Que pueda tener paciencia conmigo.\"*\n\n## Conclusión\n\nEl camino hacia la calma no se trata de no sentir dolor, sino de tratarte con amor en medio de la tormenta.`;
      } else if (aiTone === "cientifico") {
        title = `La Neurobiología de ${capitalizedPrompt}: Comprendiendo tu Sistema Nervioso`;
        excerpt = `Una perspectiva científica y accesible sobre cómo el estrés y las emociones afectan tus circuitos cerebrales.`;
        content = `## Introducción\n\nCuando nos enfrentamos a **${prompt}**, la amígdala cerebral desencadena la liberación de cortisol y adrenalina.\n\n## La Respuesta al Estrés\n\nEl sistema nervioso simpático eleva la frecuencia cardíaca y desvía la energía hacia los músculos.\n\n## Técnicas de Regulación\n\n1. El Suspiro Fisiológico: dos inhalaciones rápidas + exhalación larga.\n2. Estimulación del Nervio Vago: exhala el doble del tiempo de inhalación.\n\n## Conclusión\n\nComprender la ciencia de nuestras emociones nos da poder para transformar nuestra biología.`;
      } else if (aiTone === "inspirador") {
        title = `${capitalizedPrompt}: Despertando tu Energía Vital`;
        excerpt = `Descubre cómo la sabiduría del Kundalini Yoga puede desbloquear tu Prana.`;
        content = `## Introducción\n\nEn la tradición del Kundalini Yoga, cuando nos sentimos bloqueados por **${prompt}**, es una interrupción del flujo de Prana.\n\n## Prana y Apana\n\nEl equilibrio de estas dos fuerzas sostiene la salud integral.\n\n## Práctica\n\nRealiza la respiración alternada por fosas nasales durante 3-5 minutos.\n\n## Conclusión\n\nPermítete sintonizar con tu propia luz. *Sat Nam*.`;
      } else {
        title = `5 Pasos Claros para Manejar ${capitalizedPrompt} Hoy`;
        excerpt = `Una guía práctica con acciones concretas que puedes implementar de inmediato.`;
        content = `## Introducción\n\nCuando el estrés por **${prompt}** nos abruma, necesitamos herramientas sencillas y efectivas.\n\n## 1. El Momento Presente\nPregúntate: *¿Qué problema real tengo en este segundo?*\n\n## 2. Reduce Estímulos\nPon el teléfono en "No molestar" 30 minutos.\n\n## 3. Respiración en Caja\nInhala 4s → sostén 4s → exhala 4s → vacío 4s. Repite 5 veces.\n\n## 4. Mueve el Cuerpo\n3 minutos de caminata cambia tu bioquímica.\n\n## 5. Una Acción Pequeña\nElige una sola tarea de 5 minutos y hazla ahora.\n\n## Conclusión\nPequeños hábitos diarios crean grandes transformaciones.`;
      }

      setEditingPost({
        ...editingPost!,
        title,
        slug: title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
        excerpt,
        content,
        publishedAt: new Date().toISOString()
      });

      setAiPrompt("");
      toast({
        title: "Artículo creado (modo offline)",
        description: "Para usar el skill SEO CORE-EEAT con IA real, configura GEMINI_API_KEY en Supabase Secrets.",
      });
    } catch (err) {
      console.error("Error generating AI article:", err);
      toast({
        title: "Error al generar",
        description: "Ocurrió un inconveniente al redactar el artículo. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // --- EXPORT TO CSV ---
  // --- EXPORT TO CSV ---
  const handleExportCsv = () => {
    const filteredSubs = submissions.filter(sub => {
      const matchesForm = selectedFormFilter === "all" || sub.formId === selectedFormFilter;
      const dataString = JSON.stringify(sub.data).toLowerCase();
      const matchesSearch = dataString.includes(searchTerm.toLowerCase()) || sub.pageSlug.includes(searchTerm.toLowerCase());
      return matchesForm && matchesSearch;
    });

    if (filteredSubs.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay registros filtrados para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Dynamic headers based on form or accumulated headers
    let headers: string[] = ["Fecha de Registro", "Página de Origen"];
    const allCustomKeys = new Set<string>();

    filteredSubs.forEach(s => {
      Object.keys(s.data).forEach(k => allCustomKeys.add(k));
    });

    const customHeaders = Array.from(allCustomKeys);
    headers = [...headers, ...customHeaders];

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel readability
    csvContent += headers.join(",") + "\r\n";

    filteredSubs.forEach(sub => {
      const row = [
        new Date(sub.createdAt).toLocaleString("es-ES"),
        sub.pageSlug,
        ...customHeaders.map(h => {
          const val = sub.data[h];
          if (val === undefined || val === null) return "";
          // Escape comma and quotes
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Leads_SantoSha_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "¡Exportación exitosa!",
      description: `Se han descargado ${filteredSubs.length} registros en formato CSV.`,
    });
  };

  // Helper translations for section types (mental health focused)
  const SECTION_TYPES_INFO: Record<string, { name: string; desc: string }> = {
    hero:           { name: "Cabecera y Bienvenida (Hero)",          desc: "Bloque inicial con título inspirador y botón de llamada a la acción." },
    connection:     { name: "Espacio de Conexión (Texto + Imagen)",  desc: "Ideal para presentarte como terapeuta o explicar tu método de trabajo." },
    benefits:       { name: "Beneficios / Items con Iconos",         desc: "Listado con emojis para destacar beneficios, estadísticas o garantías." },
    form:           { name: "Formulario de Contacto / Registro",     desc: "Bloque para capturar datos de pacientes interesados." },
    testimonials:   { name: "Testimonios y Experiencias",            desc: "Bloque elegante de testimonios o citas de pacientes / estudiantes." },
    faq:            { name: "Preguntas Frecuentes (FAQs)",           desc: "Listado expandible para responder dudas (tarifas, duración, etc.)." },
    transformation: { name: "Antes y Después (Transformación)",      desc: "Comparativa visual de situaciones problemáticas vs. resultados positivos." },
    cta:            { name: "Llamada a la Acción Final (CTA)",       desc: "Sección de cierre emocional con botón destacado y texto de garantía." },
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2C3E2B]">
        <div className="w-10 h-10 border-t-2 border-r-2 border-[#7EA172] rounded-full animate-spin mb-4" />
        <p className="font-serif italic">Cargando panel de administrador...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#2C3E2B] flex flex-col font-sans">
      
      {/* Header Panel */}
      <header className="bg-white border-b border-[#EBE7DF] sticky top-0 z-30 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight">Panel Administrador</h1>
              <p className="text-xs text-[#5C6E5B] flex items-center gap-1 font-light">
                Espacio de gestión de contenidos de <span className="font-semibold">{settings.brandName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" target="_blank">
              <Button variant="outline" className="border-[#EBE7DF] hover:bg-[#F8F7F4] text-xs gap-1.5 rounded-full">
                <Eye className="w-3.5 h-3.5" /> Ver Web Principal
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="text-[#C98A72] hover:text-[#B57A63] hover:bg-[#FAF8FC] text-xs gap-1.5 rounded-full"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir del Panel
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        {!editingPage && !editingForm && !editingPost && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
            <div className="flex justify-center sm:justify-start">
              <TabsList className="bg-[#EBE7DF]/50 p-1 rounded-full flex gap-1">
                <TabsTrigger 
                  value="pages" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 inline-block" /> Páginas Creadas
                </TabsTrigger>
                <TabsTrigger 
                  value="blog" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 inline-block" /> Artículos de Blog
                </TabsTrigger>
                <TabsTrigger 
                  value="forms" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5 inline-block" /> Diseñar Formularios
                </TabsTrigger>
                <TabsTrigger 
                  value="agent" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <Bot className="w-3.5 h-3.5 mr-1.5 inline-block" /> Agente IA
                </TabsTrigger>
                <TabsTrigger 
                  value="submissions" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <Database className="w-3.5 h-3.5 mr-1.5 inline-block" /> Datos / Pacientes
                </TabsTrigger>
                <TabsTrigger 
                  value="visual" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <Settings className="w-3.5 h-3.5 mr-1.5 inline-block" /> Estilo Visual
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TABS CONTENT: 1. PAGES LIST */}
            <TabsContent value="pages" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl font-semibold">Tus Páginas Web</h2>
                  <p className="text-xs text-[#5C6E5B] font-light">Crea nuevos apartados para promocionar talleres, retiros o terapias.</p>
                </div>
                <Button 
                  onClick={() => setEditingPage({
                    id: `page-${Date.now()}`,
                    title: "Nueva Página de Terapia",
                    slug: "nueva-pagina",
                    published: true,
                    sections: [
                      {
                        id: `hero-${Date.now()}`,
                        type: "hero",
                        content: { title: "Bienvenido a mi espacio", subtitle: "Espacio terapéutico profesional.", tagline: "Psicología Integrativa" }
                      }
                    ]
                  })}
                  className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" /> Crear Nueva Página
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <Card key={p.id} className="bg-white border-[#EBE7DF] rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1.5 items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${p.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                            {p.published ? "PUBLICADA" : "BORRADOR"}
                          </span>
                          {p.slug === "home" && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 shadow-xs animate-pulse">
                              ⭐ Inicio Principal
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {p.slug === "home" ? "(Portada Principal)" : `/${p.slug}`}
                        </span>
                      </div>
                      <CardTitle className="font-serif text-lg font-semibold pt-2">{p.title}</CardTitle>
                      <CardDescription className="text-xs text-[#5C6E5B] font-light">
                        {p.sections.length} bloques de diseño incorporados.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 border-t border-[#F8F7F4] flex justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingPage(p)} 
                          className="hover:bg-[#FAF8FC] text-xs font-semibold px-3 rounded-full"
                        >
                          ✏️ Editar Diseño
                        </Button>
                        <Link to={p.slug === "home" ? "/" : `/${p.slug}`} target="_blank">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-[#FAF8FC] text-xs font-semibold text-[#7EA172] px-3 rounded-full"
                          >
                            👁️ Ver Web
                          </Button>
                        </Link>
                        {p.slug !== "home" && p.published && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetAsHomepage(p)}
                            className="hover:bg-amber-50 hover:text-amber-700 text-xs font-semibold text-amber-600 px-3 rounded-full flex items-center gap-1"
                          >
                            🏠 Hacer Portada
                          </Button>
                        )}
                      </div>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePage(p.id)} 
                        className="text-[#C98A72] hover:text-[#B57A63] hover:bg-rose-50 px-2 rounded-full"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TABS CONTENT: BLOG POSTS LIST */}
            <TabsContent value="blog" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl font-semibold">Artículos de tu Blog</h2>
                  <p className="text-xs text-[#5C6E5B] font-light">Escribe lecturas y consejos sobre psicología y bienestar para tus pacientes.</p>
                </div>
                <Button 
                  onClick={() => setEditingPost({
                    id: `post-${Date.now()}`,
                    title: "Nueva Lectura Terapéutica",
                    slug: "nueva-lectura",
                    content: "# Nueva Lectura\n\nComienza a escribir tu artículo aquí...",
                    excerpt: "Un breve resumen del tema del artículo.",
                    published: true,
                    publishedAt: new Date().toISOString()
                  })}
                  className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" /> Redactar Nuevo Artículo
                </Button>
              </div>

              {/* Grid of blog posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => {
                  const isFuture = new Date(post.publishedAt) > new Date();
                  return (
                    <Card key={post.id} className="bg-white border-[#EBE7DF] rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-1.5 items-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${
                              !post.published 
                                ? "bg-gray-100 text-gray-500 border border-gray-200" 
                                : isFuture 
                                  ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                              {!post.published ? "BORRADOR" : isFuture ? "🕒 PROGRAMADO" : "🟢 PUBLICADO"}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">/blog/{post.slug}</span>
                        </div>
                        
                        {post.imageUrl && (
                          <div className="aspect-[16/9] w-full bg-muted rounded-2xl overflow-hidden mt-3 mb-2">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                        )}

                        <CardTitle className="font-serif text-base font-semibold pt-2 line-clamp-1">{post.title}</CardTitle>
                        <CardDescription className="text-xs text-[#5C6E5B] font-light line-clamp-2 leading-relaxed">
                          {post.excerpt || "Sin resumen."}
                        </CardDescription>
                        
                        {/* Display release date if future */}
                        {post.published && isFuture && (
                          <div className="text-[10px] text-amber-700 bg-amber-50/50 p-2 rounded-xl mt-2 border border-amber-100 leading-normal">
                            🕒 Se publicará automáticamente el: <span className="font-semibold">{new Date(post.publishedAt).toLocaleString("es-ES")}</span>
                          </div>
                        )}
                      </CardHeader>
                      
                      <CardFooter className="pt-2 border-t border-[#F8F7F4] flex justify-between gap-2">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingPost(post)} 
                            className="hover:bg-[#FAF8FC] text-xs font-semibold px-3 rounded-full"
                          >
                            ✏️ Editar
                          </Button>
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-[#FAF8FC] text-xs font-semibold text-[#7EA172] px-3 rounded-full"
                            >
                              👁️ Ver
                            </Button>
                          </Link>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)} 
                          className="text-[#C98A72] hover:text-[#B57A63] hover:bg-rose-50 px-2 rounded-full"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* TABS CONTENT: 2. FORMS LIST */}
            <TabsContent value="forms" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-xl font-semibold">Formularios de Contacto</h2>
                  <p className="text-xs text-[#5C6E5B] font-light">Diseña las preguntas que les harás a las personas antes de su primera consulta.</p>
                </div>
                <Button 
                  onClick={() => setEditingForm({
                    id: `form-${Date.now()}`,
                    name: "Nuevo Formulario de Consulta",
                    fields: [
                      { id: "name", label: "Nombre Completo", type: "text", placeholder: "Tu nombre", required: true }
                    ],
                    redirectUrl: ""
                  })}
                  className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" /> Diseñar Nuevo Formulario
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((f) => (
                  <Card key={f.id} className="bg-white border-[#EBE7DF] rounded-3xl shadow-sm flex flex-col justify-between">
                    <CardHeader>
                      <CardTitle className="font-serif text-lg font-semibold">{f.name}</CardTitle>
                      <CardDescription className="text-xs text-[#5C6E5B] font-light">
                        {f.fields.length} campos de información solicitados.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {f.fields.map(field => (
                          <span key={field.id} className="bg-[#FAF8FC] border border-[#EBE7DF] text-[10px] px-2 py-0.5 rounded-full text-[#5C6E5B] font-light">
                            {field.label} {field.required ? "*" : ""}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t border-[#F8F7F4] flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingForm(f)} 
                        className="hover:bg-[#FAF8FC] text-xs font-semibold rounded-full"
                      >
                        ✏️ Editar Preguntas
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={async () => {
                          if (window.confirm(`¿Seguro que deseas eliminar el formulario "${f.name}"? Se borrarán también las secciones de páginas que lo utilicen.`)) {
                            const filtered = forms.filter(item => item.id !== f.id);
                            setForms(filtered);
                            saveLocalForms(filtered);

                            try {
                              const { error } = await supabase
                                .from("cms_forms")
                                .delete()
                                .eq("id", f.id);

                              if (error) throw error;

                              toast({
                                title: "Formulario eliminado",
                                description: `El formulario "${f.name}" fue removido con éxito de la base de datos.`,
                              });
                            } catch (dbErr) {
                              console.warn("Failed to delete form from Supabase, deleted locally:", dbErr);
                              toast({
                                title: "Eliminado localmente",
                                description: "El formulario se eliminó del navegador. Revisa tu conexión con la base de datos.",
                              });
                            }
                          }
                        }} 
                        className="text-[#C98A72] hover:bg-rose-50 rounded-full px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TABS CONTENT: AGENTE IA */}
            <TabsContent value="agent" className="space-y-6">
              {agentConfig && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
                        <Bot className="w-5 h-5 text-[#7EA172]" /> Asistente IA para tu Web
                      </h2>
                      <p className="text-xs text-[#5C6E5B] font-light">
                        Configura el comportamiento del chatbot que ven los visitantes de tu página.
                      </p>
                    </div>
                    <Button
                      onClick={handleSaveAgent}
                      disabled={agentSaving}
                      className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {agentSaving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>

                  {/* ON/OFF Toggle */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Activar Asistente IA</h3>
                        <p className="text-xs text-muted-foreground font-light">
                          Cuando está activo, el botón de chat aparece en todas tus páginas publicadas.
                        </p>
                      </div>
                      <Switch
                        checked={agentConfig.enabled}
                        onCheckedChange={(val) => setAgentConfig({ ...agentConfig, enabled: val })}
                      />
                    </div>
                  </Card>

                  {/* Identidad del Bot */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#7EA172]" /> Identidad del Asistente
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Nombre del Bot</label>
                        <Input
                          value={agentConfig.botName}
                          onChange={(e) => setAgentConfig({ ...agentConfig, botName: e.target.value })}
                          placeholder="SantoBot"
                          className="h-10 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold">Emoji de Avatar</label>
                        <Input
                          value={agentConfig.avatarEmoji}
                          onChange={(e) => setAgentConfig({ ...agentConfig, avatarEmoji: e.target.value })}
                          placeholder="🌿"
                          className="h-10 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Mensaje de Bienvenida</label>
                      <Input
                        value={agentConfig.welcomeMessage}
                        onChange={(e) => setAgentConfig({ ...agentConfig, welcomeMessage: e.target.value })}
                        placeholder="Hola 🌿 ¿En qué puedo ayudarte hoy?"
                        className="h-10 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold">Mensaje para capturar contacto</label>
                      <Input
                        value={agentConfig.captureLeadPrompt}
                        onChange={(e) => setAgentConfig({ ...agentConfig, captureLeadPrompt: e.target.value })}
                        placeholder="¿Me puedes dejar tu nombre y WhatsApp?"
                        className="h-10 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                      />
                      <p className="text-[10px] text-muted-foreground">El bot lo usará cuando el visitante muestre interés en los servicios.</p>
                    </div>
                  </Card>

                  {/* System Prompt / Instrucciones */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#7EA172]" /> Instrucciones del Agente (System Prompt)
                      </h3>
                      <p className="text-xs text-muted-foreground font-light">
                        Define la personalidad, el tono y el conocimiento de tu asistente. Sé específico sobre tus servicios, horarios y valores.
                      </p>
                    </div>
                    <Textarea
                      value={agentConfig.systemPrompt}
                      onChange={(e) => setAgentConfig({ ...agentConfig, systemPrompt: e.target.value })}
                      rows={8}
                      placeholder="Eres un asistente virtual de SantoSha..."
                      className="border-[#EBE7DF] rounded-xl focus:border-[#7EA172] text-sm resize-none"
                    />
                    <div className="bg-[#F8F7F4] rounded-2xl p-3 border border-[#EBE7DF] text-[11px] text-[#5C6E5B]">
                      💡 <strong>Tip:</strong> Incluye: nombre del negocio, qué ofreces, a quién va dirigido, horarios disponibles, precios (si aplica), y cómo quieres que el bot invite a dejar datos de contacto.
                    </div>
                  </Card>

                  {/* FAQs */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-[#7EA172]" /> Preguntas y Respuestas Frecuentes
                        </h3>
                        <p className="text-xs text-muted-foreground font-light">
                          Si no hay API Key configurada, el bot responderá estas preguntas exactas cuando las detecte.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAgentConfig({
                          ...agentConfig,
                          faqs: [...agentConfig.faqs, { question: "", answer: "" }]
                        })}
                        className="rounded-full border-[#7EA172] text-[#7EA172] hover:bg-[#7EA172]/10 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Añadir Pregunta
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {agentConfig.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#EBE7DF] space-y-2">
                          <div className="flex gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={faq.question}
                                onChange={(e) => {
                                  const updated = [...agentConfig.faqs];
                                  updated[idx] = { ...updated[idx], question: e.target.value };
                                  setAgentConfig({ ...agentConfig, faqs: updated });
                                }}
                                placeholder="¿Cuánto cuesta la sesión?"
                                className="h-9 text-xs border-[#EBE7DF] bg-white rounded-xl focus:border-[#7EA172]"
                              />
                              <Textarea
                                value={faq.answer}
                                onChange={(e) => {
                                  const updated = [...agentConfig.faqs];
                                  updated[idx] = { ...updated[idx], answer: e.target.value };
                                  setAgentConfig({ ...agentConfig, faqs: updated });
                                }}
                                placeholder="La primera sesión es gratuita..."
                                rows={2}
                                className="text-xs border-[#EBE7DF] bg-white rounded-xl focus:border-[#7EA172] resize-none"
                              />
                            </div>
                            <button
                              onClick={() => setAgentConfig({ ...agentConfig, faqs: agentConfig.faqs.filter((_, i) => i !== idx) })}
                              className="p-2 text-[#C98A72] hover:text-[#B57A63] hover:bg-rose-50 rounded-xl transition-colors self-start"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* API Key — configuración server-side */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#7EA172]" /> Activar IA en tiempo real
                      </h3>
                      <p className="text-xs text-muted-foreground font-light">
                        La API key se configura de forma segura en el servidor de Supabase — nunca queda expuesta en el navegador.
                      </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      {[
                        {
                          n: "1",
                          title: "Obtén tu API Key gratis",
                          desc: <>Ve a <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline text-[#7EA172] font-medium">aistudio.google.com/apikey</a> y crea una clave para el proyecto de este sitio.</>
                        },
                        {
                          n: "2",
                          title: "Ábrela en Supabase Secrets",
                          desc: <>Ve a <a href={`https://supabase.com/dashboard/project/nuxkhblqwnfinzqdriyn/settings/functions`} target="_blank" rel="noopener noreferrer" className="underline text-[#7EA172] font-medium">Supabase → Settings → Edge Functions → Secrets</a></>
                        },
                        {
                          n: "3",
                          title: 'Agrega el secreto "GEMINI_API_KEY"',
                          desc: <>En el campo <code className="font-mono bg-[#F0EDE8] px-1 rounded text-[10px]">Name</code> escribe <code className="font-mono bg-[#F0EDE8] px-1 rounded text-[10px]">GEMINI_API_KEY</code> y en <code className="font-mono bg-[#F0EDE8] px-1 rounded text-[10px]">Secret</code> pega tu API key. Haz clic en <strong>Save</strong>.</>
                        },
                        {
                          n: "4",
                          title: "¡Listo! El chatbot usará IA en vivo",
                          desc: "La Edge Function ai-chat leerá el secreto automáticamente. Sin reinicios necesarios."
                        }
                      ].map(step => (
                        <div key={step.n} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#7EA172] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {step.n}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#2C3E2B]">{step.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-[11px] text-emerald-800 flex items-start gap-2">
                      <span className="text-base leading-none">🔒</span>
                      <span>
                        Sin la API Key, el bot responde con las FAQs que hayas configurado arriba. Con la clave activa, usa <strong>gemini-2.0-flash-lite</strong> (1,500 consultas/día gratis).
                      </span>
                    </div>

                    {/* Test connection button */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="outline"
                        onClick={handleTestAgent}
                        className="rounded-xl border-[#7EA172] text-[#7EA172] hover:bg-[#7EA172]/10 text-xs"
                      >
                        🔌 Probar Conexión
                      </Button>
                      {agentTestResult && (
                        <span className={`text-xs font-medium ${agentTestResult.startsWith("✅") ? "text-emerald-700" : agentTestResult.startsWith("⚠️") ? "text-amber-700" : agentTestResult.startsWith("🔄") ? "text-blue-600" : "text-rose-700"}`}>
                          {agentTestResult}
                        </span>
                      )}
                    </div>
                  </Card>

                  {/* Preview */}
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#7EA172]" /> Vista Previa del Botón
                    </h3>
                    <div className="relative h-32 bg-[#F8F7F4] rounded-2xl border border-[#EBE7DF] overflow-hidden">
                      <div
                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
                        style={{ background: "linear-gradient(135deg, #2C3E2B 0%, #4a6741 100%)" }}
                      >
                        {agentConfig.avatarEmoji}
                      </div>
                      <div className="absolute bottom-16 right-4 bg-white shadow rounded-2xl px-3 py-1.5 text-xs text-[#2C3E2B] font-medium border border-[#EBE7DF] whitespace-nowrap">
                        💬 {agentConfig.welcomeMessage.slice(0, 40)}...
                      </div>
                    </div>
                  </Card>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveAgent}
                      disabled={agentSaving}
                      className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full px-8 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {agentSaving ? "Guardando..." : "Guardar Configuración del Agente"}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TABS CONTENT: SUBMISSIONS / DATOS PACIENTES — 3 fuentes unificadas */}
            <TabsContent value="submissions" className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold">Datos y Pacientes</h2>
                  <p className="text-xs text-[#5C6E5B] font-light">
                    Todas las fuentes de contacto unificadas: formularios, registros directos y conversaciones del chatbot.
                  </p>
                </div>
                <div className="flex gap-2">
                  {dataSubTab === "forms" && (
                    <Button onClick={handleExportCsv} className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-medium gap-1.5 shadow-sm">
                      <Download className="w-3.5 h-3.5" /> Exportar CSV
                    </Button>
                  )}
                  {dataSubTab === "registrations" && (
                    <Button onClick={() => {
                      const csv = "\uFEFFNombre,Email,Fecha\r\n" + registrations.map(r => `"${r.name}","${r.email}","${new Date(r.created_at).toLocaleString("es-ES")}"`).join("\r\n");
                      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8;"})); a.download = `Registros_${new Date().toISOString().split("T")[0]}.csv`; a.click();
                    }} className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-medium gap-1.5 shadow-sm">
                      <Download className="w-3.5 h-3.5" /> Exportar CSV
                    </Button>
                  )}
                  {dataSubTab === "chatbot" && (
                    <Button onClick={() => {
                      const csv = "\uFEFFNombre,Contacto,Página,Fecha\r\n" + chatLeads.map(l => `"${l.name||""}","${l.contact||""}","${l.page_slug||""}","${new Date(l.created_at).toLocaleString("es-ES")}"`).join("\r\n");
                      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8;"})); a.download = `LeadsChat_${new Date().toISOString().split("T")[0]}.csv`; a.click();
                    }} className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-medium gap-1.5 shadow-sm">
                      <Download className="w-3.5 h-3.5" /> Exportar CSV
                    </Button>
                  )}
                </div>
              </div>

              {/* Sub-tabs: 3 fuentes */}
              <div className="flex gap-2 flex-wrap">
                {(["forms", "registrations", "chatbot"] as const).map((tab) => {
                  const labels = { forms: "📋 Formularios CMS", registrations: "📩 Registros (Lovable)", chatbot: "🤖 Chat IA" };
                  const counts = { forms: submissions.length, registrations: registrations.length, chatbot: chatLeads.length };
                  return (
                    <button
                      key={tab}
                      onClick={() => setDataSubTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all border ${dataSubTab === tab ? "bg-[#7EA172] text-white border-[#7EA172]" : "bg-white text-[#5C6E5B] border-[#EBE7DF] hover:border-[#7EA172]/50"}`}
                    >
                      {labels[tab]}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dataSubTab === tab ? "bg-white/20" : "bg-[#EBE7DF]"}`}>{counts[tab]}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── FORMULARIOS CMS ── */}
              {dataSubTab === "forms" && (
                <div className="space-y-4">
                  <Card className="bg-white border-[#EBE7DF] rounded-3xl p-4 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Buscar por nombre, correo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-10 border-[#EBE7DF] focus:border-[#7EA172] text-sm bg-[#FAF9F6] rounded-xl" />
                      </div>
                      <select value={selectedFormFilter} onChange={(e) => setSelectedFormFilter(e.target.value)} className="w-full h-10 border border-[#EBE7DF] bg-[#FAF9F6] px-3 py-2 text-sm rounded-xl focus:border-[#7EA172] outline-none">
                        <option value="all">Todos los Formularios</option>
                        {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                      <div className="flex justify-end items-center text-xs text-[#5C6E5B] font-light">Total: {submissions.length} registros</div>
                    </div>
                  </Card>
                  <div className="bg-white border border-[#EBE7DF] rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-[#F8F7F4] text-[#5C6E5B] border-b border-[#EBE7DF] font-serif font-semibold text-xs">
                            <th className="p-4">Fecha y Hora</th><th className="p-4">Procedencia</th><th className="p-4">Formulario</th><th className="p-4">Datos del Paciente</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F8F7F4]">
                          {submissions.filter(sub => {
                            const matchesForm = selectedFormFilter === "all" || sub.formId === selectedFormFilter;
                            const dataString = JSON.stringify(sub.data).toLowerCase();
                            const matchesSearch = dataString.includes(searchTerm.toLowerCase()) || sub.pageSlug.includes(searchTerm.toLowerCase());
                            return matchesForm && matchesSearch;
                          }).map((sub) => {
                            const matchingForm = forms.find(f => f.id === sub.formId);
                            return (
                              <tr key={sub.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                                <td className="p-4 font-mono text-xs whitespace-nowrap text-muted-foreground">{new Date(sub.createdAt).toLocaleString("es-ES")}</td>
                                <td className="p-4 whitespace-nowrap"><span className="bg-[#FAF8FC] text-[#5C6E5B] border border-[#EBE7DF] px-2 py-0.5 rounded-full text-xs font-light">/{sub.pageSlug}</span></td>
                                <td className="p-4 whitespace-nowrap font-medium text-xs">{matchingForm?.name || "Registro General"}</td>
                                <td className="p-4"><div className="space-y-1.5 text-xs text-foreground/90 max-w-lg">
                                  {Object.entries(sub.data).map(([key, value]) => {
                                    const fieldDef = matchingForm?.fields.find(f => f.id === key);
                                    return <div key={key} className="flex flex-col sm:flex-row sm:gap-2"><span className="font-semibold text-muted-foreground min-w-[120px]">{fieldDef ? fieldDef.label : key}:</span><span className="whitespace-pre-line leading-relaxed">{String(value)}</span></div>;
                                  })}
                                </div></td>
                              </tr>
                            );
                          })}
                          {submissions.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground text-sm">Aún no hay registros de formularios.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── REGISTROS LOVABLE ── */}
              {dataSubTab === "registrations" && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-800 flex items-center gap-2">
                    <span>📩</span>
                    <span>Estos registros provienen directamente de la tabla <code className="font-mono bg-amber-100 px-1 rounded">registrations</code> de tu base de datos Supabase original.</span>
                  </div>
                  <div className="bg-white border border-[#EBE7DF] rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-[#F8F7F4] text-[#5C6E5B] border-b border-[#EBE7DF] font-serif font-semibold text-xs">
                            <th className="p-4">Fecha y Hora</th><th className="p-4">Nombre</th><th className="p-4">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F8F7F4]">
                          {registrations.filter(r => {
                            if (!searchTerm) return true;
                            const q = searchTerm.toLowerCase();
                            return r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
                          }).map((reg) => (
                            <tr key={reg.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                              <td className="p-4 font-mono text-xs whitespace-nowrap text-muted-foreground">{new Date(reg.created_at).toLocaleString("es-ES")}</td>
                              <td className="p-4 font-medium text-sm">{reg.name}</td>
                              <td className="p-4 text-sm text-[#5C6E5B]">{reg.email}</td>
                            </tr>
                          ))}
                          {registrations.length === 0 && (
                            <tr><td colSpan={3} className="p-8 text-center text-muted-foreground text-sm">
                              No hay registros aún, o la tabla aún no está conectada.
                            </td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {registrations.length > 0 && (
                    <div className="flex justify-end text-xs text-muted-foreground">
                      {registrations.length} registro(s) encontrado(s).
                    </div>
                  )}
                </div>
              )}

              {/* ── LEADS DEL CHAT IA ── */}
              {dataSubTab === "chatbot" && (
                <div className="space-y-4">
                  {chatLeads.length === 0 ? (
                    <div className="bg-white border border-[#EBE7DF] rounded-3xl p-12 text-center shadow-sm space-y-3">
                      <div className="text-4xl">🤖</div>
                      <p className="font-serif text-lg font-semibold">Aún no hay leads del chatbot</p>
                      <p className="text-xs text-muted-foreground">
                        Cuando un visitante comparta su nombre o contacto durante una conversación con el asistente IA, aparecerá aquí.
                      </p>
                      {chatLeads.length === 0 && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mt-2 text-left">
                          ⚠️ <strong>Recuerda crear la tabla en Supabase:</strong> Ejecuta el archivo <code className="font-mono bg-amber-100 px-1 rounded">CHAT_LEADS_MIGRATION.sql</code> en el SQL Editor de tu Supabase Studio para activar el guardado.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EBE7DF] rounded-3xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-[#F8F7F4] text-[#5C6E5B] border-b border-[#EBE7DF] font-serif font-semibold text-xs">
                              <th className="p-4">Fecha</th><th className="p-4">Nombre</th><th className="p-4">Contacto</th><th className="p-4">Página</th><th className="p-4">Conversación</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F8F7F4]">
                            {chatLeads.filter(l => {
                              if (!searchTerm) return true;
                              const q = searchTerm.toLowerCase();
                              return l.name?.toLowerCase().includes(q) || l.contact?.toLowerCase().includes(q);
                            }).map((lead) => (
                              <>
                                <tr key={lead.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                                  <td className="p-4 font-mono text-xs whitespace-nowrap text-muted-foreground">{new Date(lead.created_at).toLocaleString("es-ES")}</td>
                                  <td className="p-4 font-medium text-sm">{lead.name || <span className="text-muted-foreground/60 italic">Sin nombre</span>}</td>
                                  <td className="p-4 text-sm">{lead.contact || <span className="text-muted-foreground/60 italic">Sin contacto</span>}</td>
                                  <td className="p-4"><span className="bg-[#FAF8FC] text-[#5C6E5B] border border-[#EBE7DF] px-2 py-0.5 rounded-full text-xs font-light">/{lead.page_slug}</span></td>
                                  <td className="p-4">
                                    <button
                                      onClick={() => setExpandedConversation(expandedConversation === lead.id ? null : lead.id)}
                                      className="text-xs text-[#7EA172] hover:underline flex items-center gap-1"
                                    >
                                      {expandedConversation === lead.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      {(lead.conversation || []).length} mensajes
                                    </button>
                                  </td>
                                </tr>
                                {expandedConversation === lead.id && (
                                  <tr key={`${lead.id}-conv`}>
                                    <td colSpan={5} className="px-4 pb-4 pt-0 bg-[#FAF9F6]/50">
                                      <div className="border border-[#EBE7DF] rounded-2xl p-4 space-y-2 max-h-64 overflow-y-auto">
                                        {(lead.conversation || []).map((msg: any, i: number) => (
                                          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[80%] text-xs rounded-2xl px-3 py-2 ${msg.role === "user" ? "bg-[#2C3E2B] text-white rounded-br-none" : "bg-white border border-[#EBE7DF] text-[#2C3E2B] rounded-bl-none"}`}>
                                              {msg.content}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Search for chatbot leads */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nombre o contacto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 h-10 border-[#EBE7DF] focus:border-[#7EA172] text-sm bg-white rounded-xl" />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TABS CONTENT: 4. VISUAL IDENTITY SETTINGS */}
            <TabsContent value="visual" className="max-w-2xl mx-auto space-y-6">
              <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#7EA172]" /> Estilo Visual y Branding
                  </h2>
                  <p className="text-xs text-[#5C6E5B] font-light">Adapta el aspecto emocional de tu página de manera sencilla.</p>
                </div>

                <div className="space-y-6">
                  {/* Brand and Logo fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Nombre de la Marca</label>
                      <Input 
                        value={settings.brandName}
                        onChange={(e) => setSettings({...settings, brandName: e.target.value})}
                        className="h-11 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Texto del Logotipo</label>
                      <Input 
                        value={settings.logoText}
                        onChange={(e) => setSettings({...settings, logoText: e.target.value})}
                        className="h-11 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                      />
                    </div>
                  </div>

                  {/* Therapeutic Palette Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold block">Paleta de Colores de Calma Emocional</label>
                    <p className="text-xs text-muted-foreground font-light mb-4">
                      Elige el tono que mejor conecte con el estado mental que buscas transmitir:
                    </p>
                    
                    <div className="grid gap-3">
                      {Object.entries(COLOR_PALETTES).map(([key, pal]) => {
                        const isSelected = settings.palette === key;
                        return (
                          <div 
                            key={key}
                            onClick={() => setSettings({...settings, palette: key as any})}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${isSelected ? "border-[#7EA172] bg-[#7EA172]/5" : "border-[#EBE7DF] hover:border-muted-foreground/40 bg-[#FAF9F6]"}`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Swatches */}
                              <div className="flex -space-x-1.5">
                                <span className={`w-5 h-5 rounded-full ${pal.primary.split(" ")[0]} border border-white`} />
                                <span className={`w-5 h-5 rounded-full ${pal.background} border border-white`} />
                                <span className={`w-5 h-5 rounded-full ${pal.secondary.split(" ")[0]} border border-white`} />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold">{pal.name}</h4>
                              </div>
                            </div>
                            {isSelected && <Check className="w-5 h-5 text-[#7EA172]" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography selector — Visual font picker */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Tipografía de la Web</label>
                    <p className="text-xs text-muted-foreground font-light">
                      Elige el par tipográfico que mejor represente tu estilo. El cambio se aplica en toda la web de forma instantánea.
                    </p>

                    {/* Group by category */}
                    {["Serif", "Sans-Serif", "Display"].map((category) => {
                      const pairsInCategory = (Object.entries(FONT_PAIRS) as [FontFamilyKey, typeof FONT_PAIRS[FontFamilyKey]][]).filter(
                        ([, p]) => p.category === category
                      );
                      if (pairsInCategory.length === 0) return null;
                      return (
                        <div key={category} className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-0.5">{category}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {pairsInCategory.map(([key, pair]) => {
                              const isSelected = settings.fontFamily === key;
                              return (
                                <button
                                  key={key}
                                  id={`font-option-${key}`}
                                  type="button"
                                  onClick={() => {
                                    setSettings({ ...settings, fontFamily: key as FontFamilyKey });
                                    applyFontPair(key as FontFamilyKey);
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 hover:border-[#7EA172]/60 hover:bg-[#F8FAF7] ${
                                    isSelected
                                      ? "border-[#7EA172] bg-[#F3F8F1] shadow-sm"
                                      : "border-[#EBE7DF] bg-white"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0 space-y-0.5">
                                    {/* Heading sample — rendered in actual font */}
                                    <p
                                      className="text-base font-semibold leading-tight text-[#2C3E2B] truncate"
                                      style={{ fontFamily: pair.headingFamily }}
                                    >
                                      Paz y Consciencia
                                    </p>
                                    {/* Body sample */}
                                    <p
                                      className="text-xs text-[#6B7B6A] leading-snug"
                                      style={{ fontFamily: pair.bodyFamily }}
                                    >
                                      El camino hacia la calma interior
                                    </p>
                                    {/* Name + description */}
                                    <p className="text-[10px] text-muted-foreground/60 font-medium pt-0.5">
                                      {pair.name} · {pair.description}
                                    </p>
                                  </div>
                                  {isSelected && <Check className="w-4 h-4 text-[#7EA172] shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* WhatsApp contact number */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Número de Teléfono / WhatsApp para Pacientes</label>
                    <Input 
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                      placeholder="+5491123456789"
                      className="h-11 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                    />
                    <p className="text-[10px] text-muted-foreground font-light">
                      * Incluye código de país y de área sin espacios ni guiones para que el enlace directo de WhatsApp funcione correctamente.
                    </p>
                  </div>

                  {/* Footer message */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Texto de Pie de Página (Footer)</label>
                    <Input 
                      value={settings.footerText}
                      onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                      className="h-11 border-[#EBE7DF] rounded-xl focus:border-[#7EA172]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EBE7DF] flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings(settings)}
                    className="bg-[#7EA172] hover:bg-[#6C8E61] text-white px-8 rounded-full font-medium"
                  >
                    Guardar Cambios Visuales
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* --- PAGE BUILDER VIEW (Izquierda editor, Derecha previsualizador interactivo) --- */}
        {editingPage && (
          <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch animate-fade-in flex-grow">
            
            {/* Editor Sidebar */}
            <Card className="w-full lg:w-[480px] bg-white border-[#EBE7DF] rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-shrink-0">
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-1">
                    ✏️ Creador de Bloques
                  </h2>
                  <p className="text-[10px] text-[#5C6E5B] font-light">Diseña y edita los apartados de tu página.</p>
                </div>

                {/* Page details */}
                <div className="space-y-3 bg-[#F8F7F4] p-4 rounded-2xl border border-[#EBE7DF]">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Título Interno de la Página</label>
                    <Input 
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      placeholder="Ej. Taller de Manejo del Estrés"
                      className="h-9 text-xs border-[#EBE7DF] focus:border-[#7EA172] bg-white rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Enlace corto de acceso (Slug)</label>
                    <div className={`flex items-center gap-1 border border-[#EBE7DF] rounded-xl px-2.5 h-9 ${editingPage.slug === "home" ? "bg-amber-50/40 border-amber-200" : "bg-white"}`}>
                      <span className="text-[10px] text-muted-foreground font-mono">/</span>
                      <input 
                        value={editingPage.slug}
                        onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="ej-talleres"
                        disabled={editingPage.slug === "home"}
                        className={`bg-transparent border-0 outline-none text-xs w-full font-mono ${editingPage.slug === "home" ? "text-amber-800 font-bold" : "text-foreground/90"}`}
                      />
                    </div>
                    {editingPage.slug === "home" && (
                      <p className="text-[9px] text-amber-700 font-medium leading-tight">
                        🏠 Esta es tu portada de inicio principal. No se puede modificar su enlace.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      🌐 ¿Publicada en Internet?
                    </label>
                    <Switch 
                      checked={editingPage.published}
                      disabled={editingPage.slug === "home"}
                      onCheckedChange={(val) => setEditingPage({ ...editingPage, published: val })}
                    />
                  </div>
                  {editingPage.slug === "home" && (
                    <p className="text-[9px] text-muted-foreground text-left leading-tight">
                      La página de portada debe estar siempre publicada para que la web funcione correctamente.
                    </p>
                  )}
                </div>

                {/* Block Editor List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold block">Bloques de la Página ({editingPage.sections.length})</label>
                    
                    {/* Add Section trigger */}
                    <select
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const type = e.target.value;
                        
                        // Create default section structures
                        let content = {};
                        if (type === "hero") {
                          content = { title: "Nuevo Título", subtitle: "Descripción del bloque", buttonText: "Contactar", tagline: "Novedad" };
                        } else if (type === "connection") {
                          content = { title: "¿Quiénes somos?", description: "Descripción de conexión...", layout: "image-right" };
                        } else if (type === "benefits") {
                          content = {
                            title: "Lo que aprenderás",
                            showCta: true,
                            ctaText: "Quiero estos beneficios",
                            ctaLink: "",
                            ctaSubtext: "Sin costo · Sin compromisos",
                            items: [{ icon: "🧘", title: "Paz interior", description: "Técnicas de respiración y meditación para calmar la mente." }]
                          };
                        } else if (type === "form") {
                          content = { title: "Reserva tu plaza", subtitle: "Formulario de contacto", formId: forms[0]?.id || "" };
                        } else if (type === "testimonials") {
                          content = {
                            title: "Experiencias",
                            ctaText: "Quiero vivir esta transformación",
                            ctaLink: "",
                            ctaSubtext: "Únete a miles de personas que ya dieron el paso",
                            testimonials: [{ quote: "Excelente espacio.", author: "Anónimo", role: "Practicante" }]
                          };
                        } else if (type === "faq") {
                          content = { title: "Preguntas Frecuentes", faqs: [{ question: "¿Qué duración tiene?", answer: "1 hora" }] };
                        } else if (type === "transformation") {
                          content = {
                            title: "¿Reconoces alguna de estas situaciones?",
                            beforeTitle: "Sin herramientas...",
                            afterTitle: "Con nuestra práctica",
                            before: ["Estrés y ansiedad constante", "Falta de concentración"],
                            after: ["Calma y claridad mental", "Enfoque y energía renovada"],
                            ctaText: "Quiero esta transformación",
                            ctaLink: "",
                            ctaSubtext: "Gratuito · Sin compromisos · Acceso inmediato"
                          };
                        } else if (type === "cta") {
                          content = {
                            title: "¿Cuántos días más quieres esperar?",
                            subtitle: "Da el primer paso hacia tu bienestar hoy.",
                            ctaText: "Comenzar Ahora",
                            ctaLink: "",
                            disclaimer: "Sin riesgo · Acceso inmediato"
                          };
                        }

                        const newSection = {
                          id: `section-${Date.now()}`,
                          type: type as any,
                          content
                        };

                        setEditingPage({
                          ...editingPage,
                          sections: [...editingPage.sections, newSection]
                        });
                        e.target.value = ""; // reset
                        toast({ title: "Bloque añadido", description: "Configúralo a continuación." });
                      }}
                      className="border border-[#EBE7DF] bg-white text-[10px] px-2 py-1 rounded-full outline-none font-semibold cursor-pointer"
                    >
                      <option value="">➕ Añadir Bloque...</option>
                      <option value="hero">Cabecera Bienvenida (Hero)</option>
                      <option value="connection">Presentación (Texto + Imagen)</option>
                      <option value="benefits">Beneficios / Items con Iconos</option>
                      <option value="form">Formulario Captura Leads</option>
                      <option value="testimonials">Testimonios Pacientes</option>
                      <option value="faq">Preguntas Frecuentes (FAQ)</option>
                      <option value="transformation">Antes y Después (Transformación)</option>
                      <option value="cta">Llamada a la Acción Final (CTA)</option>
                    </select>
                  </div>

                  {/* List of active sections to drag/reorder/configure */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {editingPage.sections.map((section, index) => {
                      const info = SECTION_TYPES_INFO[section.type] || { name: section.type, desc: "" };
                      return (
                        <div key={section.id} className="bg-white border border-[#EBE7DF] rounded-xl p-3.5 space-y-3 shadow-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                              {index + 1}. {info.name}
                            </span>
                            
                            {/* Reordering and removal controls */}
                            <div className="flex items-center gap-1.5">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-5 h-5"
                                disabled={index === 0}
                                onClick={() => {
                                  const list = [...editingPage.sections];
                                  const temp = list[index];
                                  list[index] = list[index - 1];
                                  list[index - 1] = temp;
                                  setEditingPage({ ...editingPage, sections: list });
                                }}
                              >
                                <ArrowUp className="w-3 h-3 text-muted-foreground" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-5 h-5"
                                disabled={index === editingPage.sections.length - 1}
                                onClick={() => {
                                  const list = [...editingPage.sections];
                                  const temp = list[index];
                                  list[index] = list[index + 1];
                                  list[index + 1] = temp;
                                  setEditingPage({ ...editingPage, sections: list });
                                }}
                              >
                                <ArrowDown className="w-3 h-3 text-muted-foreground" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="w-5 h-5 text-rose-500 hover:bg-rose-50"
                                onClick={() => {
                                  if (window.confirm("¿Seguro que deseas remover este bloque?")) {
                                    const list = editingPage.sections.filter(s => s.id !== section.id);
                                    setEditingPage({ ...editingPage, sections: list });
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Render visual content form settings depending on block type */}
                          <div className="pl-4 border-l border-[#EBE7DF] space-y-3 pt-1 text-xs">
                            
                            {/* HERO SECTION EDIT */}
                            {section.type === "hero" && (
                              <div className="space-y-2">
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Etiqueta Superior (opcional)</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.tagline || ""} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.tagline = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Título Principal</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.title} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.title = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Descripción o Subtítulo</label>
                                  <textarea 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.subtitle} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.subtitle = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón</label>
                                    <input 
                                      className="w-full border border-border rounded p-1 mt-0.5" 
                                      value={section.content.buttonText || ""} 
                                      onChange={(e) => {
                                        const updated = [...editingPage.sections];
                                        updated[index].content.buttonText = e.target.value;
                                        setEditingPage({ ...editingPage, sections: updated });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Enlace Botón (WhatsApp/Link)</label>
                                    <input 
                                      className="w-full border border-border rounded p-1 mt-0.5" 
                                      value={section.content.buttonLink || ""} 
                                      onChange={(e) => {
                                        const updated = [...editingPage.sections];
                                        updated[index].content.buttonLink = e.target.value;
                                        setEditingPage({ ...editingPage, sections: updated });
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* CONNECTION SECTION EDIT */}
                            {section.type === "connection" && (
                              <div className="space-y-2">
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.title} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.title = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Descripción o Historia</label>
                                  <textarea 
                                    rows={4}
                                    className="w-full border border-border rounded p-1 mt-0.5"
                                    value={section.content.description || ""}
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.description = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground mb-1">Imagen de la Sección</label>
                                  
                                  {/* Small thumbnail preview */}
                                  {section.content.imageUrl && (
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EBE7DF] mb-2 bg-[#FAF9F6] flex items-center justify-center group">
                                      <img 
                                        src={section.content.imageUrl} 
                                        alt="thumbnail preview" 
                                        className="w-full h-full object-cover" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.imageUrl = "";
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }}
                                        className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors w-4 h-4 flex items-center justify-center text-[8px] font-bold"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  )}

                                  {/* Upload Area */}
                                  <div className="flex gap-2 items-center">
                                    <label className="cursor-pointer bg-white border border-[#EBE7DF] hover:bg-[#FAF9F6] transition-colors rounded-xl px-3 py-2 text-[10px] font-semibold flex items-center gap-1.5 shadow-xs w-full justify-center text-primary">
                                      📷 Seleccionar Foto de tu Dispositivo
                                      <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;

                                          toast({
                                            title: "Procesando imagen...",
                                            description: "Preparando tu fotografía para el sitio web.",
                                          });

                                          let publicUrl = "";
                                          try {
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                                            const filePath = `cms/${fileName}`;

                                            const { data, error: uploadErr } = await supabase.storage
                                              .from("cms_images")
                                              .upload(filePath, file);

                                            if (!uploadErr && data) {
                                              const { data: urlData } = supabase.storage
                                                .from("cms_images")
                                                .getPublicUrl(filePath);
                                              publicUrl = urlData.publicUrl;
                                            }
                                          } catch (storageErr) {
                                            console.warn("Storage upload failed, falling back to Base64:", storageErr);
                                          }

                                          if (!publicUrl) {
                                            const reader = new FileReader();
                                            reader.onload = (readerEvent) => {
                                              const base64Url = readerEvent.target?.result as string;
                                              const updated = [...editingPage.sections];
                                              updated[index].content.imageUrl = base64Url;
                                              setEditingPage({ ...editingPage, sections: updated });
                                              toast({
                                                title: "Imagen cargada con éxito",
                                                description: "La foto se guardó localmente en tu navegador.",
                                              });
                                            };
                                            reader.readAsDataURL(file);
                                          } else {
                                            const updated = [...editingPage.sections];
                                            updated[index].content.imageUrl = publicUrl;
                                            setEditingPage({ ...editingPage, sections: updated });
                                            toast({
                                              title: "¡Imagen subida a la nube!",
                                              description: "La foto se guardó de forma segura en tu base de datos.",
                                            });
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>

                                  {/* URL Manual Input Toggle */}
                                  <div className="mt-2">
                                    <details className="text-[9px] text-[#5C6E5B] cursor-pointer">
                                      <summary className="hover:underline select-none">O ingresar URL manualmente...</summary>
                                      <input 
                                        className="w-full border border-border rounded p-1 mt-1 font-mono text-[9px] bg-white cursor-text" 
                                        placeholder="https://images.unsplash.com/..."
                                        value={section.content.imageUrl || ""} 
                                        onChange={(e) => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.imageUrl = e.target.value;
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }}
                                      />
                                    </details>
                                  </div>
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Distribución Visual</label>
                                  <select 
                                    className="w-full border border-border rounded p-1 mt-0.5"
                                    value={section.content.layout}
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.layout = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  >
                                    <option value="image-right">Texto Izquierda, Imagen Derecha</option>
                                    <option value="image-left">Imagen Izquierda, Texto Derecha</option>
                                  </select>
                                </div>
                                {/* CTA Button fields for connection */}
                                <div className="bg-[#F0F7EE] border border-[#7EA172]/30 rounded-xl p-2.5 space-y-2">
                                  <p className="text-[9px] font-bold text-[#5C6E5B] uppercase tracking-wider">🔗 Botón de Acción (Opcional)</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.buttonText || ""}
                                        placeholder="Reservar ahora"
                                        onChange={(e) => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.buttonText = e.target.value;
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }} />
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">URL de Destino</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs font-mono"
                                        value={section.content.buttonLink || ""}
                                        placeholder="https://wa.link/... o #seccion"
                                        onChange={(e) => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.buttonLink = e.target.value;
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }} />
                                    </div>
                                  </div>
                                  <p className="text-[9px] text-muted-foreground">Deja el texto vacío para ocultar el botón.</p>
                                </div>
                              </div>
                            )}

                            {/* FORM EMBED SECTION EDIT */}
                            {section.type === "form" && (
                              <div className="space-y-2">
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.title} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.title = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Subtítulo Indicador</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5" 
                                    value={section.content.subtitle || ""} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.subtitle = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Seleccionar Formulario a Mostrar</label>
                                  <select 
                                    className="w-full border border-border rounded p-1 mt-0.5 bg-white"
                                    value={section.content.formId}
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.formId = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  >
                                    {forms.map(f => (
                                      <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}

                            {/* ── BENEFITS SECTION FULL EDITOR ─────────────────────── */}
                            {section.type === "benefits" && (() => {
                              const updateField = (field: string, val: any) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const updateItem = (i: number, field: string, val: string) => {
                                const updated = [...editingPage.sections];
                                updated[index].content.items[i][field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const items: any[] = section.content.items || [];
                              return (
                                <div className="space-y-3">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.title || ""}
                                      onChange={e => updateField("title", e.target.value)} />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`showCta-${section.id}`}
                                      checked={section.content.showCta !== false}
                                      onChange={e => updateField("showCta", e.target.checked)}
                                      className="rounded border-border w-3.5 h-3.5 accent-[#7EA172]"
                                    />
                                    <label htmlFor={`showCta-${section.id}`} className="text-[10px] font-semibold text-muted-foreground cursor-pointer select-none">
                                      Mostrar botón CTA al pie de este bloque
                                    </label>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Items / Beneficios ({items.length})</label>
                                    {items.map((item: any, i: number) => (
                                      <div key={i} className="bg-white border border-[#EBE7DF] rounded-xl p-2.5 space-y-1.5 relative">
                                        <button type="button" onClick={() => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.items = items.filter((_: any, j: number) => j !== i);
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }} className="absolute top-1.5 right-1.5 text-rose-400 hover:text-rose-600 text-[10px] font-bold">✕</button>
                                        <div className="grid grid-cols-[56px,1fr] gap-1.5">
                                          <div>
                                            <label className="text-[9px] text-muted-foreground font-semibold">Icono/Emoji</label>
                                            <input className="w-full border border-border rounded p-1 text-xs bg-white text-center"
                                              value={item.icon || ""} onChange={e => updateItem(i, "icon", e.target.value)} placeholder="🌿" />
                                          </div>
                                          <div>
                                            <label className="text-[9px] text-muted-foreground font-semibold">Título del Item</label>
                                            <input className="w-full border border-border rounded p-1 text-xs bg-white"
                                              value={item.title || ""} onChange={e => updateItem(i, "title", e.target.value)} />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-[9px] text-muted-foreground font-semibold">Descripción</label>
                                          <textarea rows={2} className="w-full border border-border rounded p-1 text-xs bg-white resize-none"
                                            value={item.description || ""} onChange={e => updateItem(i, "description", e.target.value)} />
                                        </div>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.items = [...items, { icon: "✨", title: "Nuevo beneficio", description: "Descripción del beneficio." }];
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }} className="w-full text-[10px] font-semibold text-[#7EA172] border border-dashed border-[#7EA172]/50 rounded-lg py-1.5 hover:bg-[#F3F8F1] transition-colors">
                                      + Agregar Item
                                    </button>
                                  </div>
                                  {/* CTA fields for benefits */}
                                  <div className="bg-[#F0F7EE] border border-[#7EA172]/30 rounded-xl p-2.5 space-y-2">
                                    <p className="text-[9px] font-bold text-[#5C6E5B] uppercase tracking-wider">🔗 Botón de Acción (CTA)</p>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.ctaText || ""} onChange={e => updateField("ctaText", e.target.value)}
                                        placeholder="Quiero estos beneficios ahora" />
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">URL de Destino</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs font-mono"
                                        value={section.content.ctaLink || ""} onChange={e => updateField("ctaLink", e.target.value)}
                                        placeholder="#form-home-hero · #mi-seccion · https://wa.link/..." />
                                      <p className="text-[9px] text-muted-foreground mt-0.5">#ancla para bajar a una sección · https:// para URL externa</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto Debajo del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.ctaSubtext || ""} onChange={e => updateField("ctaSubtext", e.target.value)}
                                        placeholder="Sin costo · Sin tarjeta de crédito" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* ── TESTIMONIALS SECTION FULL EDITOR ─────────────────── */}
                            {section.type === "testimonials" && (() => {
                              const updateField = (field: string, val: any) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const updateTestimonial = (i: number, field: string, val: string) => {
                                const updated = [...editingPage.sections];
                                updated[index].content.testimonials[i][field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const items: any[] = section.content.testimonials || [];
                              return (
                                <div className="space-y-3">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.title || ""}
                                      onChange={e => updateField("title", e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Testimonios ({items.length})</label>
                                    {items.map((item: any, i: number) => (
                                      <div key={i} className="bg-white border border-[#EBE7DF] rounded-xl p-2.5 space-y-1.5 relative">
                                        <button type="button" onClick={() => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.testimonials = items.filter((_: any, j: number) => j !== i);
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }} className="absolute top-1.5 right-1.5 text-rose-400 hover:text-rose-600 text-[10px] font-bold">✕</button>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          <div>
                                            <label className="text-[9px] text-muted-foreground font-semibold">Nombre / Autor</label>
                                            <input className="w-full border border-border rounded p-1 text-xs bg-white"
                                              value={item.author || ""} onChange={e => updateTestimonial(i, "author", e.target.value)} />
                                          </div>
                                          <div>
                                            <label className="text-[9px] text-muted-foreground font-semibold">Rol / Cargo</label>
                                            <input className="w-full border border-border rounded p-1 text-xs bg-white"
                                              value={item.role || ""} onChange={e => updateTestimonial(i, "role", e.target.value)} />
                                          </div>
                                        </div>
                                        <div>
                                          <label className="text-[9px] text-muted-foreground font-semibold">Cita / Testimonio</label>
                                          <textarea rows={3} className="w-full border border-border rounded p-1 text-xs bg-white resize-none"
                                            value={item.quote || ""} onChange={e => updateTestimonial(i, "quote", e.target.value)} />
                                        </div>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.testimonials = [...items, { author: "Nombre del paciente", role: "Profesión, edad", quote: "Su experiencia con nuestra práctica..." }];
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }} className="w-full text-[10px] font-semibold text-[#7EA172] border border-dashed border-[#7EA172]/50 rounded-lg py-1.5 hover:bg-[#F3F8F1] transition-colors">
                                      + Agregar Testimonio
                                    </button>
                                  </div>
                                  {/* CTA fields for testimonials */}
                                  <div className="bg-[#F0F7EE] border border-[#7EA172]/30 rounded-xl p-2.5 space-y-2">
                                    <p className="text-[9px] font-bold text-[#5C6E5B] uppercase tracking-wider">🔗 Botón de Acción (CTA)</p>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.ctaText || ""} onChange={e => updateField("ctaText", e.target.value)}
                                        placeholder="Quiero mi transformación" />
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">URL de Destino</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs font-mono"
                                        value={section.content.ctaLink || ""} onChange={e => updateField("ctaLink", e.target.value)}
                                        placeholder="#form-home-hero · https://wa.link/..." />
                                      <p className="text-[9px] text-muted-foreground mt-0.5">#ancla para bajar a una sección · https:// para URL externa</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto Debajo del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.ctaSubtext || ""} onChange={e => updateField("ctaSubtext", e.target.value)}
                                        placeholder="Únete a +10,000 personas que ya cambiaron su vida" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* ── FAQ SECTION FULL EDITOR ───────────────────────────── */}
                            {section.type === "faq" && (() => {
                              const updateField = (field: string, val: any) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const updateFaq = (i: number, field: string, val: string) => {
                                const updated = [...editingPage.sections];
                                updated[index].content.faqs[i][field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const items: any[] = section.content.faqs || [];
                              return (
                                <div className="space-y-3">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.title || ""}
                                      onChange={e => updateField("title", e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Preguntas Frecuentes ({items.length})</label>
                                    {items.map((item: any, i: number) => (
                                      <div key={i} className="bg-white border border-[#EBE7DF] rounded-xl p-2.5 space-y-1.5 relative">
                                        <button type="button" onClick={() => {
                                          const updated = [...editingPage.sections];
                                          updated[index].content.faqs = items.filter((_: any, j: number) => j !== i);
                                          setEditingPage({ ...editingPage, sections: updated });
                                        }} className="absolute top-1.5 right-1.5 text-rose-400 hover:text-rose-600 text-[10px] font-bold">✕</button>
                                        <div>
                                          <label className="text-[9px] text-muted-foreground font-semibold">Pregunta</label>
                                          <input className="w-full border border-border rounded p-1 text-xs bg-white"
                                            value={item.question || ""} onChange={e => updateFaq(i, "question", e.target.value)} />
                                        </div>
                                        <div>
                                          <label className="text-[9px] text-muted-foreground font-semibold">Respuesta</label>
                                          <textarea rows={2} className="w-full border border-border rounded p-1 text-xs bg-white resize-none"
                                            value={item.answer || ""} onChange={e => updateFaq(i, "answer", e.target.value)} />
                                        </div>
                                      </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.faqs = [...items, { question: "¿Nueva pregunta?", answer: "Respuesta detallada aquí." }];
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }} className="w-full text-[10px] font-semibold text-[#7EA172] border border-dashed border-[#7EA172]/50 rounded-lg py-1.5 hover:bg-[#F3F8F1] transition-colors">
                                      + Agregar Pregunta / Respuesta
                                    </button>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* ── TRANSFORMATION SECTION FULL EDITOR ───────────────── */}
                            {section.type === "transformation" && (() => {
                              const updateField = (field: string, val: any) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const updateListItem = (listKey: "before" | "after", i: number, val: string) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[listKey][i] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              const beforeList: string[] = section.content.before || [];
                              const afterList: string[] = section.content.after || [];
                              return (
                                <div className="space-y-3">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Título del Bloque</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.title || ""} onChange={e => updateField("title", e.target.value)} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Título columna "Antes"</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.beforeTitle || ""} onChange={e => updateField("beforeTitle", e.target.value)} />
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Título columna "Después"</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.afterTitle || ""} onChange={e => updateField("afterTitle", e.target.value)} />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Lista "Antes" ({beforeList.length})</label>
                                      {beforeList.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-1 items-start">
                                          <textarea rows={2} className="flex-1 border border-border rounded p-1 text-[10px] bg-white resize-none"
                                            value={item} onChange={e => updateListItem("before", i, e.target.value)} />
                                          <button type="button" onClick={() => {
                                            const updated = [...editingPage.sections];
                                            updated[index].content.before = beforeList.filter((_: string, j: number) => j !== i);
                                            setEditingPage({ ...editingPage, sections: updated });
                                          }} className="text-rose-400 hover:text-rose-600 text-[9px] font-bold mt-1">✕</button>
                                        </div>
                                      ))}
                                      <button type="button" onClick={() => {
                                        const updated = [...editingPage.sections];
                                        updated[index].content.before = [...beforeList, "Nueva situación problemática"];
                                        setEditingPage({ ...editingPage, sections: updated });
                                      }} className="w-full text-[9px] font-semibold text-rose-500 border border-dashed border-rose-300 rounded py-1 hover:bg-rose-50 transition-colors">
                                        + Agregar
                                      </button>
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Lista "Después" ({afterList.length})</label>
                                      {afterList.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-1 items-start">
                                          <textarea rows={2} className="flex-1 border border-border rounded p-1 text-[10px] bg-white resize-none"
                                            value={item} onChange={e => updateListItem("after", i, e.target.value)} />
                                          <button type="button" onClick={() => {
                                            const updated = [...editingPage.sections];
                                            updated[index].content.after = afterList.filter((_: string, j: number) => j !== i);
                                            setEditingPage({ ...editingPage, sections: updated });
                                          }} className="text-rose-400 hover:text-rose-600 text-[9px] font-bold mt-1">✕</button>
                                        </div>
                                      ))}
                                      <button type="button" onClick={() => {
                                        const updated = [...editingPage.sections];
                                        updated[index].content.after = [...afterList, "Nuevo resultado positivo"];
                                        setEditingPage({ ...editingPage, sections: updated });
                                      }} className="w-full text-[9px] font-semibold text-[#7EA172] border border-dashed border-[#7EA172]/50 rounded py-1 hover:bg-[#F3F8F1] transition-colors">
                                        + Agregar
                                      </button>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón CTA</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.ctaText || ""} onChange={e => updateField("ctaText", e.target.value)} />
                                  </div>
                                  {/* CTA Link + subtext for transformation */}
                                  <div className="bg-[#F0F7EE] border border-[#7EA172]/30 rounded-xl p-2.5 space-y-2">
                                    <p className="text-[9px] font-bold text-[#5C6E5B] uppercase tracking-wider">🔗 Destino del Botón</p>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">URL de Destino</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs font-mono"
                                        value={section.content.ctaLink || ""} onChange={e => updateField("ctaLink", e.target.value)}
                                        placeholder="#form-home-hero · https://wa.link/..." />
                                      <p className="text-[9px] text-muted-foreground mt-0.5">#ancla · https:// para URL externa · vacío = scroll al formulario</p>
                                    </div>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">Texto Debajo del Botón</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                        value={section.content.ctaSubtext || ""} onChange={e => updateField("ctaSubtext", e.target.value)}
                                        placeholder="Gratuito · Sin compromisos · Acceso inmediato" />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* ── CTA (CLOSING) SECTION FULL EDITOR ────────────────── */}
                            {section.type === "cta" && (() => {
                              const updateField = (field: string, val: string) => {
                                const updated = [...editingPage.sections];
                                updated[index].content[field] = val;
                                setEditingPage({ ...editingPage, sections: updated });
                              };
                              return (
                                <div className="space-y-2">
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Título Principal</label>
                                    <textarea rows={2} className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs resize-none"
                                      value={section.content.title || ""} onChange={e => updateField("title", e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Subtítulo / Descripción</label>
                                    <textarea rows={3} className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs resize-none"
                                      value={section.content.subtitle || ""} onChange={e => updateField("subtitle", e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Texto del Botón</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.ctaText || ""} onChange={e => updateField("ctaText", e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="font-semibold block text-[10px] text-muted-foreground">Texto de Garantía / Disclaimer</label>
                                    <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs"
                                      value={section.content.disclaimer || ""} onChange={e => updateField("disclaimer", e.target.value)} />
                                  </div>
                                  {/* CTA Link for closing CTA section */}
                                  <div className="bg-[#F0F7EE] border border-[#7EA172]/30 rounded-xl p-2.5 space-y-2">
                                    <p className="text-[9px] font-bold text-[#5C6E5B] uppercase tracking-wider">🔗 Destino del Botón</p>
                                    <div>
                                      <label className="font-semibold block text-[10px] text-muted-foreground">URL de Destino</label>
                                      <input className="w-full border border-border rounded p-1 mt-0.5 bg-white text-xs font-mono"
                                        value={section.content.ctaLink || ""} onChange={e => updateField("ctaLink", e.target.value)}
                                        placeholder="#form-home-hero · https://wa.link/xy0brl · /clase-gratuita" />
                                      <p className="text-[9px] text-muted-foreground mt-0.5">#ancla para sección · https:// para URL externa · vacío = scroll al formulario</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-[#EBE7DF] flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingPage(null)}
                  className="rounded-full border-[#EBE7DF] text-xs font-semibold px-6 hover:bg-gray-50"
                >
                  Volver Atrás
                </Button>
                
                <Button 
                  onClick={() => handleSavePage(editingPage)}
                  className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-semibold px-8 shadow-sm"
                >
                  Confirmar y Guardar Página
                </Button>
              </div>
            </Card>

            {/* Interactive Real-Time Preview Area */}
            <div className="flex-grow flex flex-col bg-white border border-[#EBE7DF] rounded-3xl overflow-hidden shadow-sm min-h-[500px]">
              
              {/* Preview Nav Header */}
              <div className="bg-[#F8F7F4] border-b border-[#EBE7DF] px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-[#5C6E5B] uppercase tracking-wider">Previsualización Interactiva (Tiempo Real)</span>
                </div>

                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant={previewTab === "desktop" ? "secondary" : "ghost"}
                    onClick={() => setPreviewTab("desktop")}
                    className="h-7 text-[10px] px-2.5 rounded-md font-medium"
                  >
                    🖥️ Computadora
                  </Button>
                  <Button 
                    size="sm" 
                    variant={previewTab === "mobile" ? "secondary" : "ghost"}
                    onClick={() => setPreviewTab("mobile")}
                    className="h-7 text-[10px] px-2.5 rounded-md font-medium"
                  >
                    📱 Celular
                  </Button>
                </div>
              </div>

              {/* Rendering preview frame inside */}
              <div className="flex-grow bg-[#EBE7DF]/30 flex items-center justify-center p-4 overflow-y-auto">
                <div 
                  className={`bg-white shadow-2xl transition-all duration-300 overflow-y-auto flex flex-col border border-[#EBE7DF]/80 rounded-xl ${previewTab === "mobile" ? "w-[360px] h-[640px]" : "w-full max-w-4xl h-[640px]"}`}
                >
                  
                  {/* Mock Navbar */}
                  <div className="py-3 px-4 border-b border-[#EBE7DF]/40 flex justify-between items-center shrink-0">
                    <span className="font-serif text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                      🌿 {settings.brandName}
                    </span>
                    <span className="bg-[#FAF8FC] border border-[#EBE7DF] text-[8px] px-2 py-0.5 rounded-full text-[#5C6E5B]">
                      /{editingPage.slug}
                    </span>
                  </div>

                  {/* Page Preview Content */}
                  <div className="flex-grow bg-[#FAF8FC] text-[#2C3E2B]">
                    {editingPage.sections.map((section, index) => {
                      const isEven = index % 2 === 0;
                      const bgClass = isEven ? "bg-[#FAF8FC]" : "bg-white";
                      
                      switch (section.type) {
                        case "hero":
                          return (
                            <div key={section.id} className={`py-10 px-6 text-center border-b border-border/10 ${bgClass}`}>
                              {section.content.tagline && (
                                <span className="inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E5E1EC] text-[#4E445C] mb-3">
                                  {section.content.tagline}
                                </span>
                              )}
                              <h1 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-[#2C3E2B]">
                                {section.content.title}
                              </h1>
                              <p className="text-xs text-muted-foreground max-w-md mx-auto pt-2 leading-relaxed">
                                {section.content.subtitle}
                              </p>
                              {section.content.buttonText && (
                                <div className="pt-4">
                                  <Button size="sm" className="bg-[#7EA172] text-white hover:bg-[#6C8E61] rounded-full text-xs font-semibold px-5">
                                    {section.content.buttonText}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );

                        case "connection":
                          return (
                            <div key={section.id} className={`py-10 px-6 border-b border-border/10 ${bgClass}`}>
                              <div className="flex flex-col gap-4">
                                <h3 className="font-serif text-xl font-semibold leading-snug">{section.content.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-light">
                                  {section.content.description}
                                </p>
                                {section.content.imageUrl && (
                                  <div className="w-full rounded-2xl overflow-hidden shadow-sm aspect-[16/9] border border-[#EBE7DF]">
                                    <img src={section.content.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                {section.content.buttonText && (
                                  <div>
                                    <Button size="sm" className="bg-[#7EA172] text-white hover:bg-[#6C8E61] rounded-full text-[10px] font-semibold px-5 opacity-80 pointer-events-none">
                                      {section.content.buttonText}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );

                        case "benefits":
                          return (
                            <div key={section.id} className={`py-10 px-6 border-b border-[#EBE7DF]/40 text-center ${bgClass}`}>
                              <h3 className="font-serif text-lg font-semibold mb-4">{section.content.title}</h3>
                              <div className="grid gap-4">
                                {section.content.items?.map((item: any, i: number) => (
                                  <div key={i} className="bg-white border border-[#EBE7DF] p-4 rounded-2xl text-left space-y-1 shadow-xs">
                                    <span className="text-lg">{item.icon}</span>
                                    <h4 className="font-serif font-bold text-sm pt-1">{item.title}</h4>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.description}</p>
                                  </div>
                                ))}
                              </div>
                              {section.content.showCta !== false && (
                                <div className="text-center mt-4">
                                  <Button size="sm" className="bg-[#7EA172] text-white hover:bg-[#6C8E61] rounded-full text-[10px] font-semibold px-5 opacity-80 pointer-events-none">
                                    {section.content.ctaText || "Quiero estos beneficios ahora"}
                                  </Button>
                                  {section.content.ctaSubtext && (
                                    <p className="text-[9px] text-muted-foreground mt-1.5">{section.content.ctaSubtext}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );

                        case "form": {
                          const relatedForm = forms.find(f => f.id === section.content.formId);
                          return (
                            <div key={section.id} className={`py-10 px-6 border-b border-[#EBE7DF]/40 text-center bg-emerald-50/20 ${bgClass}`}>
                              <h3 className="font-serif text-lg font-semibold">{section.content.title}</h3>
                              <p className="text-[10px] text-muted-foreground pt-1">{section.content.subtitle}</p>
                              
                              <div className="bg-white border border-[#EBE7DF] p-5 rounded-2xl text-left max-w-sm mx-auto mt-4 space-y-3 shadow-sm">
                                {relatedForm ? (
                                  relatedForm.fields.map(f => (
                                    <div key={f.id} className="space-y-1">
                                      <label className="text-[10px] font-bold text-[#5C6E5B]">{f.label} {f.required ? "*" : ""}</label>
                                      <input 
                                        type="text" 
                                        placeholder={f.placeholder || ""} 
                                        disabled 
                                        className="w-full bg-[#FAF9F6] border border-[#EBE7DF] rounded p-1.5 text-xs opacity-60 pointer-events-none" 
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded">Ningún formulario seleccionado</div>
                                )}
                                <Button size="sm" className="w-full bg-[#7EA172] text-white rounded-full text-xs font-semibold h-9 opacity-80 pointer-events-none mt-2">
                                  Enviar Consulta
                                </Button>
                              </div>
                            </div>
                          );
                        }

                        case "testimonials":
                          return (
                            <div key={section.id} className={`py-8 px-6 border-b border-[#EBE7DF]/40 ${bgClass}`}>
                              <h3 className="font-serif text-lg font-semibold mb-4 text-center">{section.content.title}</h3>
                              <div className="grid gap-3">
                                {section.content.testimonials?.map((t: any, i: number) => (
                                  <div key={i} className="bg-white border border-[#EBE7DF] p-4 rounded-2xl shadow-xs space-y-2">
                                    <p className="text-[10px] italic text-[#4A5568] leading-relaxed">"{t.quote}"</p>
                                    <div>
                                      <p className="text-[10px] font-bold text-[#2C3E2B]">{t.author}</p>
                                      <p className="text-[9px] text-muted-foreground">{t.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="text-center mt-4">
                                <Button size="sm" className="bg-[#7EA172] text-white hover:bg-[#6C8E61] rounded-full text-[10px] font-semibold px-5 opacity-80 pointer-events-none">
                                  {section.content.ctaText || "Quiero mi transformación"}
                                </Button>
                                {section.content.ctaSubtext && (
                                  <p className="text-[9px] text-muted-foreground mt-1.5">{section.content.ctaSubtext}</p>
                                )}
                              </div>
                            </div>
                          );

                        case "faq":
                          return (
                            <div key={section.id} className={`py-8 px-6 border-b border-[#EBE7DF]/40 ${bgClass}`}>
                              <h3 className="font-serif text-lg font-semibold mb-4 text-center">{section.content.title}</h3>
                              <div className="space-y-2">
                                {section.content.faqs?.map((faq: any, i: number) => (
                                  <div key={i} className="border border-[#EBE7DF] rounded-xl p-3 bg-white shadow-xs">
                                    <p className="text-[10px] font-bold text-[#2C3E2B] mb-1">{faq.question}</p>
                                    <p className="text-[9px] text-muted-foreground leading-relaxed">{faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );

                        case "transformation":
                          return (
                            <div key={section.id} className={`py-8 px-4 border-b border-[#EBE7DF]/40 ${bgClass}`}>
                              <h3 className="font-serif text-base font-semibold mb-4 text-center leading-snug">{section.content.title}</h3>
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 space-y-1.5">
                                  <p className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">{section.content.beforeTitle}</p>
                                  {section.content.before?.map((item: string, i: number) => (
                                    <div key={i} className="flex items-start gap-1">
                                      <span className="text-rose-400 text-[9px] mt-0.5 shrink-0">✗</span>
                                      <p className="text-[9px] text-rose-800 leading-tight">{item}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 space-y-1.5">
                                  <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{section.content.afterTitle}</p>
                                  {section.content.after?.map((item: string, i: number) => (
                                    <div key={i} className="flex items-start gap-1">
                                      <span className="text-emerald-500 text-[9px] mt-0.5 shrink-0">✓</span>
                                      <p className="text-[9px] text-emerald-800 leading-tight">{item}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {section.content.ctaText && (
                                <div className="text-center">
                                  <Button size="sm" className="bg-[#7EA172] text-white rounded-full text-[10px] font-semibold px-5 h-8 opacity-80 pointer-events-none">
                                    {section.content.ctaText}
                                  </Button>
                                </div>
                              )}
                            </div>
                          );

                        case "cta":
                          return (
                            <div key={section.id} className="py-8 px-6 border-b border-[#EBE7DF]/40 bg-gradient-to-b from-[#2C3E2B] to-[#1a261a] text-white text-center">
                              <h3 className="font-serif text-base font-bold leading-snug mb-2">{section.content.title}</h3>
                              <p className="text-[10px] text-white/70 leading-relaxed mb-4 max-w-xs mx-auto">{section.content.subtitle}</p>
                              {section.content.ctaText && (
                                <Button size="sm" className="bg-white text-[#2C3E2B] rounded-full text-[10px] font-semibold px-6 h-8 mb-3 opacity-90 pointer-events-none">
                                  {section.content.ctaText}
                                </Button>
                              )}
                              {section.content.disclaimer && (
                                <p className="text-[8px] text-white/40 mt-1">{section.content.disclaimer}</p>
                              )}
                            </div>
                          );

                        default:
                          return null;
                      }
                    })}
                  </div>

                  {/* Mock Footer */}
                  <div className="py-6 px-4 bg-white border-t border-[#EBE7DF]/40 text-center text-[9px] text-[#5C6E5B] shrink-0">
                    <p className="font-semibold">{settings.brandName}</p>
                    <p className="pt-1">{settings.footerText}</p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- FORM BUILDER VIEW (Simple dynamic field builder) --- */}
        {editingForm && (
          <Card className="max-w-2xl w-full mx-auto bg-white border-[#EBE7DF] rounded-3xl p-6 md:p-8 shadow-sm animate-fade-in space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-1">
                ✏️ Diseñador de Formulario: {editingForm.name}
              </h2>
              <p className="text-[10px] text-[#5C6E5B] font-light">Configura las preguntas que vas a hacer en este formulario.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Nombre del Formulario</label>
                <Input 
                  value={editingForm.name}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                  placeholder="Ej. Formulario de Captura General"
                  className="h-10 border-[#EBE7DF] focus:border-[#7EA172] rounded-xl"
                />
              </div>

              {/* Redirect URL Option */}
              <div className="space-y-1.5 bg-[#FAF9F5] border border-[#EBE7DF] p-4 rounded-2xl">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold block text-primary">Enlace de redirección tras el envío (Opcional)</label>
                  <span className="text-[10px] text-muted-foreground font-semibold px-2 py-0.5 bg-gray-100 rounded-full">Pro</span>
                </div>
                <Input 
                  value={editingForm.redirectUrl || ""}
                  onChange={(e) => setEditingForm({ ...editingForm, redirectUrl: e.target.value })}
                  placeholder="Ej. /clase-gratuita o https://wa.link/..."
                  className="h-10 border-[#EBE7DF] focus:border-[#7EA172] bg-white rounded-xl"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Ingresa una dirección (ruta web local como <code>/clase-gratuita</code> o enlace de WhatsApp externo como <code>https://wa.link/...</code>) a la que enviarás a la persona inmediatamente después de dejar sus datos. Si lo dejas vacío, se mostrará un mensaje de agradecimiento en pantalla.
                </p>
              </div>

              {/* Field builder checklist */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold block">Campos o Preguntas del Formulario ({editingForm.fields.length})</label>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newField = {
                        id: `field-${Date.now()}`,
                        label: "¿Nueva Pregunta?",
                        type: "text" as any,
                        placeholder: "Escribe tu respuesta aquí...",
                        required: true
                      };
                      setEditingForm({
                        ...editingForm,
                        fields: [...editingForm.fields, newField]
                      });
                    }}
                    className="border-[#7EA172] text-[#7EA172] hover:bg-[#7EA172]/5 rounded-full text-[10px] font-semibold h-7"
                  >
                    ➕ Añadir Campo
                  </Button>
                </div>

                <div className="space-y-3">
                  {editingForm.fields.map((field, idx) => (
                    <div key={field.id} className="bg-[#F8F7F4] border border-[#EBE7DF] p-4 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#5C6E5B] uppercase">Campo {idx + 1}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={editingForm.fields.length === 1}
                          onClick={() => {
                            const list = editingForm.fields.filter(f => f.id !== field.id);
                            setEditingForm({ ...editingForm, fields: list });
                          }}
                          className="w-5 h-5 text-rose-500 hover:bg-rose-50 rounded-full"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-xs">
                        {/* Label name */}
                        <div className="space-y-1">
                          <label className="font-semibold">Etiqueta de la Pregunta</label>
                          <input 
                            type="text"
                            value={field.label}
                            onChange={(e) => {
                              const list = [...editingForm.fields];
                              list[idx].label = e.target.value;
                              setEditingForm({ ...editingForm, fields: list });
                            }}
                            className="w-full bg-white border border-[#EBE7DF] rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#7EA172]"
                          />
                        </div>

                        {/* Input Type */}
                        <div className="space-y-1">
                          <label className="font-semibold">Tipo de Respuesta</label>
                          <select 
                            value={field.type}
                            onChange={(e) => {
                              const list = [...editingForm.fields];
                              list[idx].type = e.target.value as any;
                              setEditingForm({ ...editingForm, fields: list });
                            }}
                            className="w-full bg-white border border-[#EBE7DF] rounded px-2 py-1.5 text-xs outline-none focus:border-[#7EA172]"
                          >
                            <option value="text">Texto Corto (Línea simple)</option>
                            <option value="email">Correo Electrónico (Email)</option>
                            <option value="tel">Teléfono / WhatsApp</option>
                            <option value="number">Número (Edad, etc.)</option>
                            <option value="textarea">Texto Largo (Comentarios, motivo consulta)</option>
                            <option value="checkbox">Opción única (Aceptación de términos)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-xs items-center">
                        {/* Placeholder */}
                        {field.type !== "checkbox" && (
                          <div className="space-y-1">
                            <label className="font-semibold">Texto de Guía (Placeholder)</label>
                            <input 
                              type="text"
                              value={field.placeholder || ""}
                              onChange={(e) => {
                                const list = [...editingForm.fields];
                                list[idx].placeholder = e.target.value;
                                setEditingForm({ ...editingForm, fields: list });
                              }}
                              className="w-full bg-white border border-[#EBE7DF] rounded px-2.5 py-1.5 text-xs outline-none focus:border-[#7EA172]"
                            />
                          </div>
                        )}

                        {/* Required Switch */}
                        <div className="flex items-center justify-between pt-4">
                          <span className="font-semibold text-xs text-[#5C6E5B]">¿Es de respuesta obligatoria?</span>
                          <Switch 
                            checked={field.required}
                            onCheckedChange={(val) => {
                              const list = [...editingForm.fields];
                              list[idx].required = val;
                              setEditingForm({ ...editingForm, fields: list });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions for Form editing */}
            <div className="pt-6 border-t border-[#EBE7DF] flex justify-between gap-3">
              <Button 
                variant="outline" 
                onClick={() => setEditingForm(null)}
                className="rounded-full border-[#EBE7DF] text-xs font-semibold px-6 hover:bg-gray-50"
              >
                Volver Atrás
              </Button>
              
              <Button 
                onClick={() => handleSaveForm(editingForm)}
                className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-semibold px-8 shadow-sm"
              >
                Confirmar y Guardar Formulario
              </Button>
            </div>
          </Card>
        )}

        {/* --- BLOG POST EDITOR VIEW --- */}
        {editingPost && (
          <div className="max-w-4xl w-full mx-auto space-y-6 animate-fade-in">
            {/* 1. AI Writing Assistant Widget — seo-content-writer skill */}
            <Card className="bg-amber-50/30 border border-amber-200/80 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 animate-pulse" />
                  <h3 className="font-serif text-base font-bold text-amber-800">
                    Generador de Blogs con IA — SEO CORE-EEAT
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  seo-content-writer v9.9.9
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-normal font-light">
                Powered por el skill <strong>seo-content-writer</strong> (CORE-EEAT framework). Genera artículos SEO completos con: título optimizado, meta description, estructura H1→H2→H3, sección FAQ, score SEO y tiempo de lectura. Requiere <code className="font-mono text-[10px] bg-amber-50 px-1 rounded">GEMINI_API_KEY</code> en Supabase Secrets.
              </p>

              <div className="flex flex-col md:flex-row gap-3 items-stretch">
                <div className="flex-grow">
                  <Input 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Tema + keyword: Ej. Kundalini yoga para el estrés laboral..."
                    disabled={isGeneratingAi}
                    className="h-10 bg-white border-[#EBE7DF] rounded-xl focus:border-amber-500"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <select 
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    disabled={isGeneratingAi}
                    className="flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-xs outline-none focus:border-amber-500"
                  >
                    <option value="empatico">Tono Empático y Cálido</option>
                    <option value="cientifico">Tono Científico y Neuronal</option>
                    <option value="inspirador">Tono Inspirador (Yoga)</option>
                    <option value="sencillo">Tono Sencillo y Directo</option>
                  </select>
                </div>

                <Button 
                  onClick={handleGenerateAiArticle}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl h-10 px-5 flex items-center gap-1.5 shadow-sm text-xs"
                >
                  {isGeneratingAi ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generando artículo SEO...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Generar con SEO IA
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* 2. Main Post Content Editor */}
            <Card className="bg-white border-[#EBE7DF] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-lg font-bold text-primary flex items-center gap-1">
                  📝 Editor de Artículo
                </h2>
                <p className="text-[10px] text-[#5C6E5B] font-light">Escribe y ajusta el contenido para publicarlo en la web.</p>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Título del Artículo</label>
                  <Input 
                    value={editingPost.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      setEditingPost({ ...editingPost, title, slug });
                    }}
                    placeholder="Escribe un título atractivo..."
                    className="h-10 border-[#EBE7DF] focus:border-[#7EA172] rounded-xl font-serif text-sm font-semibold"
                  />
                </div>

                {/* Slug display */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Enlace corto de acceso (Slug)</label>
                  <div className="flex items-center gap-1 bg-[#FAF9F5] border border-[#EBE7DF] rounded-xl px-3 h-10 text-xs font-mono text-gray-500">
                    <span>santosha.com/blog/</span>
                    <input 
                      type="text"
                      value={editingPost.slug}
                      onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="calma-mental"
                      className="bg-transparent border-none outline-none text-foreground w-full font-mono py-1"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Breve Resumen (Excerpt)</label>
                  <Textarea 
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    placeholder="Un párrafo corto para enganchar a los lectores en la lista..."
                    className="min-h-[70px] max-h-[120px] text-xs border-[#EBE7DF] focus:border-[#7EA172] rounded-xl leading-relaxed"
                  />
                </div>

                {/* Local Featured Image Selector */}
                <div className="space-y-1.5 bg-[#FAF9F5] border border-[#EBE7DF] p-4 rounded-2xl">
                  <label className="text-xs font-bold block text-primary">Imagen Destacada (Foto de Portada)</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
                    {editingPost.imageUrl ? (
                      <div className="w-24 h-16 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0">
                        <img src={editingPost.imageUrl} alt="portada" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded-xl bg-[#EBE7DF]/40 flex items-center justify-center text-xl flex-shrink-0">
                        📷
                      </div>
                    )}
                    
                    <div className="space-y-1.5 flex-grow text-center sm:text-left w-full">
                      <input 
                        type="file" 
                        accept="image/*"
                        id="post-image-uploader"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingPost({ ...editingPost, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => document.getElementById("post-image-uploader")?.click()}
                        className="border-[#EBE7DF] hover:bg-[#EBE7DF]/10 rounded-full text-xs font-semibold px-4 h-9"
                      >
                        📷 Seleccionar Foto de tu Dispositivo
                      </Button>
                      
                      <p className="text-[9px] text-muted-foreground leading-normal">
                        Sube una foto directamente desde tu ordenador o móvil. Se optimizará y guardará de forma segura.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Editor Area with quick MD formatting bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold">Cuerpo del Artículo (Formato Markdown)</label>
                    <span className="text-[9px] text-muted-foreground">Soporta negrita, subtítulos y listas.</span>
                  </div>

                  <div className="border border-[#EBE7DF] rounded-2xl overflow-hidden flex flex-col">
                    {/* Markdown buttons bar */}
                    <div className="bg-[#FAF9F5] border-b border-gray-100 p-2 flex gap-2 flex-wrap items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = editingPost.content;
                            const selected = text.substring(start, end) || "Texto";
                            const replacement = `**${selected}**`;
                            const newContent = text.substring(0, start) + replacement + text.substring(end);
                            setEditingPost({ ...editingPost, content: newContent });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 2, start + 2 + selected.length);
                            }, 50);
                          }
                        }}
                        className="h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-50 font-bold"
                      >
                        Negrita
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = editingPost.content;
                            const selected = text.substring(start, end) || "Texto";
                            const replacement = `*${selected}*`;
                            const newContent = text.substring(0, start) + replacement + text.substring(end);
                            setEditingPost({ ...editingPost, content: newContent });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 1, start + 1 + selected.length);
                            }, 50);
                          }
                        }}
                        className="h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-50 italic"
                      >
                        Cursiva
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const text = editingPost.content;
                            const replacement = `\n\n## Subtítulo\n`;
                            const newContent = text.substring(0, start) + replacement + text.substring(start);
                            setEditingPost({ ...editingPost, content: newContent });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 4, start + 13);
                            }, 50);
                          }
                        }}
                        className="h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-50 font-serif"
                      >
                        Subtítulo (H2)
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const text = editingPost.content;
                            const replacement = `\n* Elemento de lista\n`;
                            const newContent = text.substring(0, start) + replacement + text.substring(start);
                            setEditingPost({ ...editingPost, content: newContent });
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(start + 3, start + 20);
                            }, 50);
                          }
                        }}
                        className="h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Lista
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById("content-editor") as HTMLTextAreaElement;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const text = editingPost.content;
                            const replacement = `\n\n---\n\n`;
                            const newContent = text.substring(0, start) + replacement + text.substring(start);
                            setEditingPost({ ...editingPost, content: newContent });
                            setTimeout(() => textarea.focus(), 50);
                          }
                        }}
                        className="h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        Línea Separadora
                      </Button>
                    </div>

                    <textarea
                      id="content-editor"
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      placeholder="Escribe tu artículo en párrafos. Usa el botón superior de Subtítulo para estructurarlo..."
                      className="min-h-[250px] p-4 text-xs w-full bg-white border-0 outline-none leading-relaxed font-mono focus:ring-0"
                    />
                  </div>
                </div>

                {/* Scheduling and Publishing Date Config */}
                <div className="grid sm:grid-cols-2 gap-4 items-center bg-[#FAF9F5] border border-[#EBE7DF] p-4 rounded-2xl">
                  {/* Scheduling field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold block text-primary">Programar fecha de publicación</label>
                    <input 
                      type="datetime-local" 
                      value={new Date(new Date(editingPost.publishedAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                      onChange={(e) => {
                        const dateStr = e.target.value;
                        if (dateStr) {
                          setEditingPost({ ...editingPost, publishedAt: new Date(dateStr).toISOString() });
                        }
                      }}
                      className="w-full bg-white border border-[#EBE7DF] rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#7EA172] font-mono h-10"
                    />
                    <p className="text-[8px] text-muted-foreground leading-normal">
                      Si eliges una fecha futura, el artículo permanecerá oculto y se publicará automáticamente al llegar ese día.
                    </p>
                  </div>

                  {/* Published state switch */}
                  <div className="space-y-2 text-right">
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-xs text-[#5C6E5B]">¿Visible en Internet?</span>
                      <Switch 
                        checked={editingPost.published}
                        onCheckedChange={(val) => setEditingPost({ ...editingPost, published: val })}
                      />
                    </div>
                    <p className="text-[8px] text-muted-foreground leading-normal">
                      Configurar en BORRADOR oculta el post inmediatamente a todos los usuarios.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions for Blog Post editing */}
              <div className="pt-6 border-t border-[#EBE7DF] flex justify-between gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingPost(null)}
                  className="rounded-full border-[#EBE7DF] text-xs font-semibold px-6 hover:bg-gray-50"
                >
                  Volver Atrás
                </Button>
                
                <Button 
                  onClick={() => handleSavePost(editingPost)}
                  className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-semibold px-8 shadow-sm"
                >
                  Confirmar y Publicar Artículo
                </Button>
              </div>
            </Card>
          </div>
        )}

      </main>
      
      {/* Footer dashboard */}
      <footer className="bg-white border-t border-[#EBE7DF] py-6 text-center text-xs text-[#5C6E5B] font-light">
        <p className="flex items-center justify-center gap-1">
          Hecho con <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> para SantoSha por tu Asistente Antigravity • © 2026
        </p>
      </footer>

    </div>
  );
};

export default AdminDashboard;
