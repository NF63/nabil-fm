# nabil.fm - Design Spec

## Overview

Personal site and publication hub at nabil.fm. Single Astro project hosting two concerns: a profile page (career pipeline timeline) at `/` and The Margin (public editorial blog) at `/the-margin/`. Built to 1%er standard - professional, calm, harmonious.

## Audience

Layered. The landing page reads professionally at a glance (recruiters, hiring managers) but rewards curiosity with depth and personality for peers who click in. The Margin serves the deeper technical/industry audience separately.

---

## Site Architecture

| Route | Purpose | Layout |
|---|---|---|
| `/` | Profile page - hero, career pipeline, personal interests | `Profile.astro` - three-column Tufte with section nav dots |
| `/the-margin/` | Blog index - featured hero + article list | `BlogIndex.astro` - three-column Tufte (no depth toggles on index) |
| `/the-margin/[slug]` | Individual articles | `BlogPost.astro` - three-column Tufte with depth toggles |

### Navigation

Minimal. Two items plus theme toggle.

- **Left:** "Nabil Fahim" (Spectral 18px 600) - links to `/`
- **Right:** "The Margin" link + sun/moon theme toggle
- Same nav on all routes. On `/the-margin/*`, "Nabil Fahim" navigates back to profile.

---

## Design System

Wholesale adoption of The Margin's design system. One system, one publication.

### Fonts (self-hosted woff2)

| Token | Family | Role |
|---|---|---|
| `--font-serif` | Spectral (400, 600, 700, 400i) | Headlines, subtitles, sidenotes, margin notes |
| `--font-sans` | Inter (400, 700) | Body, UI, meta, labels |
| `--font-mono` | JetBrains Mono (400, 500) | Code, data, technical elements |

### Colour Tokens

**Light mode (The Margin default, profile non-default):**

| Token | Value | Role |
|---|---|---|
| `--bg` | `#faf9f7` | Warm off-white |
| `--text` | `#1a1a2e` | Navy-black |
| `--text-secondary` | `#8A857D` | Warm taupe |
| `--text-faint` | `#B0ABA3` | Quietest readable |
| `--accent` | `#6B7FA3` | Slate blue - constant across modes |
| `--border` | `#e8e5e0` | Warm beige |
| `--expand-bg` | `#f3f1ed` | Card/surface background |
| `--code-bg` | `#efecea` | Code blocks |
| `--track-line` | `#d8d5d0` | Toggle tracks, inactive dots |

**Dark mode (profile default, The Margin non-default):**

Only overridden tokens listed. `--accent`, `--accent-glow`, `--tag-bg`, `--tag-text` stay constant.

| Token | Value |
|---|---|
| `--bg` | `#1B1E25` |
| `--text` | `#DDD8D0` |
| `--text-secondary` | `#9A958D` |
| `--text-faint` | `#4A463F` |
| `--accent-hover` | `#7D90B5` |
| `--border` | `#2E3340` |
| `--expand-bg` | `#232730` |
| `--code-bg` | `#1F222A` |
| `--track-line` | `#2E3340` |

### Theme Defaults

- **Profile (`/`):** Defaults to **dark mode** when no localStorage preference exists
- **The Margin (`/the-margin/*`):** Defaults to **light mode** when no localStorage preference exists
- **Shared localStorage key:** One `theme` key. Manual toggle is respected across all routes. Only the fallback default differs by route.
- **Flash prevention:** Inline `<script>` in `<head>` checks: (1) localStorage `theme` key - if set, use it; (2) if unset, check `window.location.pathname` - paths starting with `/the-margin` default to `light`, all others default to `dark`; (3) fall back to `prefers-color-scheme` if neither applies.

### Design Principle

**Transposition, not inversion.** Light mode = warm ground, cool figure. Dark mode = cool ground, warm figure. Slate blue accent is the constant thread. No pure white, no pure black, no grey - every neutral is warm (beige/taupe in light, navy in dark).

---

## Profile Page Layout

### Three-Column Grid

```
Left Margin (76px)     Main Content (~700px)      Right Margin (280px)
──────────────────     ─────────────────────      ──────────────────────

 nabil.fm  ●           Hero section               Margin notes
           │           (always visible)            (Spectral italic,
 career    ○                                       contextual to
           │           career.md card              active section)
 off-duty  ○           (collapsed by default)

                       ── Off duty ──

                       out-of-office.md card
                       (collapsed by default)
```

