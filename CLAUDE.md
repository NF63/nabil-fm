# nabil.fm

Personal site and publication hub for Nabil Fahim. Built with Astro 6.

At session start, read `handoff.md` if it exists for prior session context.

## Routes

- **`/`** - Profile page: three-column Tufte layout with section nav dots, expandable career/personal pipelines, JS-positioned margin notes. Defaults to **dark mode**.
- **`/the-margin/`** - Public version of The Margin blog. Placeholder entries only. Defaults to **light mode**. **Gated:** when `features.theMargin` is `false`, visitors are redirected to `/` via client-side JS. Append `?preview` to bypass the gate for local development.

## Feature Flags

`src/config.ts` controls feature availability at build time:

- **`theMargin`** (default: `false`) - When false: nav link hidden, hero link hidden, `/the-margin/` redirects to `/`. When true: all links render, redirect script excluded. Use `?preview` query param to view the page while the flag is off.

## Architecture

### Layouts

- `Base.astro` - shared HTML shell (nav with optional logo via `hideNavLogo` prop, theme toggle, flash prevention, footer, favicons, OG tags). Imports `features` from `config.ts` to conditionally render The Margin nav link.
- `Profile.astro` - wraps Base with two-column grid (section nav + main content with padding-right for margin notes). `sidebarLogo` prop controls both: shows logo in sidebar AND hides it from header nav (single boolean, no drift).

### Key Components

