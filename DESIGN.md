---
name: Identidad Digital Institucional
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#434750'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#737781'
  outline-variant: '#c3c6d1'
  surface-tint: '#335f9c'
  primary: '#002752'
  on-primary: '#ffffff'
  primary-container: '#003d79'
  on-primary-container: '#80aaec'
  inverse-primary: '#a8c8ff'
  secondary: '#7a5900'
  on-secondary: '#ffffff'
  secondary-container: '#fec33b'
  on-secondary-container: '#6f5100'
  tertiary: '#372402'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f3a14'
  on-tertiary-container: '#c3a475'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#134783'
  secondary-fixed: '#ffdea1'
  secondary-fixed-dim: '#f7bd35'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#ffdead'
  tertiary-fixed-dim: '#e3c290'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#59431c'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  display-lg:
    fontFamily: Libre Franklin
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Franklin
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Franklin
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Libre Franklin
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Libre Franklin
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Libre Franklin
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Libre Franklin
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Libre Franklin
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  baseline: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

The design system establishes a digital identity for UNAM that balances historical prestige with contemporary functionalism. It is built to serve a diverse academic community, emphasizing authority, accessibility, and clarity.

The visual style is **Corporate / Modern**, characterized by a rigorous adherence to hierarchy and the strategic use of institutional colors. By evolving the current map-based interface, the design system transitions toward a more structured, high-contrast environment. It utilizes generous negative space to reduce cognitive load while maintaining the seriousness expected of Mexico's premier educational institution. The result is a professional digital ecosystem that feels stable, trustworthy, and technologically advanced.

## Colors

The palette is anchored by the traditional **Azul UNAM** and **Oro UNAM**. This color system prioritizes the primary blue for structural elements and navigation to ensure high readability and formal consistency.

*   **Primary (#003D79):** Used for headers, primary actions, and structural grounding.
*   **Secondary (#D59F0F):** Reserved for highlights, active states, and call-to-action accents that require visual distinction.
*   **Neutral (#F4F5F7):** A cool gray used for background surfaces and containers to maintain a clean, airy feel that deviates from pure white to reduce eye strain.
*   **High Contrast:** Text on light backgrounds should always utilize a dark slate or the primary blue to ensure WCAG 2.1 AAA compliance for institutional accessibility.

## Typography

This design system utilizes **Libre Franklin** (a highly legible, contemporary alternative to Helvetica/Arial) to provide a robust typographic scale. The system emphasizes "Roman" weights for body copy and "Bold" for institutional headings.

Hierarchy is established through tight line-heights for titles and generous spacing for body text to facilitate long-form reading in academic contexts. All labels and secondary metadata should utilize slightly increased letter spacing and a medium weight to maintain clarity at smaller scales.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop environments to maintain institutional order, transitioning to a fluid model for mobile devices.

*   **Desktop:** 12-column grid with a 1440px maximum width. Elements are aligned to a 4px baseline rhythm.
*   **Gutters:** A consistent 24px gutter ensures that complex data visualizations or map interfaces remain distinct from sidebars and content cards.
*   **Density:** Content-heavy sections (like "Numeralia") use a compact spacing scale, while landing pages and high-level navigation utilize expanded margins to create a premium, editorial feel.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Low-contrast Outlines** rather than aggressive shadows. This maintains the "clean and modern" requirement while providing enough depth for interactive elements.

*   **Base Surface:** Neutral background (#F4F5F7).
*   **Containers:** White (#FFFFFF) with a 1px solid border in a subtle gray (#E1E4E8).
*   **Active Elevation:** Only the most critical interactive elements (like the current map pop-over) receive a soft, diffused shadow (12% opacity primary blue) to simulate a gentle lift from the page.
*   **Overlays:** Scrims used for modals should use a semi-transparent version of the Primary Blue (opacity 40%) to keep the brand present even in focused states.

## Shapes

The shape language is defined by **Soft (0.25rem)** roundedness. This subtle curve moves away from the harshness of sharp corners while retaining the formal, architectural feel associated with the University's campus.

*   **Buttons & Inputs:** 0.25rem (4px) corner radius.
*   **Cards & Main Containers:** 0.5rem (8px) corner radius for a more prominent structural definition.
*   **Data Indicators:** Points on maps or status chips may use a fully rounded "pill" shape to contrast against the geometric grid.

## Components

### Buttons
*   **Primary:** Solid Primary Blue (#003D79) with white text. High contrast, 4px radius.
*   **Secondary:** Ghost style with Primary Blue border and text.
*   **Action:** Gold (#D59F0F) is used exclusively for "Highlight" actions or critical alerts to draw immediate attention.

### Input Fields
Clean, white backgrounds with a 1px border. Focus states transition the border to Primary Blue with a 2px thickness. Labels sit above the field in Label-MD typography.

### Cards
Cards are the primary container for academic modules. They feature a white background, a light border, and no shadow. The header of the card may optionally feature a top-border accent in Gold to denote specific categories (e.g., "Hitos" vs "Numeralia").

### Map Markers & Icons
Icons should be monolinear and geometric. Map markers use the institutional palette to categorize locations (Faculties in Blue, Services in Gold, Cultural spaces in Tertiary).

### Navigation Bar
A high-contrast bar using Primary Blue. Logos should be rendered in white or the institutional crest to maintain maximum prestige.