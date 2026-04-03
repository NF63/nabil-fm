# nabil.fm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build nabil.fm - a personal site combining a career pipeline profile page with The Margin blog, using Astro 6 and The Margin's design system.

**Architecture:** Single Astro project with two page types: profile (/) using three-column Tufte layout with section nav dots and expandable career/personal pipelines, and blog (/the-margin/) reusing The Margin's editorial layout. Shared design tokens, fonts, and components. Dark mode default on profile, light on blog.

**Tech Stack:** Astro 6, vanilla CSS (custom properties), vanilla JS, self-hosted fonts (Spectral, Inter, JetBrains Mono), Vercel deployment.

**Design spec:** `docs/superpowers/specs/2026-04-03-nabil-fm-design.md`

**Reference implementation (READ ONLY, never modify):** `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/`

**Design system reference:** `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/design-system.md`

---

## File Structure

```
nabil-fm/
  src/
    pages/
      index.astro                         # Profile page
      the-margin/
        index.astro                       # Blog index
    layouts/
      Base.astro                          # Shared HTML shell, nav, theme
      Profile.astro                       # Three-col with section nav dots
    components/
      SectionNav.astro                    # Left margin section dots (profile)
      CareerSection.astro                 # Career card + nested pipeline
      PersonalSection.astro               # Personal card + nested pipeline
      pipeline/
        PipelineNode.astro                # Copied from The Margin
        PipelineConnector.astro           # Copied from The Margin
        PipelineGapDivider.astro          # Copied from The Margin
      PostCard.astro                      # Blog article card (copied from The Margin)
    styles/
      tokens.css                          # Copied from The Margin
      base.css                            # Copied from The Margin
      components.css                      # Margin shared styles + profile-specific styles
      global.css                          # Entry point
  public/
    fonts/                                # Copied from The Margin (woff2)
    favicon/                              # Favicon set (later)
  vercel.json
  astro.config.mjs
  package.json
  CLAUDE.md
  .gitignore
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `vercel.json`
- Create: `.gitignore`
- Existing: `CLAUDE.md` (already created)

- [ ] **Step 1: Initialise Astro project**

```bash
cd /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm
npm create astro@latest . -- --template minimal --no-install --no-git
```

If prompted about overwriting, allow it for everything except CLAUDE.md.

- [ ] **Step 2: Replace package.json**

```json
{
  "name": "nabil-fm",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^6.1.2"
  }
}
```

- [ ] **Step 3: Write astro.config.mjs**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nabil.fm',
  output: 'static',
  build: {
    assets: '_assets'
  }
});
```

- [ ] **Step 4: Write vercel.json**

```json
{
  "headers": [
    {
      "source": "/(fonts|assets)/(.+)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)\\.(jpg|jpeg|png|webp|avif|css|js|woff2)$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

- [ ] **Step 5: Write .gitignore**

```
node_modules/
dist/
.astro/
.DS_Store
.superpowers/
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

- [ ] **Step 7: Init git and commit**

```bash
git init
git config user.email "84849635+NF63@users.noreply.github.com"
git config user.name "Nabil"
git add package.json package-lock.json astro.config.mjs vercel.json .gitignore CLAUDE.md tsconfig.json
git commit -m "feat: scaffold Astro project for nabil.fm"
```

---

### Task 2: Design System (Copy from The Margin)

**Files:**
- Create: `public/fonts/` (copy all woff2 from The Margin)
- Create: `src/styles/tokens.css` (exact copy from The Margin)
- Create: `src/styles/base.css` (exact copy from The Margin)
- Create: `src/styles/components.css` (nav + theme toggle styles only)
- Create: `src/styles/global.css`

**Reference:** Read each source file from `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/styles/` before copying. Do NOT retype from memory.

- [ ] **Step 1: Copy fonts**

```bash
mkdir -p /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/public/fonts
cp /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/public/fonts/*.woff2 \
   /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/public/fonts/
```

Only copy these fonts (the ones used by the design system):
- `inter-latin.woff2`
- `spectral-400-latin.woff2`
- `spectral-400i-latin.woff2`
- `spectral-600-latin.woff2`
- `spectral-700-latin.woff2`
- `jetbrains-mono-latin.woff2`

Remove any others that were copied (caveat, excalifont, shadows-into-light-two are not part of the design system).

- [ ] **Step 2: Copy tokens.css**

Read `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/styles/tokens.css` and copy it exactly to `src/styles/tokens.css`. No modifications.

