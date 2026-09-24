# SECORA Design System: "Invisible Protection"

This document outlines the design system extracted from the **Secora Cybersecurity Login Portal** (Stitch Project `projects/1425703117742613261`). The brand aesthetic is defined as **"Invisible Protection"**—modern minimalism with high data density, engineered for CISOs and senior security engineers.

---

## 1. Color Palette

The system operates in **Dark Mode** by default, using ink-like dark tones for surfaces to reduce eye strain, combined with a highly selective accent palette.

### Core Brand Colors
*   **Primary (Electric Blue):** `#3b82f6` (dim variant: `#adc6ff`). Reserved for critical actions, active states, focus indicator highlights, and successful security validations.
*   **Secondary (Subtle Violet):** `#8b5cf6` (dim variant: `#d0bcff`). Used sparingly for secondary status, glows, or high-level intelligence highlights.
*   **Background Canvas:** `#0a0a0c` (or system default `#131315`).
*   **Elevated Surfaces (Level 1 Container):** `#111118` (or system container `#201f21`).
*   **Alert / Threat State:** `#ffb4ab` (on-error: `#690005`, container: `#93000a`).

### Tonal Grayscale System (UI Tokens)
*   **Background:** `#131315`
*   **Surface:** `#131315`
*   **Surface Dim:** `#131315`
*   **Surface Bright:** `#39393b`
*   **Surface Container Lowest:** `#0e0e10`
*   **Surface Container Low:** `#1c1b1d`
*   **Surface Container:** `#201f21`
*   **Surface Container High:** `#2a2a2c`
*   **Surface Container Highest:** `#353437`
*   **On Surface:** `#e5e1e4`
*   **On Surface Variant:** `#c2c6d6`
*   **Outline / Border:** `#8c909f`
*   **Outline Variant / Subtle Border:** `#424754`

---

## 2. Typography & Fonts

A dual-font strategy balances technical precision with high readability.

### Font Families
*   **Headings / Technical Labels:** `Geist` (clean, technical, slightly condensed sans-serif).
*   **Body Copy / Long-form Text:** `Inter` (neutral, legible sans-serif).
*   **Data / Hashes / Logs:** `Geist` (under the `mono-data` specification).

### Typography Scale (Font Sizes & Weights)
| Style Name | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **display-lg** | Geist | 48px | 600 (Semibold) | 56px | `-0.02em` |
| **headline-lg** | Geist | 32px | 600 (Semibold) | 40px | `-0.01em` |
| **headline-lg-mobile** | Geist | 24px | 600 (Semibold) | 32px | `-0.01em` |
| **title-md** | Geist | 20px | 500 (Medium) | 28px | `normal` |
| **body-lg** | Inter | 16px | 400 (Regular) | 24px | `normal` |
| **body-md** | Inter | 14px | 400 (Regular) | 20px | `normal` |
| **label-sm** | Geist | 12px | 500 (Medium) | 16px | `0.05em` |
| **mono-data** | Geist | 13px | 400 (Regular) | 18px | `normal` |

---

## 3. Layout & Spacing System

The layout relies on a fluid grid and consistent vertical spacing.

*   **Fluid Grid:** 12 columns for desktop, 8 columns for tablet, 4 columns for mobile.
*   **Base Spacing Unit:** 4px (`unit`).
*   **Gutter Width:** 16px (`gutter`).
*   **Container Padding:** 24px (`container-padding`).
*   **Section Gap:** 48px (`section-gap`).
*   **Standard Margin Utilities:**
    *   `margin-sm`: 16px
    *   `margin-md`: 32px
    *   `margin-lg`: 64px

---

## 4. UI Layout & Component Styles

### Sidebar Dimensions
*   **Width:** Fixed at 72 units (288px) -> Tailwind class `w-72`.
*   **Height:** Fixed at full height (`h-full` / `min-h-screen`).
*   **Background:** Level 1 surface container (`#111118` or `#201f21`).
*   **Border:** 1px solid right border (`border-r border-outline-variant`).

### Header Dimensions
*   **Height:** Fixed at 16 units (64px) -> Tailwind class `h-16`.
*   **Background:** Semi-transparent surface with backdrop blur (`bg-surface/90 backdrop-blur-md`).
*   **Border:** 1px solid bottom border (`border-b border-outline-variant`).

### Grid Background (Blueprint Effect)
The background features a visible technical grid overlay:
*   **Pattern 1 (Dense):** Linear gradient repeating grid pattern of 32px x 32px:
    ```css
    background-image: linear-gradient(to right, #424754 1px, transparent 1px),
                      linear-gradient(to bottom, #424754 1px, transparent 1px);
    background-size: 32px 32px;
    ```
*   **Pattern 2 (Loose):** Linear gradient grid pattern of 80px x 80px:
    ```css
    background-image: linear-gradient(to right, #424754 1px, transparent 1px),
                      linear-gradient(to bottom, #424754 1px, transparent 1px);
    background-size: 80px 80px;
    ```

### Border Styles
*   No heavy drop shadows or glows. Hierarchy is defined by **Tonal Containment** and **Hairline Outlines**.
*   **Default Border:** 1px solid `border-outline-variant` (`#424754` in dark mode).
*   **Focus State Border:** 1px solid Primary Electric Blue (`#3b82f6`) with a 2px outer glow at 15% opacity.

### Button Styles
*   **Primary Button:**
    *   Solid Electric Blue (`#3b82f6`) fill.
    *   Text: White, uppercase tracking `[0.1em]`, `font-label-caps` (`label-sm`).
    *   Corner Radius: 8px (`rounded-md`).
    *   Hover State: Background transitions to Secondary Violet (`#8b5cf6`) or brightens slightly.
*   **Secondary / Ghost Button:**
    *   Transparent background.
    *   Border: 1px solid Outline Variant (`#424754`).
    *   Hover State: Border transitions to Primary Electric Blue (`#3b82f6`).

### Card Styles
*   **Radius:** 8px (`rounded-md` / `0.5rem`).
*   **Background:** Elevated container Level 1 (`#111118` / `#201f21`).
*   **Border:** 1px solid Outline Variant (`#424754`).
*   **Header Separation:** A thin horizontal divider (`border-b border-outline-variant/30`) separating the card title from the content.
*   **Shadows:** Shadows are omitted (`shadow-none`) for clean brutalist execution.

### Active Navigation States
*   **Active Link:**
    *   Background: Primary Electric Blue (`#3b82f6`) or Secondary Container (`#571bc1`).
    *   Text Color: High contrast (`#ffffff`).
*   **Inactive / Hover Nav Link:**
    *   Color: On Surface Variant (`#c2c6d6`).
    *   Hover state: Background changes to Surface Container High (`#2a2a2c`) and text color shifts to On Surface (`#e5e1e4`).

### Heading Styles
*   Headings use the condensed `Geist` font family with negative tracking for a locked-in look.
*   **Section Headers:** Accompanied by a `label-sm` technical index block (e.g. `[ SECORA / RECONNAISSANCE / 02 ]`) and a leading 6px colored dot indicator.
