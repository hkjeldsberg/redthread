---
name: The Red Thread
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#56423f'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#89726e'
  outline-variant: '#ddc0bb'
  surface-tint: '#a03f31'
  primary: '#923528'
  on-primary: '#ffffff'
  primary-container: '#b24c3d'
  on-primary-container: '#ffeae6'
  inverse-primary: '#ffb4a8'
  secondary: '#605e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e6e2de'
  on-secondary-container: '#666461'
  tertiary: '#545454'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d6c6c'
  on-tertiary-container: '#f1eeee'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#81281c'
  secondary-fixed: '#e6e2de'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#484744'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 64px
  gutter: 16px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is anchored in **Nordic Minimalism**, prioritizing clarity, intentionality, and a quiet strength. It serves as a sophisticated companion for cycle tracking, moving away from gendered cliches toward a medical-grade, professional aesthetic. The brand personality is "The Calm Observer"—reliable, precise, and unobtrusive.

The visual narrative is driven by the concept of the "Red Thread"—a single, elegant line that weaves through the interface, connecting disparate data points into a cohesive story of health. The emotional response should be one of "Stille" (Stillness) and "Tillit" (Trust). High-quality whitespace is not treated as empty space but as a functional tool to reduce cognitive load and provide a sense of sanctuary.

## Colors

The palette is rooted in the Norwegian landscape, utilizing organic, earthy tones that feel grounded and mature.

*   **Deep Terracotta (#B24C3D):** The "Red Thread" itself. Used sparingly for critical path elements, active states, and the literal "thread" linework. It represents life and vitality without the sweetness of traditional pinks.
*   **Soft Linen (#F9F5F1):** The primary canvas. This off-white reduces eye strain and provides a warmer, more human backdrop than pure white, evoking the texture of high-quality paper.
*   **Charcoal (#2D2D2D):** Used for primary typography and structural elements to ensure high contrast and a "medical-grade" seriousness.
*   **Neutral Grey (#706F6C):** For secondary information and de-emphasized UI elements.

## Typography

The typography uses **Inter**, a highly legible, systematic sans-serif that reinforces the professional, data-centric nature of the application. 

The scale relies on generous line heights to maintain the "Nordic" sense of breathability. Headlines utilize a slightly tighter letter spacing and medium weights to appear authoritative. Display sizes use a light weight (`300`) to emphasize elegance. Label styles are set in uppercase with increased letter spacing to serve as clear anchors for data visualization and navigation without being loud.

## Layout & Spacing

This design system employs a **fluid grid** with an emphasis on "negative space as a feature." 

*   **Mobile:** A 4-column grid with 24px side margins. The vertical rhythm is strict, using an 8px base unit. 
*   **Desktop/Tablet:** A 12-column grid centered within a max-width container of 1200px. Margins increase to 64px to maintain the minimalist aesthetic on larger screens.
*   **Rhythm:** Vertical spacing between sections should be aggressive (`stack-lg`) to ensure the user never feels overwhelmed by data. Information density should be kept low to medium.

## Elevation & Depth

Depth is conveyed through **low-contrast outlines** and **tonal layering** rather than traditional shadows. This maintains a flat, modernist aesthetic.

*   **Tiers:** Surfaces are differentiated by slight shifts in background color (e.g., Linen to a slightly darker "Stone" tint) rather than elevation.
*   **Outlines:** Elements like cards use a subtle 1px border in a darkened version of the Linen color. 
*   **Glassmorphism:** Reserved exclusively for navigation bars and overlays to maintain context of the "thread" underneath, using a high-blur (20px+) backdrop filter.
*   **The Thread:** The primary "Red Thread" line always sits on the highest logical layer, appearing to float slightly above the data it connects.

## Shapes

Shapes follow the "Soft" (`1`) logic. While minimalism often leans toward sharp corners, a slight 4px radius (`rounded`) is applied to buttons and containers to make the "medical" data feel more approachable and less clinical. 

Data visualization elements (bars, markers) should remain sharp or use minimal rounding to maintain a precise, scientific appearance. Circles are used exclusively for date markers and phase indicators to symbolize the cyclical nature of the subject matter.

## Components

*   **The Red Thread (Signature Component):** A 1.5pt vector line in Deep Terracotta that connects daily logs. It is not always straight; it curves gently between data points, symbolizing the natural fluctuations of a cycle.
*   **Buttons:** Primary buttons are Solid Charcoal with Linen text. Secondary buttons use a Charcoal outline. Action-oriented links use Deep Terracotta with an underline.
*   **Input Fields:** Minimalist under-lined inputs rather than boxed fields. The active state is indicated by the line turning into the Deep Terracotta "thread."
*   **Cards:** Non-elevated. Defined by a 1px Soft Linen border or a subtle background tint. Used for grouping daily insights.
*   **Chips/Tags:** Small, pill-shaped markers used for symptoms. Neutral backgrounds with Charcoal text; active states use Deep Terracotta text with a Soft Linen background.
*   **Cycle Dial:** A large, thin-stroked circular graphic representing the monthly cycle. It uses the signature linework to indicate the current position, avoiding chunky segments or heavy fills.