- [ ] **Step 3: Copy base.css**

Read `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/styles/base.css` and copy it exactly to `src/styles/base.css`. No modifications.

- [ ] **Step 4: Create components.css with nav + theme toggle only**

Read The Margin's `components.css` lines 1-57 (the NAV and THEME TOGGLE sections). Copy those exactly into `src/styles/components.css`. Do NOT copy article, depth toggle, sidenote, or pipeline styles yet - those come in later tasks.

- [ ] **Step 5: Create global.css**

```css
@import './tokens.css';
@import './base.css';
@import './components.css';
```

- [ ] **Step 6: Verify fonts load**

```bash
ls -la public/fonts/
```

Should list 6 woff2 files.

- [ ] **Step 7: Commit**

```bash
git add public/fonts/ src/styles/
git commit -m "feat: copy design system from The Margin (tokens, base, fonts)"
```

---

### Task 3: Base Layout with Route-Aware Theme

**Files:**
- Create: `src/layouts/Base.astro`

**Reference:** Read `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/layouts/Base.astro` first.

- [ ] **Step 1: Create Base.astro**

Adapt The Margin's Base.astro with these changes:
1. Nav gets "The Margin" link in addition to name
2. Flash prevention script becomes route-aware
3. `import.meta.env.BASE_URL` references removed (base is `/` not a subpath)

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Nabil Fahim' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content={description}>
    <script is:inline>
        // Runs before render to prevent flash.
        // Priority: localStorage > route default > prefers-color-scheme
        // Profile (/) defaults dark, The Margin (/the-margin/) defaults light
        (function() {
            var saved = localStorage.getItem('theme');
            if (saved) {
                if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
                return;
            }
            var isMargin = window.location.pathname.startsWith('/the-margin');
            if (isMargin) {
                // The Margin defaults light - only go dark if OS prefers it
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                }
            } else {
                // Profile defaults dark - only go light if OS prefers it
                if (!window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                }
            }
        })();
    </script>
</head>
<body>
    <nav class="nav">
        <div class="nav-inner">
            <a href="/" class="nav-name">Nabil Fahim</a>
            <div class="nav-right">
                <a href="/the-margin/" class="nav-link">The Margin</a>
                <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
                    <svg class="theme-icon theme-icon--sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                    <svg class="theme-icon theme-icon--moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
    <slot />
    <script is:inline>
        document.getElementById('themeToggle').addEventListener('click', function() {
            var root = document.documentElement;
            root.classList.add('theme-transition');
            var isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            setTimeout(function() { root.classList.remove('theme-transition'); }, 250);
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
            }
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: Add nav-right and nav-link CSS to components.css**

Append to `src/styles/components.css`:

```css
.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-link {
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
}

.nav-link:hover {
    color: var(--accent);
}
```

- [ ] **Step 3: Verify dev server starts**

```bash
cd /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm
npm run dev
```

Open http://localhost:4321 - should see empty page with nav bar showing "Nabil Fahim" and "The Margin" link.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/styles/components.css
git commit -m "feat: Base layout with route-aware theme defaults"
```

---

### Task 4: Profile Page - Hero and Three-Column Grid

**Files:**
- Create: `src/layouts/Profile.astro`
- Create: `src/pages/index.astro`
- Modify: `src/styles/components.css` (add profile grid + hero styles)

**Reference:** Use `/frontend-design` skill for visual implementation quality.

- [ ] **Step 1: Add profile layout CSS to components.css**

Append to `src/styles/components.css`:

```css
/* ================================================================
   PROFILE - Three Column Grid
   ================================================================ */
.profile {
    max-width: var(--article-max);
    margin: 0 auto;
    padding: 48px 24px 120px;
}

.profile-grid {
    display: grid;
    grid-template-columns: var(--toggle-width) 1fr var(--margin-width);
    gap: 0;
    min-height: 80vh;
}

/* ================================================================
   PROFILE - Hero
   ================================================================ */
.profile-hero {
    margin-bottom: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--border);
}

.profile-hero h1 {
    font-family: var(--font-serif);
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1.2;
    margin-bottom: 12px;
}

.profile-descriptor {
    font-family: var(--font-serif);
    font-size: 19px;
    font-style: italic;
    color: var(--text-secondary);
    line-height: 1.55;
    margin-bottom: 20px;
}

.profile-link {
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--accent);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s ease;
}

.profile-link:hover {
    color: var(--accent-hover);
}

