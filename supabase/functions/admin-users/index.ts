import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bootstrap-secret",
};

type Role = "admin" | "user";

interface Payload {
  action?: "list" | "create" | "delete";
  email?: string;
  password?: string;
  role?: Role;
  user_id?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const BOOTSTRAP_SECRET = Deno.env.get("BOOTSTRAP_SECRET");

    const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const payload: Payload = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action = payload.action ?? "list";

    // ---- Authorization -------------------------------------------------
    // Normal path: caller must be a signed-in admin.
    // Bootstrap path: a matching x-bootstrap-secret header allows creating
    // the very first admin (used once to seed the system; never exposed to
    // the client / login page).
    let authorized = false;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (user) {
        const { data: roleRow } = await service
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleRow) authorized = true;
      }
    }

    const bootstrapHeader = req.headers.get("x-bootstrap-secret");
    let isBootstrap = false;
    if (!authorized && BOOTSTRAP_SECRET && bootstrapHeader && bootstrapHeader === BOOTSTRAP_SECRET) {
      authorized = true;
      isBootstrap = true;
    }

    if (!authorized) {
      return json({ error: "No autorizado. Se requieren permisos de administrador." }, 403);
    }

    // ---- Actions -------------------------------------------------------
    if (action === "list") {
      const { data: list, error } = await service.auth.admin.listUsers();
      if (error) return json({ error: error.message }, 400);

      const { data: roles } = await service.from("user_roles").select("user_id, role");
      const roleMap = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });

      const users = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        roles: roleMap.get(u.id) ?? [],
      }));
      return json({ users });
    }

    if (action === "create") {
      const email = payload.email?.trim();
      const password = payload.password;
      const role: Role = payload.role === "user" ? "user" : "admin";

      if (!email || !password || password.length < 8) {
        return json(
          { error: "Correo válido y contraseña de al menos 8 caracteres son obligatorios." },
          400,
        );
      }

      const { data: created, error } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) return json({ error: error.message }, 400);

      const newUser = created.user;
      if (newUser) {
        const { error: roleError } = await service
          .from("user_roles")
          .insert({ user_id: newUser.id, role });
        if (roleError && !roleError.message.includes("duplicate")) {
          return json({ error: roleError.message }, 400);
        }
      }

      return json({
        user: { id: newUser?.id, email: newUser?.email, role },
        bootstrap: isBootstrap,
      });
    }

    if (action === "delete") {
      if (isBootstrap) {
        return json({ error: "La vía de arranque no permite eliminar usuarios." }, 403);
      }
      const userId = payload.user_id;
      if (!userId) return json({ error: "user_id es obligatorio." }, 400);

      const { error } = await service.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Acción no soportada." }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error inesperado.";
    return json({ error: message }, 500);
  }
});
