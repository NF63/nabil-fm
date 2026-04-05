# nabil.fm

Personal site and publication hub for Nabil Fahim. Built with Astro 6.

## Routes

- **`/`** - Profile page: three-column Tufte layout with section nav dots, expandable career/personal pipelines, JS-positioned margin notes. Defaults to **dark mode**.
- **`/the-margin/`** - Public version of The Margin blog. Placeholder entries only. Defaults to **light mode**.

## Architecture

### Layouts

- `Base.astro` - shared HTML shell (nav with logo, theme toggle, flash prevention, footer, favicons, OG tags)
- `Profile.astro` - wraps Base with two-column grid (section nav + main content with padding-right for margin notes)

### Key Components

- `SectionNav.astro` - left-margin dots (mirrors The Margin's depth toggle visually)
- `CareerSection.astro` - expandable card with nested PipelineNode career timeline
- `PersonalSection.astro` - expandable card with nested PipelineNode interests
- `pipeline/PipelineNode.astro` - exact copy from The Margin (DO NOT MODIFY independently)
- `pipeline/PipelineConnector.astro` - exact copy from The Margin
- `PostCard.astro` - blog article card, copied from The Margin

### Margin Notes (IMPORTANT)

Margin notes use a **JS-positioned approach**, NOT the float technique from The Margin. This is because the profile page uses flex containers (section cards) which break CSS floats.

- **`+` triggers:** `<span class="mn-trigger" data-note="mn-X">+</span>` placed inline anywhere in the DOM
- **Note text:** `<div class="margin-note" data-for="mn-X">text</div>` in the `notes` slot of Profile.astro
- **JS in index.astro** measures trigger positions and sets absolute `top` on notes
- Repositions after: font load (`document.fonts.ready`), expand/collapse (500ms delay), resize
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
- Logo swaps via CSS `background-image` on `[data-theme="dark"]`
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

## Git

- Remote: GitHub NF63 (not yet created)
- Email: 84849635+NF63@users.noreply.github.com
- NEVER push without explicit user approval
- 25 commits as of 2026-04-04

---

## Deployment

- Target: Vercel (existing nabil.fm domain, currently points to old my-site)
- Not yet deployed - local development only
- Old site preserved at: `~/Desktop/Everything/Personal/web-apps-and-projects/my-site/`

---

## Design Decisions Log

Decisions made during the initial build session (2026-04-03/04). These are settled unless the user explicitly revisits them.

1. **Margin notes: JS-positioned, not float** - float breaks in flex containers. Tried 3 approaches before landing on JS positioning.
2. **Scroll tracking: scroll-position, not IntersectionObserver** - IO failed on short pages (collapsed sections never entered trigger zone).
3. **Section nav labels:** nabil.fm, career.md, out-of-office.md - matching the card titles for consistency.
4. **No section header labels** (removed "CAREER" / "PERSONAL" above cards - cleaner without).
5. **Pipeline node layout override** - vertical stack (company/role/date) instead of The Margin's horizontal (step|title|chevron). Done via CSS overrides, PipelineNode.astro unchanged.
6. **Personal section nodes** - solid dots (not dashed), matching career for uniformity.
7. **Logo in nav** - CSS background-image swap, not dual `<img>` tags (avoids double download).
8. **Shared footer** - in Base.astro, appears on both profile and blog pages.
9. **expand/collapse** - `interpolate-size: allow-keywords` + `height: auto` instead of `max-height: 3000px` hack.

---

## Known Issues / Next Steps

- Margin note vertical alignment needs visual verification after font load timing fix
- Pipeline chevron positioning may need further tuning per user feedback
- No real article content on the public Margin yet
- GitHub repo not created, Vercel not repointed
- Content is placeholder - career descriptions and personal interests need user review
- Responsive breakpoints (900px, 600px) implemented but not visually tested on real devices
