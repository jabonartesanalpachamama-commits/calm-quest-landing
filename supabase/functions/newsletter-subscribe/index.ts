import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { subscriptionSchema } from './schema.ts';

const reply = (body: object, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Método no permitido.' }, 405);
  try {
    const parsed = subscriptionSchema.safeParse(await req.json());
    if (!parsed.success) return reply({ error: 'Revisa tu correo y autoriza el tratamiento de datos.' }, 400);
    if (parsed.data.website.trim()) return reply({ success: true });
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return reply({ error: 'No pudimos guardar tu suscripción. Intenta de nuevo más tarde.' }, 503);
    const db = createClient(url, key);
    const { error } = await db.from('newsletter_subscribers').insert({
      email: parsed.data.email, source_page: parsed.data.source_page,
    });
    // The database's serialized insert trigger silently ignores existing addresses.
    // Never read subscribers or send mail from this endpoint.
    if (error) return reply({ error: 'No pudimos guardar tu suscripción. Intenta de nuevo más tarde.' }, 503);
    return reply({ success: true });
  } catch {
    return reply({ error: 'No pudimos procesar el formulario. Intenta de nuevo.' }, 400);
  }
});
