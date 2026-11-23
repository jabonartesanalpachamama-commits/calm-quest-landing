import { z } from 'npm:zod@3.25.76';
export const subscriptionSchema = z.object({
  email: z.string().trim().max(255).email().transform(email => email.toLowerCase()),
  consent: z.literal(true),
  source_page: z.enum(['home', 'testimonios']),
  website: z.string().max(1000).default(''),
});
