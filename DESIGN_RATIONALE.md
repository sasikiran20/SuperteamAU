<p align="center">
  <img src="app/icon.svg" alt="Superteam Australia" width="60" />
</p>

<h1 align="center">Design Rationale</h1>
<h3 align="center">Superteam Australia — Where the Red Earth Meets the Reef</h3>

---

## 1. Vision

Superteam Australia is not just a website — it's a **digital experience** that captures the energy of Australia's Solana community. Every design decision was made to evoke a visceral sense of place, performance, and possibility.

We set out with one question: *What would the Australian landscape look like if it were a web experience?*

---

## 2. The Earthy Australia Palette

We rejected the typical crypto-blue-on-black aesthetic. The Web3 space is saturated with cold, clinical interfaces that all look the same. Instead, we drew our colour palette directly from the **Australian landscape** — creating something that feels warm, grounded, and unmistakably *ours*.

### Colour System

| Swatch | Colour | Hex | Landscape Inspiration |
|--------|--------|-----|----------------------|
| 🟤 | **Background** | `#100B0A` | The Australian night sky over the Outback — not pure black, but a deep warm brown that gives the entire experience an organic warmth |
| 🔶 | **Primary (Rust)** | `#B54B33` | The iron-oxide red of **Uluru** and the Red Centre — signals energy, urgency, and the raw power of the Australian interior |
| 🟢 | **Secondary (Teal)** | `#00A896` | The turquoise waters of the **Great Barrier Reef** — represents growth, depth, and the creative ecosystem |
| 🟡 | **Accent (Gold)** | `#E1C699` | The **golden wattle** (Australia's national flower) and warm Outback sunsets — highlights key moments without screaming for attention |
| ⬜ | **Foreground** | `#F5EDE6` | **Weathered sandstone** and coastal cliffs — a warm off-white that's never cold or clinical |
| 🟫 | **Muted** | `#1E1412` | **Eucalyptus bark** in moonlight — subtle surface elevation |
| 🪨 | **Border** | `#2E211A` | **Dry creek beds** — gentle structural lines |

### Why This Matters

This palette creates an experience that is instantly recognisable as Australian — without resorting to cliches like kangaroo icons or flag colours. The moment you land on the site, you *feel* Australia. That emotional connection is what separates a forgettable template from a memorable brand experience.

### Colour in Action

```
Hero Section     → Deep background (#100B0A) + Gold accent text (#E1C699)
CTA Buttons      → Rust primary (#B54B33) with hover glow
Event Cards      → Teal highlights (#00A896) for dates and tags
Stats Section    → Gold counters against particle-filled dark space
FAQ Accordion    → Warm foreground (#F5EDE6) text on muted surfaces
```

---

## 3. Typography

| Font | Weight | Usage | Why |
|------|--------|-------|-----|
| **Archivo** | Variable (100–900) | All headings and body text | A geometric sans-serif with sharp angles and wide apertures — feels modern and confident, like the architecture of the Sydney Opera House |
| **Geist Mono** | Regular | Code snippets, technical labels | Clean monospace for data-heavy contexts — pairs with Archivo without competing |

Both fonts are loaded via `next/font` with `display: swap` for zero layout shift and optimal performance.

---

## 4. Animation Philosophy — Cinematic, Not Decorative

> "Every animation must earn its place. If it doesn't serve the story, it doesn't ship."

We approached animation the way a film director approaches camera movement — every motion has a purpose, a rhythm, and a reason.

### Animation Inventory

| Animation | Technology | Purpose | Why This Approach |
|-----------|-----------|---------|-------------------|
| **WebGL Particles** | OGL + custom GLSL shaders | Creates a sense of living data in the stats section — particles float and react to scroll | Custom shaders give us pixel-level control and 60fps performance. Pre-built particle libraries couldn't match our aesthetic |
| **Scroll Reveal** | GSAP ScrollTrigger | Text blurs-to-sharp as you scroll — a cinematic "focus pull" effect | Tied to scroll position (not time), so the user controls the pacing. Borrowed from film direction where focus pulls guide attention |
| **3D Card Transforms** | CSS perspective + mouseMove | Event cards tilt and shift based on cursor position | Creates a tangible, tactile feeling — communicates these are interactive objects worth exploring, not flat images |
| **Parallax Depth** | Framer Motion useScroll + useTransform | Foreground elements move faster than background, simulating physical depth | Establishes content hierarchy through spatial metaphor — important content is "closer" to the viewer |
| **Magnetic Buttons** | Spring physics (custom) | CTA buttons gently attract toward the cursor | Creates a feeling of responsiveness and polish. Users feel it even if they can't articulate why the interaction feels "premium" |
| **Count-Up Numbers** | GSAP with ScrollTrigger | Statistics animate from 0 to final value when scrolled into view | Numbers feel more impactful when you watch them grow. Static numbers are forgettable; animated numbers are memorable |
| **Stairs Transition** | Framer Motion + AnimatePresence | Page transitions use staggered stair-step bars | Turns mundane route changes into a moment of delight. The staircase metaphor suggests "ascending" through content |
| **Marquee Partners** | react-fast-marquee | Infinite scrolling partner logos with hover-pause | Communicates breadth of ecosystem at a glance. Pause-on-hover lets curious users explore without disrupting flow |
| **Lenis Smooth Scroll** | Lenis (rAF-based) | Entire page scrolls with spring-physics easing (1.2s duration) | Transforms browsing from mechanical to fluid. Matches the premium feel of the visual design |

### Why Both GSAP *and* Framer Motion?

This is a deliberate choice, not redundancy:

- **GSAP** excels at **scroll-driven animations** — its ScrollTrigger plugin provides frame-perfect scrubbing that no other library matches
- **Framer Motion** excels at **React-integrated animations** — layout animations, gesture controls, spring physics, and AnimatePresence for mount/unmount transitions

Using both lets us pick the **right tool for each job** rather than forcing one library to do everything poorly.

---

## 5. 100% Custom Components — Zero Templates

We made a deliberate choice: **no UI kits, no pre-built templates, no component libraries for layout**. Every section was designed and built from scratch.

### Why?

A community platform should feel *unique*. When you land on Superteam Australia, you should know immediately that this isn't a Vercel template with a logo swap. The investment in custom components communicates that we take this community as seriously as the technology behind it.

### Custom Component Showcase

| Component | What Makes It Unique |
|-----------|---------------------|
| **3D Card (`3d-card.tsx`)** | Full perspective transform tracking mouse X/Y — spring-based return animation, configurable tilt range |
| **WebGL Particles (`particles.tsx`)** | Hand-written vertex + fragment shaders in GLSL via OGL — controls count, colour, size, and motion per-particle |
| **Circular Text (`circular-text.tsx`)** | SVG `<textPath>` on a circular `<path>` with CSS rotation animation — used for decorative elements |
| **Scroll Reveal (`scroll-reveal.tsx`)** | GSAP ScrollTrigger with per-word blur + opacity + translateY — scrubbed to scroll position, not time |
| **Spotlight Card (`spotlight-card.tsx`)** | Radial gradient follows cursor position on hover, creating a flashlight effect on card surfaces |
| **Creative Button (`creative-button.tsx`)** | Multi-state button with hover reveal animation — text slides up while new text slides in from below |
| **Image Slider (`images-slider.tsx`)** | Full-bleed hero images with Framer Motion crossfade — auto-advances with manual override |
| **Link Preview (`link-preview.tsx`)** | Microlink-powered rich preview on hover — fetches OG images and descriptions for ecosystem links |
| **Get Involved Overlay (`get-involved-overlay.tsx`)** | Multi-step form rendered as a full-screen overlay with staggered field animations and server action validation |
| **Stairs Overlay (`stairs-overlay.tsx`)** | Page transition using staggered horizontal bars — creates a theatrical reveal between routes |

---

## 6. Architecture Decisions

### Why Next.js 16 with App Router?

| Decision | Rationale |
|----------|-----------|
| **Server Components** | Events, members, stats, and FAQs are fetched server-side — zero client JavaScript for data fetching, faster First Contentful Paint |
| **Dynamic Imports** | Heavy animation components (particles, 3D cards, GSAP sections) are lazy-loaded with `next/dynamic` — keeps initial bundle under 150KB |
| **Server Actions** | Form submissions (get-involved) use server actions — no API routes to maintain, built-in progressive enhancement |
| **App Router** | Layouts, loading states, and error boundaries are co-located with routes — cleaner than pages router for complex applications |

### Why Supabase?

| Decision | Rationale |
|----------|-----------|
| **Real-time PostgreSQL** | Admin updates content → changes reflect instantly on the live site without redeployment |
| **Built-in Storage** | Hero images, member avatars, and partner logos stored and served via Supabase CDN — no separate S3 bucket needed |
| **Row-Level Security** | Production-grade access control baked into the database layer |
| **Generous Free Tier** | 500MB database, 1GB storage, 50K monthly active users — more than enough for a community platform |

### Why AWS Amplify?

| Decision | Rationale |
|----------|-----------|
| **Automatic CI/CD** | Push to `main` → build + deploy in minutes. No GitHub Actions config needed |
| **CloudFront CDN** | Global edge delivery — critical for Australian users who suffer high latency to US-based servers |
| **Next.js SSR Support** | Amplify natively handles serverless functions for server components and server actions |
| **Custom Domain + SSL** | Provisioned automatically — zero DevOps overhead |

---

## 7. Performance as a Design Decision

We treat performance as a **first-class design constraint**, not an afterthought to optimise later.

<p align="center">
  <img src="public/images/lighthouse-report.png" alt="Lighthouse Scores" width="500" />
</p>

| Metric | Score | How We Achieved It |
|--------|-------|--------------------|
| **Performance** | **91** | Dynamic imports for heavy components, server-side data fetching, Next.js Image with WebP/AVIF, GPU-accelerated transforms only |
| **Accessibility** | **96** | Semantic HTML throughout, ARIA labels on interactive elements, keyboard navigation for all controls, WCAG AA colour contrast ratios |
| **Best Practices** | **96** | HTTPS everywhere, no deprecated APIs, proper image aspect ratios, no mixed content |
| **SEO** | **100** | Complete meta tags, semantic heading hierarchy, structured content, fast Largest Contentful Paint |

### The Performance Challenge

This site runs **WebGL shaders**, **GSAP ScrollTrigger timelines**, **Framer Motion spring animations**, and **Lenis smooth scroll** — simultaneously. Scoring 91 on Lighthouse Performance while doing all of this required:

1. **Lazy loading** — Animation-heavy sections don't load until needed
2. **GPU-only transforms** — All animations use `transform` and `opacity` only (no layout-triggering properties)
3. **requestAnimationFrame** — Lenis and GSAP both use rAF for scroll, never blocking the main thread
4. **Particle budget** — WebGL particles reduce count on mobile to preserve battery and frame rate
5. **Image pipeline** — Next.js Image handles format negotiation (WebP/AVIF), responsive sizing, and lazy loading automatically

---

## 8. Responsive Design Strategy

| Breakpoint | Adaptation |
|------------|-----------|
| **Mobile (<640px)** | Simplified animations, disabled magnetic buttons, reduced particle count, single-column layouts |
| **Tablet (640–1024px)** | 2-column grids, touch-optimised interactions, condensed navigation |
| **Desktop (>1024px)** | Full cinematic experience — 3D cards, parallax, magnetic effects, multi-column layouts |

### Mobile-First Philosophy

All components are built mobile-first with Tailwind's responsive utilities. The desktop experience *adds* richness; the mobile experience never feels like a broken desktop version.

Touch devices automatically disable cursor-dependent effects (magnetic buttons, spotlight cards, 3D tilt) — because a broken interaction is worse than no interaction.

---

## 9. Hero Section — First Impressions

The hero section is the most critical 5 seconds of the entire experience. Here's what happens:

1. **Background** — A full-bleed image slider cycles through iconic Australian landmarks (Uluru, Great Barrier Reef, Twelve Apostles, Sydney Opera House)
2. **Typography** — "Superteam Australia" renders in large Archivo with a perspective hover effect
3. **CTA Buttons** — Magnetic buttons with spring physics pull toward the cursor
4. **Overlay Form** — "Get Involved" triggers a full-screen multi-step signup overlay

The hero doesn't just *show* what Superteam Australia is — it makes you *want* to be part of it.

---

## 10. Admin Dashboard — Content Without Code

The admin dashboard ensures that non-technical community managers can update every piece of content on the site without touching code:

| Feature | Description |
|---------|-------------|
| **CRUD Tables** | Full create/read/update/delete for events, members, stats, FAQs, partners, mission items, community cards |
| **Image Upload** | Drag-and-drop to Supabase Storage with automatic URL generation |
| **Event Calendar** | Visual calendar view for managing event dates |
| **Search & Filter** | Instant search across all content tables |
| **Responsive** | Works on tablet for on-the-go content updates |

This is a complete CMS — no Contentful, no Sanity, no monthly SaaS fees. Everything is self-hosted on Supabase.

---

## 11. Summary

| Principle | How We Applied It |
|-----------|------------------|
| **Identity over trends** | Earthy Australian palette instead of generic crypto-blue |
| **Purpose over decoration** | Every animation serves narrative or UX function |
| **Craft over convenience** | 100% custom components, zero templates |
| **Performance over spectacle** | 91 Lighthouse score with WebGL + GSAP + Framer Motion running simultaneously |
| **Accessibility over exclusion** | 96 accessibility score, keyboard navigation, semantic HTML |
| **Autonomy over dependency** | Self-hosted CMS on Supabase, no third-party SaaS lock-in |

**Superteam Australia is designed to make you *feel* something** — the warmth of the Australian landscape, the energy of the Solana ecosystem, and the craft of a team that cares about every pixel.

---

<p align="center">
  <sub>Superteam Australia — built with the spirit of the Outback, powered by Solana.</sub>
</p>
