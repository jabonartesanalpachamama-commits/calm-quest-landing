import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, ShieldCheck, User as UserIcon, Loader2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  roles: string[];
}

type Role = "admin" | "user";

export const AdminUsersPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("admin");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list" },
    });
    if (error || data?.error) {
      toast({
        title: "No se pudieron cargar los usuarios",
        description: data?.error ?? error?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
      setUsers([]);
    } else {
      setUsers(data.users ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8) {
      toast({
        title: "Datos incompletos",
        description: "Ingresa un correo válido y una contraseña de al menos 8 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "create", email: email.trim(), password, role },
    });
    setCreating(false);

    if (error || data?.error) {
      toast({
        title: "No se pudo crear el usuario",
        description: data?.error ?? error?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Usuario creado",
      description: `${email.trim()} ya puede iniciar sesión en el panel.`,
    });
    setEmail("");
    setPassword("");
    setRole("admin");
    loadUsers();
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar tu propia cuenta.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm(`¿Eliminar a ${user.email}? Esta acción no se puede deshacer.`)) return;

    setDeletingId(user.id);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "delete", user_id: user.id },
    });
    setDeletingId(null);

    if (error || data?.error) {
      toast({
        title: "No se pudo eliminar",
        description: data?.error ?? error?.message ?? "Inténtalo de nuevo.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Usuario eliminado", description: `${user.email} ya no tiene acceso.` });
    loadUsers();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 lg:grid-cols-[380px_1fr]"
    >
      {/* Create user */}
      <Card className="border-[#EBE7DF] h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2C3E2B] font-serif">
            <UserPlus className="w-5 h-5 text-[#7EA172]" /> Crear usuario
          </CardTitle>
          <CardDescription className="text-[#5C6E5B]">
            Las cuentas solo se crean aquí. Quedan activas de inmediato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2C3E2B]">Correo electrónico</label>
              <Input
                type="email"
                autoComplete="off"
                placeholder="nuevo@santosha.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FBFBFA] border-[#EBE7DF]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2C3E2B]">Contraseña</label>
              <Input
                type="text"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#FBFBFA] border-[#EBE7DF]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#2C3E2B]">Rol</label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="bg-[#FBFBFA] border-[#EBE7DF]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador (acceso al panel)</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={creating}
              className="w-full bg-[#7EA172] hover:bg-[#6C8E61] text-white"
            >
              {creating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creando...
                </span>
              ) : (
                "Crear usuario"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* User list */}
      <Card className="border-[#EBE7DF]">
        <CardHeader>
          <CardTitle className="text-[#2C3E2B] font-serif">Usuarios con acceso</CardTitle>
          <CardDescription className="text-[#5C6E5B]">
            {loading ? "Cargando..." : `${users.length} cuenta(s) registradas.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-[#5C6E5B] py-8 justify-center">
              <Loader2 className="w-5 h-5 animate-spin" /> Cargando usuarios...
            </div>
          ) : users.length === 0 ? (
            <p className="text-[#5C6E5B] text-sm py-8 text-center">No hay usuarios todavía.</p>
          ) : (
            users.map((user) => {
              const isAdmin = user.roles.includes("admin");
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#EBE7DF] bg-[#FBFBFA] px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        isAdmin ? "bg-[#7EA172]/15 text-[#7EA172]" : "bg-[#EBE7DF] text-[#5C6E5B]"
                      }`}
                    >
                      {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2C3E2B] truncate">{user.email}</p>
                      <p className="text-xs text-[#5C6E5B]">
                        {isAdmin ? "Administrador" : user.roles.join(", ") || "Sin rol"}
                        {user.id === currentUserId ? " · tú" : ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === user.id || user.id === currentUserId}
                    onClick={() => handleDelete(user)}
                    className="text-[#B45454] hover:text-[#8e3a3a] hover:bg-[#B45454]/10 shrink-0"
                    aria-label={`Eliminar ${user.email ?? "usuario"}`}
                  >
                    {deletingId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminUsersPanel;