- `SectionNav.astro` - left-margin dots (mirrors The Margin's depth toggle visually). `showLogo` prop adds the logo image above the dot track, theme-aware (light/dark variants via CSS display toggle).
- `CareerSection.astro` - expandable card with nested PipelineNode career timeline. Content updated 2026-04-05 from LinkedIn.
- `PersonalSection.astro` - expandable card with nested PipelineNode interests
- `pipeline/PipelineNode.astro` - exact copy from The Margin (DO NOT MODIFY independently)
- `pipeline/PipelineConnector.astro` - exact copy from The Margin
- `PostCard.astro` - blog article card, copied from The Margin

### Margin Notes (IMPORTANT)

Margin notes use a **JS-positioned approach**, NOT the float technique from The Margin. This is because the profile page uses flex containers (section cards) which break CSS floats.

- **`+` triggers:** `<span class="mn-trigger" data-note="mn-X">+</span>` placed inline anywhere in the DOM
- **Note text:** `<div class="margin-note" data-for="mn-X">text</div>` in the `notes` slot of Profile.astro
- **JS in index.astro** measures trigger positions and sets absolute `top` on notes
- Repositions after: font load (`document.fonts.ready`), expand/collapse (50ms snap, 600ms settlement), resize
- Hidden on mobile (< 900px)
- `+` prefix on note text via CSS `::before`

The Margin blog articles use the original float-based margin notes (different approach, same visual result). The float approach fails here because `overflow` and flex containers in section cards clip the floated notes. We tried float first and hit this wall - the JS approach is the scalable solution.

### CSS Architecture

```
tokens.css     - design tokens + @font-face (EXACT copy from The Margin, verified via diff)
base.css       - reset + theme transition (EXACT copy from The Margin, verified via diff)
components.css - Margin shared styles + profile-specific overrides + responsive breakpoints
global.css     - entry point, imports the three above
```

**Profile-specific CSS** (in components.css, scoped to `.profile-*` or `.profile-section`):
- `.profile`, `.profile-grid`, `.profile-main` - layout
- `.profile-hero`, `.profile-descriptor`, `.profile-link` - hero section
- `.margin-notes`, `.margin-note` - JS-positioned note container
- `.mn-trigger` - inline `+` symbol
- `.section-nav`, `.section-track`, `.section-stop`, `.section-dot`, `.section-label` - left nav
- `.section-card`, `.section-card-header`, `.section-card-body`, etc. - expandable cards
- `.profile-gap-divider` - "Off duty" divider
- `.profile-section .pipeline-node-*` overrides - vertical card layout (vs The Margin's horizontal)
- Responsive breakpoints at 900px and 600px

### Theme System

- Shared localStorage key (`theme`). Toggle persists across routes.
- **Priority:** localStorage > prefers-color-scheme > route default (profile=dark, margin=light)
- Flash prevention: inline `<script>` in `<head>` runs before render
- Logo swaps via CSS `display: none/block` on `[data-theme="dark"]` for both nav (background-image) and sidebar (`<img>` pairs)
- Favicons use `<link media="(prefers-color-scheme: ...)">` for dark/light
- Theme transition: 0.2s ease via `.theme-transition` class, removed after 250ms

### Interactions (all vanilla JS in index.astro)

- **Section card accordion** - one section expanded at a time, `aria-expanded` toggled
- **Pipeline node expand/collapse** - keyboard accessible (Enter/Space), `aria-expanded` toggled
- **Section nav dots** - click-to-scroll + auto-expand collapsed sections
- **Scroll tracking** - scroll-position-based (NOT IntersectionObserver - that failed on short pages)
- **Margin note positioning** - deferred until `document.fonts.ready`, repositions on expand/collapse/resize

### Expand/Collapse Animation

Uses `interpolate-size: allow-keywords` with `height: 0` / `height: auto` (modern CSS, Chrome 129+, Safari 18.2+). No `max-height` hack. Asymmetric timing: 0.4s expand, 0.5-0.6s collapse.

---

## Design Integrity Rule

**nabil-fm is the canonical source for the shared design system.** tokens.css, base.css, and shared components (PipelineNode, PipelineConnector, PostCard) must be developed here first, then synced to the work version via the `margin-nabil-fm-sync` skill.

- **Sync direction:** Always nabil-fm -> the-margin. Never the reverse.
- **Sync skill:** `~/.claude/skills/margin-nabil-fm-sync/` - handles design system sync, parallel audit agents, and drift detection
- **Sync reference doc:** `~/Desktop/Everything/Work/99-claude-docs/the-margin-sync.md` - full workflow including article publishing
- **Design system doc:** `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/design-system.md`
- **Profile-specific** components (SectionNav, CareerSection, PersonalSection, margin note system) are local to nabil-fm and don't need to sync.
- **Verify after changes:** `diff src/styles/tokens.css ~/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/styles/tokens.css`

---

## Two Versions of The Margin

- **This project (nabil-fm)** is primary. All development happens here.
  - Public site at nabil.fm, deployed via Vercel
  - Lives on GitHub (personal account, NF63)
  - The `/the-margin/` route hosts the public version of The Margin blog
- **Work version:** `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/`
  - Receives synced design system and occasional article copies from nabil-fm
  - May contain company-confidential data (Booking.com metrics, internal tools)
  - Lives on GitLab (booking-com/personal/nabil.fahim), deployed to GitLab Pages
  - Never copy from work to nabil-fm without a full sensitivity review and redaction pass

---

## Work Contamination Guard

**CRITICAL: Non-skippable pre-commit check.** This site is public (deployed to Vercel at nabil.fm). Any work content in a commit is publicly visible and permanently in git history.

Before every `git commit` in this project, run these checks. No exceptions.

1. **Deploy contamination audit agent:** Read the Agent 1 prompt from `~/.claude/skills/margin-nabil-fm-sync/audit-specs.md` and deploy it as an Explore agent (read-only). Wait for results.

2. **Git identity:** Verify `git config user.email` returns `84849635+NF63@users.noreply.github.com`. If it shows `nabil.fahim@booking.com`, stop and fix: `git config user.email "84849635+NF63@users.noreply.github.com"`

3. **npm registry:** Verify `.npmrc` in project root contains `registry=https://registry.npmjs.org/`. If missing or pointing to Artifactory, stop and fix.

4. **Gate:** If the audit agent finds ANY match, **block the commit**. Fix the contamination, re-run the agent, then commit.

**Banned patterns** (scanned in `src/`, `public/`, `package.json`, `.npmrc`):
- `booking.com` (URLs or emails)
- `gitlab.com/booking-com`
- `jfrog.booking.com`
- `/personal/nabil.fahim/the-margin/`
- `@booking.com`
- `ssh.booking.com`
- `GlobalProtect`

**Not scanned** (legitimately reference work paths): `CLAUDE.md`, `docs/superpowers/`, `.git/`, `node_modules/`

---

## NPM Registry

Project has local `.npmrc` overriding global Booking Artifactory to `https://registry.npmjs.org/`. VPN blocks public npm - must disconnect GlobalProtect VPN to run `npm install`, then reconnect.

---

## Static Assets

```
public/images/
├── logo-light.png          # Nav logo, light mode (dark logo on light bg)
├── logo-dark.png           # Nav logo, dark mode (light logo on dark bg)
├── logo-sidebar-light.png  # Sidebar logo, dark mode (light logo on dark bg)
├── logo-sidebar-dark.png   # Sidebar logo, light mode (dark logo on light bg)
└── amsterdam-houses.svg    # Margin illustration, uses currentColor
```

---

## Git

- Remote: GitHub NF63/nabil-fm (https://github.com/NF63/nabil-fm)
- Email: 84849635+NF63@users.noreply.github.com
- NEVER push without explicit user approval

---

## Deployment

- Deployed on Vercel from GitHub repo NF63/nabil-fm
- Domain: nabil.fm / www.nabil.fm
- Auto-deploys on push to main
- Old site preserved at: `~/Desktop/Everything/Personal/web-apps-and-projects/my-site/` (NF63/my-site repo, domains removed)

---

## Design Decisions Log

Decisions made during build sessions (2026-04-03 onwards). These are settled unless the user explicitly revisits them.

1. **Margin notes: JS-positioned, not float** - float breaks in flex containers. Tried 3 approaches before landing on JS positioning.
2. **Scroll tracking: scroll-position, not IntersectionObserver** - IO failed on short pages (collapsed sections never entered trigger zone).
3. **Section nav labels:** nabil.fm, Career, Out of Office - matching the card titles.
4. **No section header labels** (removed "CAREER" / "PERSONAL" above cards - cleaner without).
5. **Pipeline node layout override** - vertical stack (company/role/date) instead of The Margin's horizontal (step|title|chevron). Done via CSS overrides, PipelineNode.astro unchanged.
6. **Personal section nodes** - solid dots (not dashed), matching career for uniformity.
7. **Logo placement** - On profile page: logo in sidebar (above section nav dots, 55px, right-aligned with dots). On other pages: logo in header nav (32px, CSS background-image swap). Controlled by single `sidebarLogo` prop on Profile.astro.
8. **Shared footer** - in Base.astro, appears on both profile and blog pages.
9. **expand/collapse** - `interpolate-size: allow-keywords` + `height: auto` instead of `max-height: 3000px` hack.
10. **Header border** - removed on home page for minimal look. Toggle floats as a quiet utility in the corner.
11. **Nav link arrow** - `↗` character after "The Margin" link with hover micro-interaction (opacity + translate). Adjacent sibling divider (`.nav-link + .theme-toggle::before`) only renders when link is present.
12. **Margin illustrations** - SVG doodles (e.g. Amsterdam canal houses) as margin notes. Use `currentColor` for theme-awareness, muted opacity (0.55). No `+` prefix via `.margin-note--illustration::before { display: none }`.
13. **Feature flags** - `src/config.ts` controls section visibility (theMargin). Build-time flags over HTML comments for single source of truth. (2026-04-05)
14. **Preview param for gated pages** - `/the-margin/?preview` bypasses client-side redirect when flag is off. Client-side because static site can't do server-side redirects. (2026-04-05)
15. **Single sidebarLogo prop** - One boolean on Profile.astro controls both sidebar logo display and header logo hiding. Prevents drift. (2026-04-05)
16. **Career content voice** - Personal/editorial tone, not LinkedIn corporate-speak. Matches site personality. (2026-04-06)
17. **Blank step props for personal section** - Removed emoji step labels, left step="" for cleaner Tufte aesthetic. (2026-04-23)
18. **"Over a decade" not specific year count** - Avoids needing annual updates. Hero and career summary both use this phrasing. (2026-04-23)
19. **New GitHub repo over replacing my-site** - Created NF63/nabil-fm rather than pushing into NF63/my-site. Different tech stack (Astro vs static HTML), cleaner git history. Old repo archived. (2026-04-23)

---

## Known Issues / Next Steps

- Meta description still defaults to "Nabil Fahim" - needs a proper description for search/sharing.
- OG image (1200x630px) not created - social sharing previews will look blank.
- Amsterdam houses SVG colour/visibility needs visual review when expanding Career.
- Responsive breakpoints (900px, 600px) implemented but not visually tested on real devices.
- PipelineNode.astro modified (set:html for subtitle) - the-margin needs syncing via margin-nabil-fm-sync skill.