### Left Margin - Section Nav Dots

Identical visual treatment to The Margin's depth toggle:

- **Labels:** Horizontal text, left-aligned, to the left of the dots
- **Dots:** On the right side of the labels
- **Track line:** Vertical, 1.5px, `var(--track-line)`, runs through dot centres
- **Inactive dot:** `var(--track-line)` border, `var(--bg)` fill
- **Active dot:** `var(--accent)` fill + border, `var(--accent-glow)` box-shadow, `scale(1.15)`
- **Active label:** `var(--accent)`
- **Inactive label:** `var(--track-line)`
- **Sticky positioned** - stays visible on scroll
- **Three stops:** `nabil.fm`, `career`, `off-duty`

**Interactions:**
- Clicking a dot smooth-scrolls to that section AND expands it if collapsed
- Active dot updates on scroll via IntersectionObserver
- Dot transitions: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

### Right Margin - Margin Notes

- Spectral italic, 15px, `var(--text-secondary)`
- Unnumbered margin notes with `+` symbol in `var(--accent)`
- Contextual to whichever section is visible
- Same implementation as The Margin's margin notes

### Responsive (900px breakpoint)

- Section dots go horizontal above content
- Margin notes become inline-expandable
- Details to be refined during build

---

## Content Sections

### 1. Hero (nabil.fm)

Always visible, no collapse/expand behaviour.

- **Name:** Spectral h1, 36px, 700
- **Descriptor:** Spectral italic, 19px, `var(--text-secondary)`. One line describing what you do.
- **Link:** "Read The Margin" with arrow, `var(--accent)`, Inter 14px

No photo, no skill list, no paragraph. Minimal and confident.

### 2. Career (career.md)

**Collapsed state (default):**

Single card with `var(--expand-bg)` background, `var(--border)` 1px border, 8px radius.

- Title: "career.md" (Spectral 22px 600)
- Summary: One sentence covering the career arc (Inter 15px, `var(--text-secondary)`)
- Expand hint: chevron + "expand timeline" (JetBrains Mono 11px, `var(--text-faint)`)

**Expanded state:**

Card opens to reveal a nested pipeline. Each role is a PipelineNode:

- **Step:** Date range in mono (e.g., "2023 - present")
- **Title:** Company name (Spectral 17px 600)
- **Subtitle:** Role title + city (JetBrains Mono 11px, `var(--text-secondary)`)
- **Current role:** Accent-coloured dot with glow, accent border on card
- **Past roles:** Standard `var(--track-line)` dots
- **PipelineConnectors** between nodes with italic transition labels ("Moved to Amsterdam")
- **Each node expandable** for project detail (second level of disclosure)

**Accordion:** Expanding career collapses personal (and vice versa). One section open at a time.

**Animation:** Asymmetric height morph - 0.4s expand, 0.6s collapse, matching The Margin's depth layer switching.

### 3. Gap Divider

Between career and personal sections. Same `PipelineGapDivider` from The Margin.

- Horizontal line with centred label
- Label: "Off duty" (JetBrains Mono 10px uppercase, `var(--text-faint)`)

### 4. Personal (out-of-office.md)

**Collapsed state (default):**

Same card style as career.

- Title: "out-of-office.md" (Spectral 22px 600)
- Summary: One sentence (Inter 15px, `var(--text-secondary)`)
- Expand hint with chevron

**Expanded state:**

Pipeline nodes for interests/side projects. Same PipelineNode component but with:

- **Dashed dots** (`border-style: dashed`) - signals these are informal, like The Margin's "gap" nodes
- No status labels needed
- Connectors optional - nodes can stand alone

---

## The Margin Integration

### What Gets Copied (from work version)

- `src/styles/` - all four CSS files (tokens, base, components, global)
- `src/layouts/Base.astro` - HTML shell, nav, theme toggle, flash prevention
- `src/layouts/BlogPost.astro` - article layout with depth toggles
- `src/components/PostCard.astro` - article card for index
- `src/components/pipeline/` - PipelineNode, PipelineConnector, PipelineGapDivider
- `public/fonts/` - all self-hosted woff2 files

