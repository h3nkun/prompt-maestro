# Implementation Plan - Modern Responsive UI Redesign

## Objective
Redesign the "Refinador de Prompts" application to match the provided reference image (dark, premium, clean UI) while ensuring full responsiveness across desktop and mobile devices.

## Design Decisions
1.  **Color Palette**:
    -   **Background**: Deep dark slate/blue (`#0f172a` or custom dark hex).
    -   **Surface**: Slightly lighter panels (`#1e293b`).
    -   **Accent**: Electric Blue (`#38bdf8` / `#0ea5e9`).
    -   **Text**: High contrast white for headings, muted slate for labels.
2.  **Typography**:
    -   Continue using 'Space Grotesk' for a modern, techy feel.
3.  **Layout & Responsiveness**:
    -   **Mobile**: Vertical stack (Single column), recreating the exact look of the screenshot.
    -   **Desktop**: Two-column layout.
        -   **Left Panel (Scrollable)**: Controls (Inputs, Selectors, Configuration).
        -   **Right Panel (Sticky)**: Preview, Generation Status, and Action Buttons.
4.  **Components**:
    -   **Reference Upload**: Dashed area, support for file preview.
    -   **Chips/Tags**: Rounded pills with active states (glow effects).
    -   **Aspect Ratio Selector**: Visual rectangles representing the ratios.
    -   **Sliders/Selects**: Custom styled inputs.

## File Changes

### 1. `tailwind.config.js`
-   Extend theme with custom colors (`brand`, `surface`, `background`).
-   Add animation keyframes if needed (fade-in, pulse).

### 2. `src/index.css`
-   Ensure base styles for dark mode are default.
-   Custom scrollbar styling for webkit.

### 3. `src/App.jsx`
-   **Structure**:
    -   Remove `max-w-md mx-auto` constraint on the main wrapper.
    -   Use `grid grid-cols-1 lg:grid-cols-12 gap-6`.
    -   **Header**: Full width.
    -   **Sidebar/Content (Cols 1-7)**: Input sections.
    -   **Preview/Sticky (Cols 8-12)**: Result and Copy actions.
-   **Styling**:
    -   Apply `backdrop-blur` and `border-white/10` for glassmorphism.
    -   Use `ring` utilities for focus states matching the accent color.

## Verification
-   Verify mobile view matches the "vertical card" aesthetic.
-   Verify desktop view utilizes screen real estate effectively.
