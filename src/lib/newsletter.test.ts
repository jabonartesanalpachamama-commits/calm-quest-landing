import { describe, expect, it } from 'vitest';
import { newsletterSchema } from './newsletter';
const valid = { email: '  Reader@Example.com ', consent: true, source_page: 'home', website: '' };
describe('Newsletter input rules', () => {
  it('normalizes email to lowercase', () => expect(newsletterSchema.parse(valid).email).toBe('reader@example.com'));
  it('requires explicit consent', () => expect(newsletterSchema.safeParse({ ...valid, consent: false }).success).toBe(false));
  it('rejects invalid email', () => expect(newsletterSchema.safeParse({ ...valid, email: 'invalid' }).success).toBe(false));
  it('limits email to 255 characters', () => {
    const email = 'a'.repeat(240) + '@example.com';
    expect(newsletterSchema.safeParse({ ...valid, email }).success).toBe(true);
    expect(newsletterSchema.safeParse({ ...valid, email: 'a'.repeat(244) + '@example.com' }).success).toBe(false);
  });
  it('accepts only the two intended source pages', () => {
    expect(newsletterSchema.safeParse({ ...valid, source_page: 'testimonios' }).success).toBe(true);
    expect(newsletterSchema.safeParse({ ...valid, source_page: 'mi-proceso-individual' }).success).toBe(false);
  });
});