/* ================================================================
   PROFILE - Main Content Column
   ================================================================ */
.profile-main {
    padding: 0 40px;
    min-width: 0;
}

/* ================================================================
   PROFILE - Right Margin
   ================================================================ */
.profile-margin {
    padding-top: 24px;
    padding-left: 24px;
    border-left: 1px solid var(--border);
}
```

- [ ] **Step 2: Create Profile.astro layout**

```astro
---
import Base from './Base.astro';

interface Props {
    title: string;
}
const { title } = Astro.props;
---
<Base title={title}>
    <div class="profile">
        <div class="profile-grid">
            <slot name="nav" />
            <div class="profile-main">
                <slot />
            </div>
            <div class="profile-margin">
                <slot name="margin" />
            </div>
        </div>
    </div>
</Base>
```

- [ ] **Step 3: Create index.astro with hero**

```astro
---
import Profile from '../layouts/Profile.astro';
---
<Profile title="Nabil Fahim">

    <div slot="nav">
        <!-- SectionNav goes here in Task 5 -->
    </div>

    <!-- Hero -->
    <div class="profile-hero">
        <h1>Nabil Fahim</h1>
        <div class="profile-descriptor">Supply growth marketing at Booking.com. Building tools that find demand before it arrives.</div>
        <a href="/the-margin/" class="profile-link">Read The Margin &rarr;</a>
    </div>

    <!-- Career and Personal sections go here in Tasks 6-8 -->

    <div slot="margin">
        <div class="marginnote">Based in Amsterdam. Previously Dubai, Doha, London.</div>
    </div>

</Profile>
```

- [ ] **Step 4: Add margin note CSS**

Read The Margin's `components.css` and copy the `.marginnote` and `.marginnote-symbol` styles (lines ~367-389). Append to `src/styles/components.css`. Copy exact values.

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Open http://localhost:4321 - should see three-column layout with hero text, margin note on right. Dark mode by default.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/Profile.astro src/pages/index.astro src/styles/components.css
git commit -m "feat: profile page with three-column grid and hero section"
```

---

### Task 5: Section Nav Dots (Left Margin)

**Files:**
- Create: `src/components/SectionNav.astro`
- Modify: `src/styles/components.css` (add section nav styles)
- Modify: `src/pages/index.astro` (wire in component)

**Reference:** Read The Margin's depth toggle CSS (components.css lines ~211-289) for the exact visual treatment. The section nav mirrors this exactly but with different labels.

- [ ] **Step 1: Add section nav CSS**

Read The Margin's depth toggle styles and adapt for section nav. Append to `src/styles/components.css`:

```css
/* ================================================================
   SECTION NAV - Left Margin (mirrors The Margin's depth toggle)
   ================================================================ */
.section-nav {
    position: sticky;
    top: 80px;
    height: fit-content;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: calc(var(--toggle-width) - 34px);
    user-select: none;
}

.section-track {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0;
}

.section-track::before {
    content: '';
    position: absolute;
    top: 7px;
    bottom: 7px;
    right: 4px;
    width: 1.5px;
    background: var(--track-line);
    z-index: 0;
}

.section-stop {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    cursor: pointer;
    padding: 6px 0;
    border: none;
    background: none;
    font: inherit;
}

.section-stop:focus-visible .section-dot {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
}

.section-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 1.5px solid var(--track-line);
    background: var(--bg);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.section-stop.active .section-dot {
    border-color: var(--accent);
    background: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
    transform: scale(1.15);
}

.section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--track-line);
    margin-right: 7px;
    transition: color 0.25s ease;
    white-space: nowrap;
}

.section-stop.active .section-label { color: var(--accent); }
.section-stop:hover .section-label { color: var(--text-secondary); }
.section-stop:hover .section-dot { border-color: var(--text-secondary); }
```

- [ ] **Step 2: Create SectionNav.astro**

```astro
---
interface Props {
    sections: { id: string; label: string }[];
    activeId?: string;
}
const { sections, activeId = sections[0]?.id } = Astro.props;
---

<nav class="section-nav" aria-label="Page sections">
    <div class="section-track">
        {sections.map((section) => (
            <button
                class={`section-stop ${section.id === activeId ? 'active' : ''}`}
                data-section={section.id}
                aria-label={`Go to ${section.label}`}
            >
                <div class="section-dot"></div>
                <span class="section-label">{section.label}</span>
            </button>
        ))}
    </div>
</nav>
```

- [ ] **Step 3: Wire into index.astro**

