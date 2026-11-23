import { useId, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { RevealTitle, fadeUp } from '@/components/landing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Honeypot from '@/components/Honeypot';
import { supabase } from '@/integrations/supabase/client';
import { newsletterSchema } from '@/lib/newsletter';
import portrait from '@/assets/fransury-acompana.webp';

export default function NewsletterSection({ sourcePage }: { sourcePage: 'home' | 'testimonios' }) {
  const id = useId();
  const trap = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current || status === 'success') return;
    const parsed = newsletterSchema.safeParse({ email, consent, source_page: sourcePage, website: trap.current?.value ?? '' });
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? 'Revisa el formulario.'); setStatus('error'); return; }
    sending.current = true;
    setStatus('sending'); setError('');
    try {
      const { data, error: failure } = await supabase.functions.invoke('newsletter-subscribe', { body: parsed.data });
      if (failure || data?.success !== true) throw new Error('subscription');
      setStatus('success');
    } catch { setError('No pudimos guardar tu suscripción. Intenta de nuevo más tarde.'); setStatus('error'); }
    finally { sending.current = false; }
  }
  return <section aria-label="Newsletter" className="lux newsletter-section bg-brand-cream px-6 py-20 md:py-28">
    <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
      <div className="min-w-0">
        <RevealTitle text="CONECTEMOS" className="newsletter-title text-brand-ink" />
        <p className="mt-6 max-w-[48ch] text-base text-brand-mauve">Suscríbete a mi newsletter y recibe reflexiones y herramientas para cuidar de ti, directamente en tu correo.</p>
        <form onSubmit={submit} noValidate className="mt-8" aria-busy={status === 'sending'}>
          <Honeypot ref={trap} />
          <label htmlFor={`${id}-email`} className="mb-2 block text-sm text-brand-ink">Correo electrónico</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input id={`${id}-email`} type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" disabled={status === 'sending' || status === 'success'} aria-describedby={`${id}-status`} className="h-12 min-w-0 rounded-none border-brand-mauve bg-card text-base focus-visible:ring-brand-ink md:text-base" />
            <Button type="submit" disabled={status === 'sending' || status === 'success'} className="h-12 shrink-0 rounded-none bg-brand-ink px-5 text-xs font-normal text-primary-foreground hover:bg-brand-mauve focus-visible:ring-brand-ink">
              {status === 'sending' && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 motion-safe:animate-spin" />}{status === 'sending' ? 'ENVIANDO…' : 'QUIERO RECIBIRLO'}
            </Button>
          </div>
          <p className="mt-3 text-xs text-brand-mauve">Puedes darte de baja cuando quieras.</p>
          <div className="mt-5 flex items-start gap-3">
            <Checkbox id={`${id}-consent`} required checked={consent} onCheckedChange={value => setConsent(value === true)} disabled={status === 'sending' || status === 'success'} className="mt-1 border-brand-ink focus-visible:ring-brand-ink" />
            <label htmlFor={`${id}-consent`} className="text-xs leading-relaxed text-brand-mauve">Autorizo el tratamiento de mi correo para recibir el newsletter, según la <Link to="/terminos-y-condiciones#datos" className="border-b border-brand-gold text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink">política de tratamiento de datos.</Link></label>
          </div>
          <p id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true" className="mt-4 min-h-6 text-sm text-brand-ink">
            {status === 'sending' ? 'Guardando tu suscripción…' : status === 'success' ? 'Listo, ya estás suscrito/a. Gracias por conectar.' : error}
          </p>
        </form>
      </div>
      <div className="newsletter-portrait relative mx-auto w-full max-w-sm overflow-hidden md:max-w-none">
        <img src={portrait} alt="Fransury González sonriendo, sentada en un sofá claro con una camisa blanca." loading="lazy" className="h-[300px] w-full object-cover object-[50%_25%] md:h-[520px]" />
      </div>
    </motion.div>
  </section>;
}
