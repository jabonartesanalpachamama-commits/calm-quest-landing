/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Minimize2, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AiAgentConfig, getLocalAgentConfig } from "@/lib/CmsFallbackData";
import { createGeminiChat, extractLeadFromText, ChatMessage } from "@/lib/geminiChat";

interface AiChatWidgetProps {
  pageSlug?: string;
}

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface DisplayMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface CapturedLead {
  name?: string;
  contact?: string;
}

// ─── Componente principal ────────────────────────────────────────────────────

export const AiChatWidget = ({ pageSlug = "home" }: AiChatWidgetProps) => {
  const [config, setConfig] = useState<AiAgentConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [capturedLead, setCapturedLead] = useState<CapturedLead>({});
  const [leadSaved, setLeadSaved] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const chatRef = useRef<ReturnType<typeof createGeminiChat> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const leadRef = useRef<CapturedLead>({});

  // ── Cargar configuración ──────────────────────────────────────────────────
  useEffect(() => {
    const loadConfig = async () => {
      let cfg = getLocalAgentConfig();
      // Intentar desde Supabase
      try {
        const { data } = await (supabase as any).from("cms_settings").select("*");
        const agentRow = data?.find((r: any) => r.key === "ai_agent_config");
        if (agentRow?.value) cfg = { ...cfg, ...agentRow.value };
      } catch { /* noop */ }
      setConfig(cfg);
    };
    loadConfig();
  }, []);

  // ── Inicializar chat cuando se abre ──────────────────────────────────────
  useEffect(() => {
    if (!config || !isOpen || chatRef.current) return;
    chatRef.current = createGeminiChat(
      config,
      import.meta.env.VITE_GEMINI_API_KEY as string
    );
    // Agregar el mensaje de bienvenida
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: config.welcomeMessage,
        timestamp: new Date()
      }
    ]);
  }, [config, isOpen]);

  // ── Auto-scroll al fondo ─────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Focus en input al abrir ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // ── Guardar lead en Supabase ─────────────────────────────────────────────
  const saveLead = useCallback(async (
    lead: CapturedLead,
    conversation: ChatMessage[]
  ) => {
    if (!lead.name && !lead.contact) return;
    if (leadSaved) return;
    setLeadSaved(true);
    const payload = {
      page_slug: pageSlug,
      name: lead.name || null,
      contact: lead.contact || null,
      conversation: conversation,
      source: "chat"
    };
    try {
      await (supabase as any).from("chat_leads").insert(payload);
    } catch {
      // Fallback to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("sant_chat_leads") || "[]");
        stored.push({ ...payload, id: `local-${Date.now()}`, created_at: new Date().toISOString() });
        localStorage.setItem("sant_chat_leads", JSON.stringify(stored));
      } catch { /* noop */ }
    }
  }, [leadSaved, pageSlug]);

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || !chatRef.current) return;
    setInputValue("");

    const userMsg: DisplayMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Detectar lead en el mensaje del usuario
    const extracted = extractLeadFromText(text);
    const updatedLead = { ...leadRef.current };
    if (extracted.name) updatedLead.name = extracted.name;
    if (extracted.contact) updatedLead.contact = extracted.contact;
    leadRef.current = updatedLead;
    setCapturedLead(updatedLead);

    try {
      const botText = await chatRef.current.sendMessage(text);
      const botMsg: DisplayMessage = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: botText,
        timestamp: new Date()
      };
      setMessages(prev => {
        const allMsgs = [...prev, botMsg];
        // Construir conversación para guardar
        const conversation: ChatMessage[] = allMsgs
          .filter(m => m.id !== "welcome")
          .map(m => ({ role: m.role === "bot" ? "model" : "user", content: m.content }));
        // Intentar guardar si hay datos suficientes
        if (updatedLead.name || updatedLead.contact) {
          saveLead(updatedLead, conversation);
        }
        return allMsgs;
      });

      // Notificación de nuevo mensaje si está cerrado
      if (!isOpen) setHasNewMessage(true);
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: "bot",
        content: "Lo siento, tuve un problema. Por favor intenta de nuevo.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isOpen, saveLead]);

  // ── Enter para enviar ─────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Renderizado ───────────────────────────────────────────────────────────
  if (!config?.enabled) return null;

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[340px] md:w-[380px] flex flex-col"
            style={{ height: "min(520px, calc(100vh - 120px))" }}
          >
            {/* Glass card */}
            <div className="flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)"
              }}
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between shrink-0"
                style={{ background: "linear-gradient(135deg, #2C3E2B 0%, #4a6741 100%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg shrink-0">
                    {config.avatarEmoji}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{config.botName}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white/70 text-[10px]">En línea ahora</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Minimizar chat"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Cerrar chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
                style={{ background: "#F8F7F4" }}
              >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #2C3E2B, #4a6741)" }}
                      >
                        {config.avatarEmoji}
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-white rounded-br-none"
                          : "text-[#2C3E2B] rounded-bl-none border border-[#EBE7DF]"
                      }`}
                      style={{
                        background: msg.role === "user"
                          ? "linear-gradient(135deg, #2C3E2B, #4a6741)"
                          : "white"
                      }}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 justify-start"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ background: "linear-gradient(135deg, #2C3E2B, #4a6741)" }}
                    >
                      {config.avatarEmoji}
                    </div>
                    <div className="bg-white border border-[#EBE7DF] rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#7EA172] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Lead captured banner */}
              <AnimatePresence>
                {capturedLead.name && !leadSaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 text-[11px] text-emerald-700 flex items-center gap-1.5">
                      <span>✅</span>
                      <span>¡Gracias, {capturedLead.name}! Guardando tu información...</span>
                    </div>
                  </motion.div>
                )}
                {leadSaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 text-[11px] text-emerald-700 flex items-center gap-1.5">
                      <span>🌿</span>
                      <span>Tus datos se han guardado. El equipo te contactará pronto.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input area */}
              <div className="px-4 py-3 bg-white border-t border-[#EBE7DF] shrink-0">
                <div className="flex gap-2 items-end">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje..."
                    disabled={isTyping}
                    className="flex-1 bg-[#F8F7F4] border border-[#EBE7DF] rounded-2xl px-4 py-2.5 text-sm text-[#2C3E2B] placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#7EA172] transition-colors resize-none disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    style={{ background: "linear-gradient(135deg, #2C3E2B, #4a6741)" }}
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-[9px] text-muted-foreground/50 mt-1.5">
                  Powered by SantoSha IA · Gemini
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ background: "linear-gradient(135deg, #2C3E2B 0%, #4a6741 100%)" }}
        animate={isOpen ? {} : { scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente IA"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="w-6 h-6" />
              {/* Notification badge */}
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white animate-pulse" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple ring */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "linear-gradient(135deg, #2C3E2B, #4a6741)" }}
          />
        )}
      </motion.button>

      {/* Tooltip on first visit */}
      <AnimatePresence>
        {!isOpen && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 3, duration: 0.4 }}
            className="fixed bottom-[5.5rem] right-[5rem] z-50 bg-white shadow-lg rounded-2xl px-4 py-2 text-xs text-[#2C3E2B] font-medium border border-[#EBE7DF] whitespace-nowrap"
          >
            💬 ¿Tienes dudas? ¡Pregúntame!
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
              style={{ borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "6px solid white" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatWidget;