Update the `<div slot="nav">` in `src/pages/index.astro`:

```astro
---
import Profile from '../layouts/Profile.astro';
import SectionNav from '../components/SectionNav.astro';
---
<Profile title="Nabil Fahim">

    <SectionNav
        slot="nav"
        sections={[
            { id: 'intro', label: 'nabil.fm' },
            { id: 'career', label: 'career' },
            { id: 'personal', label: 'off-duty' }
        ]}
        activeId="intro"
    />

    <!-- rest unchanged -->
```

- [ ] **Step 4: Verify in browser**

Three dots should appear in the left margin with horizontal labels. First dot active (accent blue with glow). Hover states should work.

- [ ] **Step 5: Commit**

```bash
git add src/components/SectionNav.astro src/pages/index.astro src/styles/components.css
git commit -m "feat: section nav dots in left margin (mirrors depth toggle)"
```

---

### Task 6: Career Section - Collapsed State

**Files:**
- Create: `src/components/CareerSection.astro`
- Modify: `src/styles/components.css` (add section card styles)
- Modify: `src/pages/index.astro` (add career section)

- [ ] **Step 1: Add section card CSS**

Append to `src/styles/components.css`:

```css
/* ================================================================
   SECTION CARDS - Expandable containers
   ================================================================ */
.section-header-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
}

.section-card {
    background: var(--expand-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
}

.section-card-header {
    padding: 24px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.section-card:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.section-card.expanded {
    border-color: var(--accent);
    box-shadow: 0 2px 12px var(--accent-glow);
}

.section-card-title {
    font-family: var(--font-serif);
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 8px;
}

.section-card-summary {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.6;
}

.section-card-hint {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-faint);
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.section-card-chevron {
    width: 7px;
    height: 7px;
    border-right: 1.5px solid var(--text-faint);
    border-bottom: 1.5px solid var(--text-faint);
    transform: rotate(-45deg);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card.expanded .section-card-chevron {
    transform: rotate(45deg);
}

.section-card.expanded .section-card-hint {
    color: var(--accent);
}

.section-card.expanded .section-card-chevron {
    border-color: var(--accent);
}

/* Expandable body */
.section-card-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card.expanded .section-card-body {
    max-height: 3000px;
    transition: max-height 0.6s cubic-bezier(0.25, 0, 0.2, 1);
}

.section-card-content {
    padding: 0 24px 24px;
    border-top: 1px solid var(--border);
}
```

- [ ] **Step 2: Create CareerSection.astro**

```astro
---
---

<div id="career" class="profile-section">
    <div class="section-header-label">Career</div>
    <div class="section-card" data-section-card="career">
        <div class="section-card-header">
            <div class="section-card-title">career.md</div>
            <div class="section-card-summary">Booking.com, Qatar Airways, flydubai, Emirates Holidays. Eight years across aviation and travel tech, from revenue management to marketing automation.</div>
            <div class="section-card-hint">
                <div class="section-card-chevron"></div>
                expand timeline
            </div>
        </div>
        <div class="section-card-body">
            <div class="section-card-content">
                <!-- Pipeline nodes added in Task 7 -->
                <p style="color: var(--text-secondary); font-style: italic;">Pipeline content goes here</p>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 3: Add to index.astro**

Import CareerSection and add it after the hero:

```astro
import CareerSection from '../components/CareerSection.astro';
```

```html
<!-- After hero div -->
<CareerSection />
```

- [ ] **Step 4: Verify collapsed card renders**

Should see a card with "career.md" title, summary text, and "expand timeline" hint. Not yet clickable.

- [ ] **Step 5: Commit**

```bash
git add src/components/CareerSection.astro src/pages/index.astro src/styles/components.css
git commit -m "feat: career section card (collapsed state)"
```

---

### Task 7: Career Section - Pipeline Expansion

**Files:**
- Create: `src/components/pipeline/PipelineNode.astro` (exact copy from The Margin)
- Create: `src/components/pipeline/PipelineConnector.astro` (exact copy from The Margin)
- Create: `src/components/pipeline/PipelineGapDivider.astro` (exact copy from The Margin)
- Modify: `src/styles/components.css` (add pipeline styles from The Margin)
- Modify: `src/components/CareerSection.astro` (add pipeline content)

**Reference:** Read each pipeline component and its CSS from The Margin. Copy exactly.

- [ ] **Step 1: Copy pipeline components**

```bash
mkdir -p /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/components/pipeline
cp /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/components/pipeline/PipelineNode.astro \
   /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/components/pipeline/
