/**
 * geminiChat.ts
 * Helper para comunicación con el agente IA.
 *
 * ARQUITECTURA:
 * - Las llamadas a Gemini van a través de la Supabase Edge Function "ai-chat"
 * - La API key de Gemini se almacena como secreto del servidor (GEMINI_API_KEY)
 * - El cliente NUNCA toca la API key directamente
 *
 * Si la Edge Function no está disponible, cae back a respuestas estáticas de FAQs.
 */

import { createClient } from "@supabase/supabase-js";
import type { AiAgentConfig } from "./CmsFallbackData";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

// ─── Lead extraction ──────────────────────────────────────────────────────────

const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?[\d\s\-().]{7,20})/;
const NAME_RE = /(?:me llamo|soy|mi nombre es|llámame)\s+([A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñ]+(?:\s+[A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñ]+)*)/i;

export interface ExtractedLead {
  name?: string;
  contact?: string;
}

export function extractLeadFromText(text: string): ExtractedLead {
  const lead: ExtractedLead = {};
  const nameMatch = text.match(NAME_RE);
  if (nameMatch) lead.name = nameMatch[1].trim();
  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch) lead.contact = emailMatch[0].trim();
  else {
    const phoneMatch = text.match(PHONE_RE);
    if (phoneMatch) {
      const digits = phoneMatch[1].replace(/[\s\-().]/g, "");
      if (digits.length >= 7) lead.contact = phoneMatch[1].trim();
    }
  }
  return lead;
}

// ─── Supabase client (reutiliza la URL/KEY del .env) ─────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// ─── FAQ fallback matcher ─────────────────────────────────────────────────────

function matchFaq(text: string, faqs: AiAgentConfig["faqs"]): string | null {
  const q = text.toLowerCase();
  for (const faq of faqs) {
    const words = faq.question.toLowerCase().split(/\s+/);
    const hits = words.filter(w => w.length > 3 && q.includes(w)).length;
    if (hits >= 2 || q.includes(faq.question.toLowerCase().slice(0, 20))) {
      return faq.answer;
    }
  }
  return null;
}

// ─── Chat instance ────────────────────────────────────────────────────────────

interface GeminiChatInstance {
  sendMessage: (text: string) => Promise<string>;
  isLive: boolean;
}

/**
 * Crea una sesión de chat que llama a la Edge Function "ai-chat" de Supabase.
 * La Edge Function tiene acceso al secreto GEMINI_API_KEY en el servidor.
 *
 * Fallback: si la Edge Function no está disponible, responde con FAQs estáticas.
 */
export function createGeminiChat(config: AiAgentConfig): GeminiChatInstance {
  const history: ChatMessage[] = [];

  // Construir el system prompt completo
  const faqsText = config.faqs.length > 0
    ? "\n\nPREGUNTAS FRECUENTES:\n" +
      config.faqs.map((f, i) => `${i + 1}. P: ${f.question}\n   R: ${f.answer}`).join("\n")
    : "";

  const systemPrompt = `${config.systemPrompt}${faqsText}

REGLAS IMPORTANTES:
- Responde SIEMPRE en español, con un tono cálido, empático y profesional.
- Sé breve: máximo 3-4 oraciones por respuesta.
- Si el visitante muestra interés en los servicios, invítalo amablemente a dejar su nombre y número de WhatsApp o correo para que el equipo le contacte.
- NO inventes información sobre precios, fechas o disponibilidad si no la conoces.
- Si no sabes la respuesta, di que el equipo le contactará pronto.`;

  const sendMessage = async (text: string): Promise<string> => {
    // 1. Intentar Edge Function
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Missing Supabase env vars");

      const functionUrl = `${SUPABASE_URL}/functions/v1/ai-chat`;

      const res = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: text,
          systemPrompt,
          history: [...history],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.warn("[ai-chat] Edge function error:", res.status, errBody);
        throw new Error(`Edge function ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.text || "No pude procesar tu mensaje. Inténtalo de nuevo.";

      // Guardar en historial para el contexto de la conversación
      history.push({ role: "user", content: text });
      history.push({ role: "model", content: botReply });

      return botReply;
    } catch (edgeErr) {
      console.warn("[ai-chat] Edge function unavailable, using FAQ fallback:", edgeErr);

      // 2. Fallback a FAQs estáticas
      const faqAnswer = matchFaq(text, config.faqs);
      if (faqAnswer) {
        history.push({ role: "user", content: text });
        history.push({ role: "model", content: faqAnswer });
        return faqAnswer;
      }

      const fallback = `Hola 🌿 Soy ${config.botName}. En este momento no puedo procesar tu consulta. Por favor completa el formulario de la página o escríbenos directamente y te atenderemos pronto.`;
      return fallback;
    }
  };

  return {
    isLive: true, // Siempre true — la Edge Function es el canal principal
    sendMessage,
  };
}
