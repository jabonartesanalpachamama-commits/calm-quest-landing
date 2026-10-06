- Landing pages build on the shared kit in src/components/landing (RevealTitle, LandingSection, SplitHero, PriceCard); copy patterns there instead of importing from SabiduriaCiclica.tsx, which stays standalone.
- Service pages load CMS palette/fonts via src/hooks/useVisualSettings; why: one copy of the loader instead of per-page duplicates.
- Long-read pages (Filosofía, Términos) use landing/StickyToc (SideToc + PillToc + useActiveSection); why: one scroll-spy index pattern.
- Brand logo: use the transparent-background asset (src/assets/santosha-logo-transparent.webp) in header/footer; why: the white-background version shows a white oval on cream.
- Editable site lists (e.g. participaciones logos) live in src/data/*.ts; why: content changes in one place without touching components.
- Site-wide editorial theme lives in the `.lux` CSS scope (index.css), applied by ThemeScope in App.tsx to an allow-list of routes; why: CMS writes vars on :root, and clase gratuita / admin must keep their own look.
- Every public landing (including Sabiduría Cíclica) uses components/Header + SiteFooter; LegacyHeader is unused; why: one centered-logo header with identical scroll behaviour.
- ScrollFillText is static unless `animated` is passed; why: word-by-word lighting is reserved for one section.

- Section breaks are flat background changes plus thin gold rules; no gradient transition strips (only photo masks use gradients). Why: client rejected gradient transitions.