cp /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/components/pipeline/PipelineConnector.astro \
   /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/components/pipeline/
cp /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/components/pipeline/PipelineGapDivider.astro \
   /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/components/pipeline/
```

- [ ] **Step 2: Copy pipeline CSS from The Margin**

Read The Margin's `components.css` and copy these sections exactly to `src/styles/components.css`:
- `.pipeline-node` and all sub-classes (lines ~844-989)
- `.pipeline-detail`, `.pipeline-detail-label`, `.pipeline-detail-text` (lines ~990-1010)
- `.pipeline-code` and syntax classes (lines ~1012-1028)
- `.pipeline-tags`, `.pipeline-tag` (lines ~1031-1050)
- `.pipeline-field-list`, `.pipeline-field-item` (search for these in components.css)
- `.pipeline-status`, `.pipeline-status-dot` (search for these)
- `.pipeline-connector`, `.pipeline-connector-label` (lines ~1133-1148)
- `.pipeline-gap-divider` and sub-classes (lines ~1149-1178)
- `.pipeline-legend` if present

Do NOT retype. Read the source and copy verbatim.

- [ ] **Step 3: Update CareerSection.astro with career pipeline content**

Replace the placeholder in the section-card-content div:

```astro
---
import PipelineNode from './pipeline/PipelineNode.astro';
import PipelineConnector from './pipeline/PipelineConnector.astro';
---

<div id="career" class="profile-section">
    <div class="section-header-label">Career</div>
    <div class="section-card" data-section-card="career">
        <div class="section-card-header">
            <div class="section-card-title">career.md</div>
            <div class="section-card-summary">Booking.com, Qatar Airways, flydubai, Emirates Holidays. Eight years across aviation and travel tech, from revenue management to marketing automation.</div>
            <div class="section-card-hint">
                <div class="section-card-chevron"></div>
                expand timeline
            </div>
        </div>
        <div class="section-card-body">
            <div class="section-card-content">
                <div class="pipeline" style="margin-top: 16px;">

                    <PipelineNode step="2023 - present" title="Booking.com" subtitle="Supply Growth Marketing · Amsterdam" status="live" statusLabel="Current" id="booking" defaultOpen={false}>
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-label">What I Do</div>
                            <div class="pipeline-detail-text">
                                Lead Peaks 2026 - personalised supply growth campaigns for partners during their peak seasons. Building autonomous detection pipelines that find demand before campaigns are planned.
                            </div>
                        </div>
                    </PipelineNode>

                    <PipelineConnector label="Moved to Amsterdam" />

                    <PipelineNode step="2019 - 2023" title="Qatar Airways" subtitle="Revenue Management · Doha" id="qatar">
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-label">What I Did</div>
                            <div class="pipeline-detail-text">
                                Revenue optimisation across 180+ destinations. Learned that pricing is applied statistics and that good data infrastructure matters more than clever algorithms.
                            </div>
                        </div>
                    </PipelineNode>

                    <PipelineConnector label="Crossed to the airline side" />

                    <PipelineNode step="2017 - 2019" title="flydubai" subtitle="Commercial Analytics · Dubai" id="flydubai">
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-label">What I Did</div>
                            <div class="pipeline-detail-text">
                                Commercial analytics for a fast-growing LCC. Built reporting infrastructure and demand forecasting models.
                            </div>
                        </div>
                    </PipelineNode>

                    <PipelineConnector label="Started in aviation" />

                    <PipelineNode step="2015 - 2017" title="Emirates Holidays" subtitle="Marketing · Dubai" id="emirates">
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-label">What I Did</div>
                            <div class="pipeline-detail-text">
                                First role in travel. Campaign management and marketing analytics for the package holidays division.
                            </div>
                        </div>
                    </PipelineNode>

                </div>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 4: Add expand/collapse JS to index.astro**

Add at the bottom of `index.astro`, before closing the Profile tag:

```html
<script is:inline>
    // Section card accordion - one section at a time
    document.querySelectorAll('.section-card-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var card = header.closest('.section-card');
            var wasExpanded = card.classList.contains('expanded');

            // Collapse all cards (accordion)
            document.querySelectorAll('.section-card.expanded').forEach(function(c) {
                c.classList.remove('expanded');
            });

            // Toggle clicked card
            if (!wasExpanded) {
                card.classList.add('expanded');
            }
        });
    });

    // Pipeline node expand/collapse (reused from The Margin)
    document.querySelectorAll('.pipeline-node').forEach(function(node) {
        var header = node.querySelector('.pipeline-node-header');
        if (header) {
            header.addEventListener('click', function() {
                var wasActive = node.classList.contains('active');
                document.querySelectorAll('.pipeline-node.active').forEach(function(n) {
                    if (n !== node) n.classList.remove('active');
                });
                node.classList.toggle('active', !wasActive);
            });
        }
    });
</script>
```

