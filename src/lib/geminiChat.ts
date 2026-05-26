/**
 * geminiChat.ts
 * Helper para comunicación con Gemini API + fallback estático.
 * Importar: import { createGeminiChat } from "@/lib/geminiChat";
 */

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";
import type { AiAgentConfig } from "./CmsFallbackData";

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

/** Detecta si el texto contiene un email */
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
/** Detecta si el texto contiene un número de teléfono/WhatsApp (7-15 dígitos) */
const PHONE_RE = /(\+?[\d\s\-().]{7,20})/;
/** Detecta si el texto parece un nombre propio (2-4 palabras, primera letra mayúscula) */
const NAME_RE = /(?:me llamo|soy|mi nombre es|llámame)\s+([A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñ]+(?:\s+[A-ZÁÉÍÓÚÜÑa-záéíóúüñ][a-záéíóúüñ]+)*)/i;

export interface ExtractedLead {
  name?: string;
  contact?: string;
}

/**
 * Intenta extraer nombre y contacto de un mensaje del usuario
 */
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

interface GeminiChatInstance {
  sendMessage: (text: string) => Promise<string>;
  isLive: boolean;
}

/**
 * Crea una sesión de chat con Gemini usando la config del agente.
 * Si no hay API key, devuelve un handler de fallback que responde con las FAQs.
 */
export function createGeminiChat(
  config: AiAgentConfig,
  envApiKey?: string
): GeminiChatInstance {
  const apiKey = config.apiKey?.trim() || envApiKey?.trim() || "";

  // ── Fallback estático si no hay API key ──────────────────────────────────
  if (!apiKey) {
    return {
      isLive: false,
      sendMessage: async (text: string): Promise<string> => {
        const q = text.toLowerCase();
        for (const faq of config.faqs) {
          const words = faq.question.toLowerCase().split(/\s+/);
          const hits = words.filter(w => w.length > 3 && q.includes(w)).length;
          if (hits >= 2 || q.includes(faq.question.toLowerCase().slice(0, 20))) {
            return faq.answer;
          }
        }
        return `Hola 🌿 Soy ${config.botName}. En este momento estoy en modo básico. Por favor escríbenos directamente a nuestro WhatsApp o completa el formulario de la página y te contactaremos pronto.`;
      }
    };
  }

  // ── Gemini live ──────────────────────────────────────────────────────────
  const genAI = new GoogleGenerativeAI(apiKey);
  let model: GenerativeModel;
  let chat: ChatSession;

  const faqsText = config.faqs.length > 0
    ? "\n\nPREGUNTAS FRECUENTES QUE DEBES SABER RESPONDER:\n" +
      config.faqs.map((f, i) => `${i + 1}. P: ${f.question}\n   R: ${f.answer}`).join("\n")
    : "";

  const systemInstruction = `${config.systemPrompt}${faqsText}

REGLAS IMPORTANTES:
- Responde SIEMPRE en español, con un tono cálido, empático y profesional.
- Sé breve: máximo 3-4 oraciones por respuesta.
- Si el visitante muestra interés en los servicios, invítalo amablemente a dejar su nombre y número de WhatsApp o correo para que el equipo le contacte.
- NO inventes información sobre precios, fechas o disponibilidad si no la conoces.
- Si no sabes la respuesta, di que el equipo le contactará pronto.`;

  try {
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction
    });
    chat = model.startChat({ history: [] });
  } catch (e) {
    console.error("[GeminiChat] Init error:", e);
    return {
      isLive: false,
      sendMessage: async () => `Hola 🌿 Soy ${config.botName}. Escríbenos por WhatsApp y te atenderemos enseguida.`
    };
  }

  return {
    isLive: true,
    sendMessage: async (text: string): Promise<string> => {
      try {
        const result = await chat.sendMessage(text);
        return result.response.text();
      } catch (err) {
        console.error("[GeminiChat] sendMessage error:", err);
        return "Disculpa, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo o escríbenos directamente.";
      }
    }
  };
}
