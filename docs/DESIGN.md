---
name: Terminal Obsidian
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#c8c6c9'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e4e1e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  mono-metric:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.02em
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an ultra-precise, surgical, and hyper-focused engineering aesthetic built for high-stakes technical interview preparation. It rejects generic "AI SaaS" tropes—there are no neon blue blurred gradients, no cartoonish illustrations, and no decorative clutter. 

The personality is authoritative, calm, and intellectually rigorous. It simulates the high-performance runtime of an advanced IDE merged with the restrained typography of high-end Swiss editorial design. Interactions feel low-latency, tactile, and engineered. The atmosphere inspires focused execution, high analytical bandwidth, and absolute command under pressure.

## Colors

The palette relies on a deep, light-absorbent obsidian base layered with fine zinc and slate tiers. 

- **Canvas & Base:** Deep Obsidian (`#09090B`) serves as the true foundation.
- **Surfaces & Tiers:** Primary cards rest on `#121215`, while interactive or floating elements elevate to Slate Zinc (`#18181B`).
- **Hairline Dividers & Outlines:** Low-contrast borders use `#27272A` and `rgba(255, 255, 255, 0.08)` to construct visible structural scaffolding without heavy lines.
- **Terminal Emerald (`#10B981`):** Reserved exclusively for semantic precision: live agent status, pass states, code execution progress, and high-tier metrics. It is paired with Emerald Glow (`#34D399`) solely for active state focal points.
- **Text Tiers:** Primary text is bright crisp white (`#FAFAFA`), secondary text drops to neutral zinc (`#A1A1AA`), and muted/code annotation text sits at `#71717A`.

## Typography

Typography establishes an editorial-engineering hierarchy. 

- **Display & Headlines:** Geist provides tight geometric proportion, clean vertical terminals, and surgical kerning for interview headers, track names, and problem statements.
- **Body:** Inter balances dense data screens and interview feedback with optimal reading comfort and high legibility at small sizes.
- **Monospace:** JetBrains Mono is strictly integrated for system telemetry: latency meters, session timers, Big-O complexity labels, test case inputs, and status badges.
- **Text Treatments:** All metadata labels (`label-caps`) must be rendered uppercase with expanded letter-spacing (`0.06em`) to establish crisp technical hierarchy against dense prose.

## Layout & Spacing

The layout is built on a tight 4px baseline sub-grid supporting an adaptable 12-column engineering console layout.

- **Grid Dynamics:** The workspace prioritizes side-by-side terminal splits: code execution canvas, problem briefing, and AI diagnostic feedback.
- **Breakpoints:**
  - **Desktop (≥ 1280px):** 12-column layout with 24px gutters, fixed-width side panels (e.g., telemetry rail at 320px), and flexible code/transcription zones.
  - **Tablet (768px – 1279px):** 8-column layout with 16px gutters; panels collapse into stacked, tabbed views.
  - **Mobile (< 768px):** 4-column layout with 16px margins; panels flow vertically into single-focus cards with quick-toggle bottom sheets for compiler and feedback metrics.
- **Density:** Spacing is disciplined; generous padding is avoided within interactive modules in favor of compact, high-information-density layouts.

## Elevation & Depth

This system avoids blurred colored drop shadows or dramatic ambient lighting. Elevation is rendered entirely through layered opacity, hairline structural borders, and subtle backdrop filtering.

- **Base Layer (Elevation 0):** Pure `#09090B`.
- **Card Tier (Elevation 1):** Solid `#121215` with a 1px continuous border of `rgba(255, 255, 255, 0.08)`.
- **Raised Interactive Surfaces (Elevation 2):** Background `#18181B` combined with a dual-line edge: a 1px outline of `#27272A` and an inner top hairline highlight of `rgba(255, 255, 255, 0.04)` to simulate a milled mechanical bevel.
- **Floating Overlays & Modals (Elevation 3):** Translucent `#121215` tinted with 85% opacity, supported by a `16px` backdrop-filter blur (`backdrop-filter: blur(16px)`), framed in `#27272A`.
- **Status Accents:** True depth around the Terminal Emerald accent is achieved via an ultra-tight, sharp 1px ring (`box-shadow: 0 0 0 1px #10B981`), completely devoid of diffuse neon bloom.

## Shapes

The design uses a deliberate contrast between structured, low-radius containers and sleek, pill-shaped interactive triggers:

- **Structural Surfaces (Cards, Editors, Split-panes):** Built with tight, mechanical corners (`8px` / `0.5rem`) that maintain screen real-estate and reinforce an IDE feel.
- **Interactive Controls (Action Buttons, Filters, Badges, Chips):** Fully pill-shaped (`rounded-full` / `9999px`) to create an ergonomic, touchable contrast against the rectilinear grid.
- **Micro-indicators:** Exact circular geometries (`100%`) for status pings, terminal breadcrumbs, and live recording nodes.

## Components

### Buttons
- **Primary:** Pill-shaped, high-contrast crisp white background (`#FAFAFA`) with deep obsidian typography (`#09090B`), font weight 500. Hover state: `#E4E4E7`. Focus state: 2px offset outline using `#10B981`.
- **Secondary / Action:** Pill-shaped, `#18181B` background, 1px border of `rgba(255, 255, 255, 0.08)`, secondary text (`#A1A1AA`). Hover: text shifts to `#FAFAFA`, border changes to `#27272A`.
- **Terminal Execution (Special):** Pill-shaped, background `rgba(16, 185, 129, 0.1)`, 1px border of `#10B981`, text `#10B981`, leading live indicator dot.

### Chips & Telemetry Badges
- Pill-shaped with tight padding (`4px 10px`).
- Monospace font (`JetBrains Mono`, 11px, uppercase).
- Neutral variant: `#121215` background with `#27272A` border and `#71717A` text.
- Active/Live variant: `#10B981` at 10% opacity, emerald text, and an animated 6px green ping node.

### Input Fields & Code Editors
- Background `#121215`, border 1px `#27272A`, radius `8px`.
- Monospace or clean sans-serif text input, caret colored `#10B981`.
- Focus state: border shifts directly to `#10B981` without fuzzy ambient glow.
- Integrated accessory bars (e.g., runtime limits, memory metrics) docked inside the bottom border using hairline dividers.

### Cards & Analytical Panels
- Background `#121215`, border 1px `rgba(255, 255, 255, 0.08)`.
- Explicit panel headers with uppercase monospace category tags, a subtle horizontal 1px zinc separator, and right-aligned metric pins.
- No heavy outer shadows; layered depth relies strictly on panel borders.

### Checkboxes & Radios
- Size: 16x16px.
- Checkbox: 4px corner radius. Radio: 100% circular.
- Inactive: background `#121215`, border 1px `#27272A`.
- Selected: background `#10B981`, border `#10B981`, inner glyph in `#09090B`.

### Specialized Components
- **Voice / Audio Waveform Meter:** Pill-shaped container (`#18181B`), rendering discrete 2px-wide vertical bars in `#27272A`, dynamically filling to `#10B981` based on candidate speech cadence.
- **Latency & Complexity Pointers:** Compact inline key-value pairs utilizing JetBrains Mono (`O(N log N)`, `42ms`, `98.4% Accuracy`) styled in muted zinc with emerald metric values.