- [ ] **Step 5: Verify expand/collapse in browser**

Click "career.md" card - should expand with height morph animation revealing the pipeline. Click individual pipeline nodes - should expand for detail. Click card again - should collapse.

- [ ] **Step 6: Commit**

```bash
git add src/components/pipeline/ src/components/CareerSection.astro src/pages/index.astro src/styles/components.css
git commit -m "feat: career pipeline with expandable nodes inside accordion card"
```

---

### Task 8: Gap Divider + Personal Section

**Files:**
- Create: `src/components/PersonalSection.astro`
- Modify: `src/pages/index.astro` (add gap divider + personal section)

- [ ] **Step 1: Create PersonalSection.astro**

```astro
---
import PipelineNode from './pipeline/PipelineNode.astro';
---

<div class="profile-gap-divider">
    <div class="profile-gap-line"></div>
    <div class="profile-gap-label">Off duty</div>
    <div class="profile-gap-line"></div>
</div>

<div id="personal" class="profile-section">
    <div class="section-header-label">Personal</div>
    <div class="section-card" data-section-card="personal">
        <div class="section-card-header">
            <div class="section-card-title">out-of-office.md</div>
            <div class="section-card-summary">Bass guitar, Formula 1, side projects, and whatever else doesn't fit in a job title.</div>
            <div class="section-card-hint">
                <div class="section-card-chevron"></div>
                expand
            </div>
        </div>
        <div class="section-card-body">
            <div class="section-card-content">
                <div class="pipeline" style="margin-top: 16px;">

                    <PipelineNode step="♫" title="Bass Guitar" id="bass" isGap={true}>
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-text">
                                Playing bass since university. Mostly funk, soul, and jazz. Still looking for a good amp in Amsterdam.
                            </div>
                        </div>
                    </PipelineNode>

                    <PipelineNode step="🏎" title="Formula 1" id="f1" isGap={true}>
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-text">
                                Lifelong fan. Data side of the sport is as interesting as the racing itself.
                            </div>
                        </div>
                    </PipelineNode>

                    <PipelineNode step="⌨" title="Side Projects" id="projects" isGap={true}>
                        <div class="pipeline-detail">
                            <div class="pipeline-detail-text">
                                Building things for the sake of building them. This site, weather dashboards, home automation, whatever scratches the itch.
                            </div>
                        </div>
                    </PipelineNode>

                </div>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 2: Add gap divider CSS**

Append to `src/styles/components.css`:

```css
/* ================================================================
   PROFILE - Gap Divider
   ================================================================ */
.profile-gap-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 48px 0;
}

.profile-gap-line {
    flex: 1;
    height: 1px;
    background: var(--border);
}

.profile-gap-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-faint);
}
```

- [ ] **Step 3: Add to index.astro**

Import PersonalSection and add after CareerSection:

```astro
import PersonalSection from '../components/PersonalSection.astro';
```

```html
<CareerSection />
<PersonalSection />
```

- [ ] **Step 4: Verify accordion works across both sections**

Click career - expands. Click personal - career collapses, personal expands. Personal nodes use dashed dots (isGap={true}).

- [ ] **Step 5: Commit**

```bash
git add src/components/PersonalSection.astro src/pages/index.astro src/styles/components.css
git commit -m "feat: personal section with gap divider and dashed pipeline nodes"
```

---

### Task 9: Section Nav Interactivity

**Files:**
- Modify: `src/pages/index.astro` (add section nav JS)

- [ ] **Step 1: Add section nav JavaScript**

Add to the existing `<script is:inline>` block in `index.astro`:

```js
// Section nav dot click -> scroll + expand
document.querySelectorAll('.section-stop').forEach(function(stop) {
    stop.addEventListener('click', function() {
        var sectionId = stop.getAttribute('data-section');
        var target = document.getElementById(sectionId);
        if (!target) {
            // 'intro' targets the hero
            if (sectionId === 'intro') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                updateActiveDot('intro');
                return;
            }
            return;
        }

        // Expand the section if it has a card
        var card = target.querySelector('.section-card');
        if (card && !card.classList.contains('expanded')) {
            // Collapse others first
            document.querySelectorAll('.section-card.expanded').forEach(function(c) {
                c.classList.remove('expanded');
            });
            card.classList.add('expanded');
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// IntersectionObserver - track which section is in view
function updateActiveDot(activeId) {
    document.querySelectorAll('.section-stop').forEach(function(stop) {
        if (stop.getAttribute('data-section') === activeId) {
            stop.classList.add('active');
        } else {
            stop.classList.remove('active');
        }
    });
}

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            updateActiveDot(entry.target.id);
        }
    });
}, { rootMargin: '-20% 0px -60% 0px' });

