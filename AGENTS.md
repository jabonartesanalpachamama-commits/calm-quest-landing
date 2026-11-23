- Landing pages build on the shared kit in src/components/landing (RevealTitle, LandingSection, SplitHero, PriceCard); copy patterns there instead of importing from SabiduriaCiclica.tsx, which stays standalone.
- Service pages load CMS palette/fonts via src/hooks/useVisualSettings; why: one copy of the loader instead of per-page duplicates.
- Long-read pages (Filosofía, Términos) use landing/StickyToc (SideToc + PillToc + useActiveSection); why: one scroll-spy index pattern.
- Brand logo: header/footer use src/assets/santosha-logo-blanco.png (Header paints it as a mask); why: the white-background version shows a white oval on cream.
- Editable site lists (e.g. participaciones logos) live in src/data/*.ts; why: content changes in one place without touching components.
- Public review blocks use the ordered featured subset in data/resenas; Testimonios groups the full dataset and both reuse ReviewCapture with a scrollable enlargement dialog; why: original screenshots remain the source of credibility and mobile readers can enlarge them without transcriptions.
- Framed reviews share ResenaImage's fixed-aspect contain wrapper and switch instantly without depth under reduced motion; why: original screenshots remain unaltered.
- Site-wide editorial theme lives in the `.lux` CSS scope (index.css), applied by ThemeScope in App.tsx to an allow-list of routes; why: CMS writes vars on :root, and clase gratuita / admin must keep their own look.
- Every public landing (including Sabiduría Cíclica) uses components/Header + SiteFooter; LegacyHeader is unused; why: one centered-logo header with identical scroll behaviour.
- ScrollFillText is static unless `animated` is passed; why: word-by-word lighting is reserved for one section.

- Shared review blocks use flat light backgrounds without photographs or blur; why: uncluttered reviews and high-contrast controls remain legible.
- Waitlist admin edits update only estado and verify the returned row before confirming success; why: column grants protect all other registration fields and failed saves must roll back locally.
- Public insert forms use components/Honeypot and DB rate-limit trigger enforce_public_insert_rate_limit (60/min per table); why: no IP available client-side, spam protection lives in the database.
- React Bits source adaptations live in components/reactbits with scoped editorial CSS; share existing path photographs via data/caminos and use native window scrolling with a normal reduced-motion list, so unrelated sections and reviews remain unchanged.
- Video gallery dialogs reuse VideoEmbed with opt-in autoplay and conditionally mount the player; restore focus to the originating card on close and apply .lux to the portaled dialog so playback stops and editorial font tokens survive outside the page scope.

- Home paths are real links with desktop hover/focus-only photographic previews and no mobile photos; why: choosing a path navigates directly without selection controls.
- SituationsGrid compact mode is opt-in for individual therapy; why: other service-page layouts stay unchanged.
- IndividualPriceCards derives original package price and savings from data/individualPrices; why: discount amounts cannot drift from session prices.

- Home and Testimonios share NewsletterSection; newsletter-subscribe validates consent and inserts only, while database normalization and serialized duplicate suppression prevent membership disclosure; why: subscriptions stay private and no email is sent.
- NewsletterSection stacks copy above a cropped-margin, complete portrait below 768px; tablet and desktop retain the existing bottom-right banner composition; why: mobile needs a legible full-width form and a large figure without obscuring consent.
