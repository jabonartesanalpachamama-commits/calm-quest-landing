import { describe, expect, it } from 'vitest';
const base = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const submit = (body: object) => fetch(`${base}/functions/v1/newsletter-subscribe`, { method: 'POST', headers, body: JSON.stringify(body) });
describe('Hosted newsletter privacy and validation (no stored test entries)', () => {
 it('denies public listing of subscriber emails', async () => {
  const response = await fetch(`${base}/rest/v1/newsletter_subscribers?select=email`, { headers });
  expect([401, 403]).toContain(response.status);
 });
 it('requires consent on the server even if client validation is bypassed', async () => {
  const response = await submit({ email: 'newsletter-validation-test@example.com', consent: false, source_page: 'home', website: '' });
  expect(response.status).toBe(400);
 });
 it('rejects emails longer than 255 characters on the server', async () => {
  const response = await submit({ email: 'a'.repeat(244) + '@example.com', consent: true, source_page: 'home', website: '' });
  expect(response.status).toBe(400);
 });
 it('silently accepts the honeypot without storing a subscription', async () => {
  const response = await submit({ email: 'newsletter-trap-check@example.com', consent: true, source_page: 'testimonios', website: 'spam' });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ success: true });
 });
});