// Observe hero and sections
var hero = document.querySelector('.profile-hero');
if (hero) {
    hero.id = 'intro';
    observer.observe(hero);
}
document.querySelectorAll('.profile-section').forEach(function(section) {
    observer.observe(section);
});
```

- [ ] **Step 2: Verify in browser**

- Click "career" dot -> scrolls to career section and expands it, dot activates
- Click "nabil.fm" dot -> scrolls to top, dot activates
- Scroll manually -> active dot updates based on viewport position

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: section nav click-to-scroll and scroll-tracking via IntersectionObserver"
```

---

### Task 10: Contextual Margin Notes

**Files:**
- Modify: `src/pages/index.astro` (add margin notes)
- Modify: `src/styles/components.css` (margin note positioning)

- [ ] **Step 1: Add margin note groups**

Update the `slot="margin"` content in `index.astro` with contextual notes:

```html
<div slot="margin">
    <!-- Hero margin notes -->
    <div class="margin-group" data-for="intro">
        <div class="marginnote">Based in Amsterdam. Previously Dubai, Doha, London.</div>
    </div>

    <!-- Career margin notes -->
    <div class="margin-group" data-for="career">
        <div class="marginnote">The .md filenames are deliberate. Everything here is a living document.</div>
    </div>

    <!-- Personal margin notes -->
    <div class="margin-group" data-for="personal">
        <div class="marginnote">Still looking for a good bass amp in Amsterdam. Recommendations welcome.</div>
    </div>
</div>
```

- [ ] **Step 2: Add margin group CSS and JS for contextual display**

Append to `src/styles/components.css`:

```css
/* Margin note groups - show based on active section */
.margin-group {
    transition: opacity 0.3s ease;
}
```

Add JS to the existing script block to show/hide margin groups based on active section. When the active dot changes, show the matching margin group and hide others:

```js
// Contextual margin notes
function updateMarginNotes(activeId) {
    document.querySelectorAll('.margin-group').forEach(function(group) {
        var forSection = group.getAttribute('data-for');
        group.style.opacity = (forSection === activeId) ? '1' : '0.3';
    });
}

// Patch updateActiveDot to also update margin notes
var originalUpdateActiveDot = updateActiveDot;
updateActiveDot = function(activeId) {
    originalUpdateActiveDot(activeId);
    updateMarginNotes(activeId);
};

// Initial state
updateMarginNotes('intro');
```

- [ ] **Step 3: Verify in browser**

As you scroll or click section dots, the relevant margin notes should become fully visible while others fade.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/styles/components.css
git commit -m "feat: contextual margin notes that respond to active section"
```

---

### Task 11: The Margin Blog Scaffold

**Files:**
- Create: `src/pages/the-margin/index.astro`
- Copy: `src/components/PostCard.astro` (from The Margin)
- Modify: `src/styles/components.css` (add blog index styles)

**Reference:** Read The Margin's `src/pages/index.astro` and `src/components/PostCard.astro`.

- [ ] **Step 1: Copy PostCard component**

```bash
cp /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/components/PostCard.astro \
   /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/components/
