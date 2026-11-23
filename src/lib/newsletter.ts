import { z } from 'zod';
export const newsletterSchema = z.object({
  email: z.string().trim().max(255, 'El correo no puede superar 255 caracteres.').email('Escribe un correo electrónico válido.').transform(email => email.toLowerCase()),
  consent: z.literal(true, { errorMap: () => ({ message: 'Debes autorizar el tratamiento de tu correo.' }) }),
  source_page: z.enum(['home', 'testimonios']),
  website: z.string().max(1000).default(''),
});
