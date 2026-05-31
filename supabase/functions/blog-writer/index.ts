import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── SEO Content Writer Skill — CORE-EEAT System Prompt ──────────────────────
// Based on: https://github.com/aaron-he-zhu/seo-geo-claude-skills (seo-content-writer)
// Framework: CORE-EEAT (Content Optimization with Real Evidence — Expertise, Authoritativeness, Trustworthiness)

const SEO_SYSTEM_PROMPT = `Eres un experto en SEO y redacción de contenido de alto rendimiento.
Tu objetivo es crear artículos de blog 100% optimizados para SEO en español, siguiendo el framework CORE-EEAT.

## FRAMEWORK SEO — CORE-EEAT (16 reglas obligatorias)

**ESTRUCTURA OBLIGATORIA DEL ARTÍCULO:**

1. **[C01] Intent Alignment**: El título H1 debe cumplir exactamente la promesa del tema. Nada de clickbait.
2. **[C02] Direct Answer**: La respuesta principal aparece en los primeros 150 palabras.
3. **[C06] Audience Targeting**: En la intro, declara para quién es el contenido.
4. **[C10] Semantic Closure**: La conclusión resuelve la pregunta inicial y proporciona el próximo paso.
5. **[O01] Heading Hierarchy**: Usa siempre H1 → H2 → H3 en orden correcto.
6. **[O02] Summary Box**: Incluye un bloque "💡 En resumen:" con 2-3 puntos clave al inicio.
7. **[O06] Section Chunking**: Párrafos de 3-5 oraciones. Un tema por sección.
8. **[O09] Information Density**: Elimina relleno. Cada oración aporta valor.
9. **[R01] Data Precision**: Incluye al menos 5 números precisos con unidades cuando aplique.
10. **[R02] Citation Density**: Al menos 1 referencia externa por cada 500 palabras (menciona la fuente aunque no sea clickable).
11. **[R04] Evidence-Claim Mapping**: Cada afirmación importante tiene evidencia, ejemplo o cita.
12. **[R07] Entity Precision**: Usa nombres completos de personas y organizaciones.
13. **[C03] Query Coverage**: Cubre al menos 3 variantes de la pregunta principal o preguntas de seguimiento.
14. **[O08] Anchor Navigation**: Agrega una Tabla de Contenidos cuando el artículo tiene 3+ secciones H2.
15. **[O10] Multimedia Structure**: Sugiere imágenes/gráficos con captions descriptivos cuando sea relevante.
16. **[E07] Practical Tools**: Agrega al menos 1 checklist, plantilla o paso a paso cuando aplique.

## PLANTILLA OBLIGATORIA DE SALIDA

Devuelve el artículo en el siguiente formato EXACTO (JSON):

{
  "title": "H1 optimizado con la keyword principal",
  "slug": "url-amigable-seo-sin-acentos",
  "metaDescription": "Meta description de 150-160 caracteres con keyword y CTA",
  "metaKeywords": ["keyword1", "keyword2", "keyword3"],
  "excerpt": "Resumen de 2-3 oraciones para vistas previas",
  "content": "Contenido completo en HTML con H2, H3, párrafos, listas, etc.",
  "tableOfContents": ["Sección 1", "Sección 2", "Sección 3"],
  "readingTime": 5,
  "seoScore": 85,
  "tags": ["tag1", "tag2"],
  "category": "categoría del artículo",
  "author": "Equipo Editorial",
  "coverImagePrompt": "Descripción para generar imagen de portada",
  "internalLinks": ["Sugerencia de enlace interno 1"],
  "callToAction": "Texto del CTA al final del artículo"
}

## REGLAS CRÍTICAS

- Escribe SIEMPRE en español de México/Latinoamérica, cálido y profesional.
- El campo "content" debe ser HTML válido con etiquetas: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <blockquote>.
- Incluye una sección de "Preguntas Frecuentes" (FAQ) con mínimo 3 preguntas.
- El artículo mínimo debe tener 800 palabras, máximo 2000 palabras.
- NUNCA inventes datos estadísticos. Si no tienes datos precisos, usa frases como "según expertos en el campo" o "estudios indican que".
- Siempre incluye un CTA al final que sea relevante para el tema del blog.
- Devuelve SOLO el JSON válido, sin markdown, sin texto adicional antes o después.`;

interface BlogWriterRequest {
  topic: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  targetAudience?: string;
  tone?: "professional" | "casual" | "friendly" | "inspirational";
  wordCount?: number;
  businessContext?: string; // Info sobre el negocio/marca
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      topic,
      primaryKeyword,
      secondaryKeywords = [],
      targetAudience = "personas interesadas en bienestar y yoga",
      tone = "friendly",
      wordCount = 1200,
      businessContext = ""
    }: BlogWriterRequest = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured as Supabase secret" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!topic || !primaryKeyword) {
      return new Response(
        JSON.stringify({ error: "topic and primaryKeyword are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userPrompt = `
Escribe un artículo de blog SEO completo con las siguientes especificaciones:

**Tema**: ${topic}
**Keyword principal**: ${primaryKeyword}
**Keywords secundarias**: ${secondaryKeywords.join(", ") || "Ninguna especificada — elige 3-4 keywords relacionadas"}
**Audiencia objetivo**: ${targetAudience}
**Tono**: ${tone === "professional" ? "profesional y autoritativo" : tone === "casual" ? "casual y cercano" : tone === "inspirational" ? "inspirador y motivacional" : "amigable y empático"}
**Longitud aproximada**: ${wordCount} palabras
${businessContext ? `**Contexto del negocio**: ${businessContext}` : ""}

Sigue TODOS los puntos del framework CORE-EEAT en tus instrucciones. 
Devuelve SOLO el JSON válido sin texto adicional.
`.trim();

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SEO_SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${geminiRes.status}`, detail: errText }),
        { status: geminiRes.status, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await geminiRes.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON response from the AI
    let blogPost;
    try {
      // Clean any potential markdown fences
      const cleanJson = rawText.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
      blogPost = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Raw text:", rawText.slice(0, 500));
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response as JSON", raw: rawText.slice(0, 1000) }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Add metadata
    blogPost.generatedAt = new Date().toISOString();
    blogPost.skill = "seo-content-writer@9.9.9";
    blogPost.framework = "CORE-EEAT";

    return new Response(
      JSON.stringify({ success: true, blogPost }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("blog-writer edge function error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