### What Does NOT Get Copied

- Article content (search-spike-detection.astro) - contains company-confidential data
- ACG pipeline page (docs/acg-pipeline.astro) - proprietary
- Any Booking.com metrics, internal tool references, or proprietary methods

Articles for the public Margin will be redacted/rewritten versions. Never copy raw from work version without reviewing for sensitive content.

### Blog Index (`/the-margin/index.astro`)

- Featured hero for latest post (title, subtitle, date, reading time, tags)
- "All Writing" compact article list below
- Placeholder entries initially (matching work version's pattern)

---

## Technical Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static output, zero JS by default) |
| Styling | Vanilla CSS with custom properties (The Margin's token system) |
| Interactions | Vanilla JS (section expand, theme toggle, scroll observer) |
| Fonts | Self-hosted woff2 (Spectral, Inter, JetBrains Mono) |
| Deployment | Vercel (existing setup, GitHub NF63 auto-deploy) |
| Git | GitHub NF63/nabil-fm, personal email |

No React, no Tailwind, no animation libraries. No dependencies beyond Astro.

### CSS Architecture

```
src/styles/
  tokens.css        # :root custom properties + @font-face + dark mode overrides
  base.css          # Reset, body, theme transition, prefers-reduced-motion
  components.css    # All shared components + profile-specific components + responsive
  global.css        # Entry point - @imports the three above
```

### File Structure

```
nabil-fm/
  src/
    pages/
      index.astro                    # Profile page
      the-margin/
        index.astro                  # Blog index
        [slug].astro                 # Article template (future)
    layouts/
      Base.astro                     # Shared HTML shell, nav, theme
      Profile.astro                  # Three-col with section nav dots
      BlogPost.astro                 # Three-col with depth toggles
    components/
      SectionNav.astro               # Left margin section dots (profile)
      CareerPipeline.astro           # Career timeline with nested nodes
      PersonalPipeline.astro         # Personal interests nodes
      pipeline/
        PipelineNode.astro           # Reused from The Margin
        PipelineConnector.astro      # Reused from The Margin
        PipelineGapDivider.astro     # Reused from The Margin
      PostCard.astro                 # Blog article card
    styles/
      tokens.css
      base.css
      components.css
      global.css
  public/
    fonts/                           # Self-hosted woff2
    favicon/                         # Multi-format favicon set
  vercel.json
  astro.config.mjs
  package.json
  CLAUDE.md
```

---

## Interactions Summary

| Interaction | Trigger | Behaviour |
|---|---|---|
| Section expand | Click card or section dot | Accordion - one section at a time. Height morph 0.4s/0.6s. |
| Pipeline node expand | Click node header | Reveals detail content within the career/personal pipeline |
| Section dot scroll | Click dot | Smooth-scroll to section + expand if collapsed |
| Active dot tracking | Scroll | IntersectionObserver updates active dot based on viewport |
| Theme toggle | Click sun/moon | Toggles `data-theme` on `<html>`, saves to localStorage |
| Theme transition | On toggle | 0.2s ease via `.theme-transition` class, removed after 250ms |

---

## Design Integrity Rule

**The Margin's design system is the canonical source of truth.** Both the work version (GitLab) and the public version (this project) must stay visually identical in their shared elements - tokens, fonts, typography scale, component styles, animation timings, colour palette, and dark mode behaviour.

- **Never modify tokens or component styles in nabil-fm without checking whether The Margin uses the same values.** If a change is needed, it should be made in both places or not at all.
- **Profile-specific components** (SectionNav, CareerPipeline, PersonalPipeline) are new and local to nabil-fm. These don't need to be mirrored. But any shared component (PipelineNode, PostCard, margin notes, nav, theme toggle) must match.
- **If in doubt, read the work version first.** The Margin at `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/` is the reference implementation. Its `design-system.md` and `tokens.css` are authoritative.
- **New tokens are fine** - the profile page may need tokens that articles don't (e.g., section nav sizing). Add them without overriding existing ones.

---

## Out of Scope

- Server-side rendering (static only)
- Contact form or email integration
- Analytics or tracking
- Search functionality
- Comments on The Margin articles
- Article content creation (placeholder only for now)
- Responsive detail pass (handled during build, not spec'd here)