```

Read the copied file and update any `import.meta.env.BASE_URL` references to use `/the-margin/` directly.

- [ ] **Step 2: Copy blog index CSS from The Margin**

Read The Margin's `components.css` and copy these sections to nabil-fm's `components.css`:
- `.page` (container styles)
- `.hero`, `.hero-label`, `.hero-title`, `.hero-subtitle`, `.hero-meta` (blog hero)
- `.tag` (tag pills)
- `.article-list`, `.article-list-header` (article list)
- `.article-item`, `.article-item-title`, `.article-item-desc`, `.article-item-meta` (article items)
- `.article-item--placeholder`, `.coming-soon` (placeholder entries)
- `.page-footer` (footer)

Copy exact values from the source.

- [ ] **Step 3: Create blog index page**

Create `src/pages/the-margin/index.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
---
<Base title="The Margin - Nabil Fahim">
    <div class="page">

        <div class="hero">
            <div class="hero-label">The Margin</div>
            <h1 class="hero-title">Writing</h1>
            <div class="hero-subtitle">Long-form thinking about data, marketing, and building things that work.</div>
        </div>

        <div class="article-list">
            <div class="article-list-header">All Writing</div>

            <PostCard
                title="How We Taught an AI Agent to Find Search Spikes"
                href="#"
                subtitle="Applying autonomous research patterns to production anomaly detection."
                date=""
                readingTime=""
                tags={["Detection", "Autoresearch"]}
                placeholder={true}
            />

            <PostCard
                title="Building a Seasonality Cockpit for 1,000 Cities"
                href="#"
                subtitle="Turning years of data into an interactive dashboard for understanding travel patterns."
                date=""
                readingTime=""
                tags={["Data Viz"]}
                placeholder={true}
            />
        </div>

        <div class="page-footer">
            <p><a href="/" style="color: var(--accent);">&larr; nabil.fm</a></p>
        </div>

    </div>
</Base>
```

Note: All entries are placeholders. No confidential content from the work version.

- [ ] **Step 4: Verify The Margin page**

Open http://localhost:4321/the-margin/ - should show blog index with placeholder entries. Should default to light mode (if no localStorage preference).

- [ ] **Step 5: Commit**

```bash
git add src/pages/the-margin/ src/components/PostCard.astro src/styles/components.css
git commit -m "feat: The Margin blog scaffold with placeholder entries"
```

---

### Task 12: Polish and Verify

**Files:**
- Possibly modify: any file that needs fixes

- [ ] **Step 1: Theme verification**

1. Clear localStorage: open DevTools > Application > Local Storage > delete `theme`
2. Visit `http://localhost:4321/` - should render in **dark mode**
3. Visit `http://localhost:4321/the-margin/` - should render in **light mode**
4. Toggle theme on profile - should persist to The Margin
5. Clear localStorage again - verify defaults restore

- [ ] **Step 2: Cross-check tokens**

Compare `src/styles/tokens.css` with The Margin's version:

```bash
diff /Users/nfahim/Desktop/Everything/Personal/web-apps-and-projects/nabil-fm/src/styles/tokens.css \
     /Users/nfahim/Desktop/Everything/Work/work-apps-and-projects/the-margin/src/styles/tokens.css
```

Should be identical. If not, copy The Margin's version.

- [ ] **Step 3: Verify pipeline animations**

- Click career card: height morph should be smooth (0.4s expand)
- Click career card again: collapse should be slightly slower (0.6s)
- Expand a pipeline node inside career: should animate
- Accordion: expanding personal collapses career smoothly

- [ ] **Step 4: Verify section nav**

- All three dots visible and sticky
- Click each dot: scrolls to correct section
- Scroll through page: active dot updates
- Labels are horizontal, dots on right, track line vertical

- [ ] **Step 5: Verify margin notes**

- Margin notes visible in right column
- Contextual: fade based on active section
- Spectral italic, text-secondary colour

- [ ] **Step 6: Build test**

```bash
npm run build
npm run preview
```

Verify the built site works at http://localhost:4321.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: polish pass - verify themes, animations, tokens match The Margin"
```

---

## Execution Notes

- **NEVER modify files in** `~/Desktop/Everything/Work/work-apps-and-projects/the-margin/` - read only
- **NEVER push to remote** without explicit user approval
- **Use /frontend-design skill** for Tasks 4-10 (visual implementation quality)
- **Use British English** throughout all content and code comments
- **Git email:** `84849635+NF63@users.noreply.github.com`
- **Design integrity:** After every CSS addition, verify values match The Margin's tokens.css and components.css exactly

---

## ADDENDUM: NPM Registry Safety

**CRITICAL:** The global `~/.npmrc` routes to Booking's JFrog Artifactory. Every personal project MUST have a local `.npmrc` that overrides the registry to public npm.

**Added to Task 1, before npm install:**

Create `.npmrc` in project root:

```
registry=https://registry.npmjs.org/
```

**Verification after every npm install:**

```bash
npm config get registry --location=project
# Must output: https://registry.npmjs.org/
```

This ensures zero Booking packages or registry access in the personal site build.
