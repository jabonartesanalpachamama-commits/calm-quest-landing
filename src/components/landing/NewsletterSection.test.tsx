import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NewsletterSection from './NewsletterSection';
const invoke = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));
beforeEach(() => {
 vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
 vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
 vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
 invoke.mockReset();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe('Newsletter submission', () => {
 it('does not submit without consent', () => {
  render(<MemoryRouter><NewsletterSection sourcePage="home" /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'reader@example.com' } });
  fireEvent.submit(document.querySelector('form') as HTMLFormElement);
  expect(invoke).not.toHaveBeenCalled();
 });
 it('submits only the normalized email, consent, source and honeypot', async () => {
  invoke.mockResolvedValue({ data: { success: true }, error: null });
  render(<MemoryRouter><NewsletterSection sourcePage="testimonios" /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: 'Reader@Example.com' } });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'QUIERO RECIBIRLO' }));
  await waitFor(() => expect(invoke).toHaveBeenCalledWith('newsletter-subscribe', { body: { email: 'reader@example.com', consent: true, source_page: 'testimonios', website: '' } }));
 });
});
