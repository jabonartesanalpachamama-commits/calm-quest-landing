/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  VisualIdentity, 
  CmsPage, 
  CmsForm, 
  CmsSubmission, 
  COLOR_PALETTES,
  getLocalPages, 
  saveLocalPages,
  getLocalSettings, 
  saveLocalSettings,
  getLocalForms, 
  saveLocalForms,
  getLocalSubmissions, 
  saveLocalSubmissions
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
  ChevronRight
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
  
  // Real-time Preview states
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");

  const { toast } = useToast();
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const loggedIn = localStorage.getItem("sant_cms_logged_in") === "true";
    if (!loggedIn) {
      navigate("/admin/login");
    }
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
          if (parsed) activeSettings = parsed as VisualIdentity;
        }
      } catch (e) {
        console.warn("Db access error, using local settings");
      }
      setSettings(activeSettings);

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
    };

    loadAllCmsData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sant_cms_logged_in");
    toast({
      title: "Sesión cerrada",
      description: "Has salido del panel de administración.",
    });
    navigate("/admin/login");
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
  const SECTION_TYPES_INFO = {
    hero: { name: "Cabecera y Bienvenida (Hero)", desc: "Bloque inicial con título inspirador y botón de llamada a la acción." },
    connection: { name: "Espacio de Conexión (Texto + Imagen)", desc: "Ideal para presentarte como terapeuta o explicar tu método de trabajo." },
    benefits: { name: "Beneficios de la Terapia", desc: "Listado con iconos para destacar en qué aspectos ayuda tu enfoque." },
    form: { name: "Formulario de Contacto / Registro", desc: "Bloque para capturar datos de pacientes interesados." },
    testimonials: { name: "Experiencias de Pacientes", desc: "Bloque elegante de testimonios o citas anónimas inspiradoras." },
    faq: { name: "Preguntas Frecuentes (FAQs)", desc: "Acordeón plegable para responder dudas frecuentes (tarifas, duración, etc.)." }
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
        {!editingPage && !editingForm && (
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
                  value="forms" 
                  className="rounded-full px-5 py-2 data-[state=active]:bg-[#7EA172] data-[state=active]:text-white transition-all text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5 inline-block" /> Diseñar Formularios
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${p.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                          {p.published ? "PUBLICADA" : "BORRADOR"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">/{p.slug}</span>
                      </div>
                      <CardTitle className="font-serif text-lg font-semibold pt-2">{p.title}</CardTitle>
                      <CardDescription className="text-xs text-[#5C6E5B] font-light">
                        {p.sections.length} bloques de diseño incorporados.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardFooter className="pt-2 border-t border-[#F8F7F4] flex justify-between gap-2">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setEditingPage(p)} 
                          className="hover:bg-[#FAF8FC] text-xs font-semibold px-3 rounded-full"
                        >
                          ✏️ Editar Diseño
                        </Button>
                        <Link to={`/${p.slug}`} target="_blank">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-[#FAF8FC] text-xs font-semibold text-[#7EA172] px-3 rounded-full"
                          >
                            👁️ Ver Web
                          </Button>
                        </Link>
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

            {/* TABS CONTENT: 3. SUBMISSIONS / LEADS LIST */}
            <TabsContent value="submissions" className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="font-serif text-xl font-semibold">Pacientes y Consultas Recibidas</h2>
                  <p className="text-xs text-[#5C6E5B] font-light">Aquí se recopilan las personas que han rellenado tus formularios en cualquier página.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* CSV Export Button */}
                  <Button 
                    onClick={handleExportCsv} 
                    className="bg-[#7EA172] hover:bg-[#6C8E61] text-white rounded-full text-xs font-medium gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar a Excel (CSV)
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              <Card className="bg-white border-[#EBE7DF] rounded-3xl p-4 shadow-sm">
                <div className="grid md:grid-cols-3 gap-4">
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar por nombre, correo..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 border-[#EBE7DF] focus:border-[#7EA172] text-sm bg-[#FAF9F6] rounded-xl"
                    />
                  </div>

                  {/* Form Filter */}
                  <div>
                    <select 
                      value={selectedFormFilter}
                      onChange={(e) => setSelectedFormFilter(e.target.value)}
                      className="w-full h-10 border border-[#EBE7DF] bg-[#FAF9F6] px-3 py-2 text-sm rounded-xl focus:border-[#7EA172] outline-none"
                    >
                      <option value="all">Todos los Formularios</option>
                      {forms.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Clean Filter */}
                  <div className="flex justify-end items-center text-xs text-[#5C6E5B] font-light">
                    Total: {submissions.length} registros cargados.
                  </div>
                </div>
              </Card>

              {/* Table of Submissions */}
              <div className="bg-white border border-[#EBE7DF] rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-[#F8F7F4] text-[#5C6E5B] border-b border-[#EBE7DF] font-serif font-semibold text-xs">
                        <th className="p-4">Fecha y Hora</th>
                        <th className="p-4">Procedencia</th>
                        <th className="p-4">Formulario</th>
                        <th className="p-4">Datos del Paciente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F8F7F4]">
                      {submissions
                        .filter(sub => {
                          const matchesForm = selectedFormFilter === "all" || sub.formId === selectedFormFilter;
                          const dataString = JSON.stringify(sub.data).toLowerCase();
                          const matchesSearch = dataString.includes(searchTerm.toLowerCase()) || sub.pageSlug.includes(searchTerm.toLowerCase());
                          return matchesForm && matchesSearch;
                        })
                        .map((sub) => {
                          const matchingForm = forms.find(f => f.id === sub.formId);
                          return (
                            <tr key={sub.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                              <td className="p-4 font-mono text-xs whitespace-nowrap text-muted-foreground">
                                {new Date(sub.createdAt).toLocaleString("es-ES")}
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <span className="bg-[#FAF8FC] text-[#5C6E5B] border border-[#EBE7DF] px-2 py-0.5 rounded-full text-xs font-light">
                                  /{sub.pageSlug}
                                </span>
                              </td>
                              <td className="p-4 whitespace-nowrap font-medium text-xs">
                                {matchingForm?.name || "Registro General"}
                              </td>
                              <td className="p-4">
                                <div className="space-y-1.5 text-xs text-foreground/90 max-w-lg">
                                  {Object.entries(sub.data).map(([key, value]) => {
                                    const fieldDef = matchingForm?.fields.find(f => f.id === key);
                                    const labelName = fieldDef ? fieldDef.label : key;
                                    return (
                                      <div key={key} className="flex flex-col sm:flex-row sm:gap-2">
                                        <span className="font-semibold text-muted-foreground min-w-[120px]">{labelName}:</span>
                                        <span className="whitespace-pre-line leading-relaxed">{String(value)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
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

                  {/* Typography selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Tipografía Emocional</label>
                    <select
                      value={settings.fontFamily}
                      onChange={(e) => setSettings({...settings, fontFamily: e.target.value as any})}
                      className="w-full h-11 border border-[#EBE7DF] px-3 py-2 text-sm rounded-xl outline-none focus:border-[#7EA172]"
                    >
                      <option value="serif">Serif Elegante (Recomendado para Psicología: Outfit & Playfair)</option>
                      <option value="sans">Sans Moderno y Limpio (Inter & Roboto)</option>
                    </select>
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
                    <div className="flex items-center gap-1 bg-white border border-[#EBE7DF] rounded-xl px-2.5 h-9">
                      <span className="text-[10px] text-muted-foreground font-mono">/</span>
                      <input 
                        value={editingPage.slug}
                        onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        placeholder="ej-talleres"
                        className="bg-transparent border-0 outline-none text-xs w-full text-foreground/90 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-xs font-semibold flex items-center gap-1.5">
                      🌐 ¿Publicada en Internet?
                    </label>
                    <Switch 
                      checked={editingPage.published}
                      onCheckedChange={(val) => setEditingPage({ ...editingPage, published: val })}
                    />
                  </div>
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
                          content = { title: "Lo que aprenderás", items: [{ icon: "🧘", title: "Paz", description: "Clases" }] };
                        } else if (type === "form") {
                          content = { title: "Reserva tu plaza", subtitle: "Formulario de contacto", formId: forms[0]?.id || "" };
                        } else if (type === "testimonials") {
                          content = { title: "Experiencias", testimonials: [{ quote: "Excelente espacio.", author: "Anónimo" }] };
                        } else if (type === "faq") {
                          content = { title: "Preguntas Frecuentes", faqs: [{ question: "¿Qué duración tiene?", answer: "1 hora" }] };
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
                      <option value="benefits">Beneficios Terapia</option>
                      <option value="form">Formulario Captura Leads</option>
                      <option value="testimonials">Testimonios Pacientes</option>
                      <option value="faq">Preguntas Frecuentes (FAQ)</option>
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

                            {/* OTHER SECTIONS (BENEFITS, TESTIMONIALS, FAQ) GENERAL TEXT EDIT (SIMPLE) */}
                            {(section.type === "benefits" || section.type === "testimonials" || section.type === "faq") && (
                              <div className="space-y-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-border/60">
                                <p className="text-[10px] leading-relaxed text-muted-foreground">
                                  📌 Este bloque complejo contiene sub-ítems de datos. Puedes guardar y ver cómo se actualiza su previsualización interactiva a la derecha.
                                </p>
                                <div>
                                  <label className="font-semibold block text-[10px] text-muted-foreground">Título Principal</label>
                                  <input 
                                    className="w-full border border-border rounded p-1 mt-0.5 bg-white" 
                                    value={section.content.title || ""} 
                                    onChange={(e) => {
                                      const updated = [...editingPage.sections];
                                      updated[index].content.title = e.target.value;
                                      setEditingPage({ ...editingPage, sections: updated });
                                    }}
                                  />
                                </div>
                              </div>
                            )}

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
