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
import portrait from '@/assets/fransury-sentada-piso-bn.webp.asset.json';
import portraitMobile from '@/assets/fransury-sentada-piso-bn-800.webp.asset.json';

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
  return <section aria-label="Newsletter" className="lux newsletter-section bg-background">
    <div className="newsletter-banner">
      <motion.div initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, amount: .15 }} variants={fadeUp} className="newsletter-copy min-w-0">
        <RevealTitle text="CONECTEMOS" className="newsletter-title text-brand-ink" />
        <p className="newsletter-description text-brand-mauve"><span className="hidden md:inline">Suscríbete a mi newsletter y recibe reflexiones y herramientas para cuidar de ti, directamente en tu correo.</span><span className="md:hidden">Reflexiones y herramientas para cuidar de ti, en tu correo.</span></p>
        <form onSubmit={submit} noValidate className="newsletter-form" aria-busy={status === 'sending'}>
          <Honeypot ref={trap} />
          <label htmlFor={`${id}-email`} className="sr-only">Correo electrónico</label>
          <div className="newsletter-controls">
            <Input id={`${id}-email`} type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" disabled={status === 'sending' || status === 'success'} aria-describedby={`${id}-status`} className="h-12 min-w-0 rounded-none border-brand-mauve bg-card text-base focus-visible:ring-brand-ink md:text-base" />
            <Button type="submit" disabled={status === 'sending' || status === 'success'} className="h-12 shrink-0 rounded-none bg-brand-ink px-5 text-xs font-normal text-primary-foreground hover:bg-brand-mauve focus-visible:ring-brand-ink">
              {status === 'sending' && <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 motion-safe:animate-spin" />}{status === 'sending' ? 'ENVIANDO…' : 'QUIERO RECIBIRLO'}
            </Button>
          </div>
          <div className="newsletter-consent flex items-start gap-2">
            <Checkbox id={`${id}-consent`} required checked={consent} onCheckedChange={value => setConsent(value === true)} disabled={status === 'sending' || status === 'success'} className="mt-1 border-brand-ink focus-visible:ring-brand-ink" />
            <label htmlFor={`${id}-consent`} className="text-xs leading-relaxed text-brand-mauve">Autorizo el tratamiento de mi correo para recibir el newsletter, según la <Link to="/terminos-y-condiciones#datos" className="border-b border-brand-gold text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink">política de tratamiento de datos.</Link></label>
          </div>
          <p className="newsletter-unsubscribe text-brand-mauve">Puedes darte de baja cuando quieras.</p>
          <p id={`${id}-status`} role="status" aria-live="polite" aria-atomic="true" className="newsletter-status text-sm text-brand-ink">
            {status === 'sending' ? 'Guardando tu suscripción…' : status === 'success' ? 'Listo, ya estás suscrito/a. Gracias por conectar.' : error}
          </p>
        </form>
      </motion.div>
      <div className="newsletter-portrait">
        <img src={portrait.url} srcSet={`${portraitMobile.url} 800w, ${portrait.url} 1024w`} sizes="(max-width: 767px) 42vw, (max-width: 1023px) 38vw, 35vw" width={1024} height={1536} alt="Fransury González sentada, sonriendo, con las manos sobre la rodilla" loading="lazy" className="newsletter-photo" />
      </div>
    </div>
  </section>;
}
