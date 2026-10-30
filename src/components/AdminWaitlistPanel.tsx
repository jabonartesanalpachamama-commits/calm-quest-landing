import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

type Row = {
  id: string;
  nombre: string;
  correo: string;
  whatsapp: string | null;
  pais: string | null;
  consentimiento_fecha: string;
  consentimiento_texto: string;
  estado: string;
  created_at: string;
};

const fmt = (iso: string) => new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

export const AdminWaitlistPanel = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [statusMessages, setStatusMessages] = useState<Record<string, { error: boolean; text: string }>>({});

  const updateStatus = async (row: Row, estado: string) => {
    if (saving[row.id] || estado === row.estado) return;
    const previous = row.estado;
    setSaving((current) => ({ ...current, [row.id]: true }));
    setStatusMessages((current) => ({ ...current, [row.id]: { error: false, text: "Guardando…" } }));
    setRows((current) => current.map((r) => r.id === row.id ? { ...r, estado } : r));
    try {
      const { data, error } = await supabase
        .from("waitlist_sabiduria_ciclica")
        .update({ estado })
        .eq("id", row.id)
        .select("id,estado")
        .single();
      if (error || !data) throw new Error("No se pudo guardar");
      setRows((current) => current.map((r) => r.id === row.id ? { ...r, estado: data.estado } : r));
      setStatusMessages((current) => ({ ...current, [row.id]: { error: false, text: "Guardado" } }));
    } catch {
      setRows((current) => current.map((r) => r.id === row.id ? { ...r, estado: previous } : r));
      setStatusMessages((current) => ({ ...current, [row.id]: { error: true, text: "No se pudo guardar. Intenta de nuevo." } }));
    } finally {
      setSaving((current) => ({ ...current, [row.id]: false }));
    }
  };

  useEffect(() => {
    supabase
      .from("waitlist_sabiduria_ciclica")
      .select("id,nombre,correo,whatsapp,pais,consentimiento_fecha,consentimiento_texto,estado,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("No se pudo cargar la lista.");
        else setRows((data ?? []) as Row[]);
        setLoading(false);
      });
  }, []);

  const exportCsv = () => {
    const header = ["Nombre", "Correo", "WhatsApp", "País", "Fecha de consentimiento", "Texto del consentimiento", "Estado", "Fecha de registro"];
    const lines = rows.map((r) =>
      [r.nombre, r.correo, r.whatsapp, r.pais, r.consentimiento_fecha, r.consentimiento_texto, r.estado, r.created_at].map(csvCell).join(";"),
    );
    const csv = "\uFEFF" + [header.map(csvCell).join(";"), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    a.href = url;
    a.download = `lista-espera-sabiduria-ciclica-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold">Lista de espera · Sabiduría Cíclica</h2>
          <p className="text-xs font-light">Total: {rows.length}</p>
        </div>
        <Button onClick={exportCsv} disabled={!rows.length} variant="outline">
          <Download className="w-4 h-4 mr-2" /> Exportar CSV
        </Button>
      </div>
      {loading ? (
        <p className="text-sm">Cargando…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : !rows.length ? (
        <p className="text-sm">Aún no hay personas en la lista.</p>
      ) : (
        <div className="overflow-x-auto border rounded-md bg-card">
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr className="border-b">
                {["Nombre", "Correo", "WhatsApp", "País", "Consentimiento", "Estado", "Registro"].map((h) => (
                  <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{r.nombre}</td>
                  <td className="px-3 py-2">{r.correo}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.whatsapp ?? "—"}</td>
                  <td className="px-3 py-2">{r.pais ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(r.consentimiento_fecha)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Select value={r.estado} onValueChange={(value) => updateStatus(r, value)} disabled={saving[r.id]}>
                      <SelectTrigger aria-label={`Estado de ${r.nombre}`} className="min-w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["en lista", "avisada", "inscrita", "dada de baja"].map((estado) => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span role="status" className={`block text-xs ${statusMessages[r.id]?.error ? "text-destructive" : "text-muted-foreground"}`}>
                      {statusMessages[r.id]?.text}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
