# Design System - Card-Based UI

This project uses a modern card-based design system inspired by collection interfaces with clean visual hierarchy and smooth interactions.

## Design Principles

### 1. Visual Hierarchy
- **Clear information architecture** - Header → Card → Actions → Features
- **Progressive disclosure** - Essential info first, details on interaction
- **Consistent alignment** - Left-aligned text, centered key elements

### 2. Typography
- **Font Family**: System font stack for native feel
- **Weights**: 
  - Regular (400) - body text
  - Medium (500) - labels, secondary elements
  - Semi-bold (600) - card titles, buttons
  - Bold (700) - headings, stats
- **Sizes**:
  - Main title: 36px
  - Card title: 24px
  - Body text: 15px
  - Small text: 13-14px

### 3. Color Palette
```css
--bg: #f5f5f7          /* Light gray background */
--text: #1d1d1f        /* Dark gray/black text */
--text-secondary: #86868b  /* Medium gray for secondary text */
--border: #d2d2d7      /* Light gray borders */
--accent: #3b82f6      /* Blue accent */
--success: #10b981     /* Green success */
--error: #ef4444       /* Red error */
```

### 4. Cards
- **Shape**: Rounded corners (12-16px)
- **Shadow**: Layered shadows for depth
  - Small: `0 1px 3px rgba(0,0,0,0.05)`
  - Medium: `0 4px 12px rgba(0,0,0,0.08)`
  - Large: `0 8px 24px rgba(0,0,0,0.12)`
- **Padding**: 32px desktop, 24px mobile
- **Hover**: Subtle lift with enhanced shadow

### 5. Interactive Elements

#### Format Cards
- Radio input hidden, custom card selection
- Border changes to accent color when selected
- Checkmark appears in top-right corner
- Hover state with lift effect

#### Buttons
- Primary: Accent background with white text
- Success: Green background with white text
- Icon + text combination
- Smooth transitions (200ms ease)
- Lift on hover, press down on active

### 6. Spacing System
Based on 8px grid:
- Element gaps: 8-12px
- Section margins: 24-32px
- Card padding: 32px
- Major sections: 48-64px

### 7. Icons & Emojis
- SVG icons for UI elements (16-20px)
- Emoji icons for feature cards (32px)
- Consistent stroke width (1.5-2px)

### 8. Interactions
- **Smooth transitions**: 200-300ms ease-in-out
- **Micro-animations**: Hover lifts, button press
- **Loading states**: Spinning icon animation
- **Success feedback**: Auto-hide after 3 seconds

### 9. Responsive Design
Mobile breakpoint: 640px
- Reduce padding and margins
- Stack format cards vertically
- Adjust font sizes
- Maintain touch-friendly hit areas

## Components

### Main Card
The primary export interface with:
- Card header (title + description)
- URL input with icon label
- Format selection grid
- Export button
- Status messages

### Result Card
Success state display with:
- Success icon (checkmark in circle)
- Title and description
- Stats grid (messages + file size)
- Download button

### Feature Cards
Three-column grid showcasing:
- Emoji icon
- Feature title
- Short description
- Hover lift effect

## Color Usage

### Text Hierarchy
- Primary headings: `--text`
- Body text: `--text`
- Secondary/meta text: `--text-secondary`
- Labels: `--text`

### Backgrounds
- Page: `--bg`
- Cards: `--card-bg` (white)
- Inputs: `--input-bg` (white)
- Stats: `--bg` (light gray)

### Accents
- Primary actions: `--accent` (blue)
- Success states: `--success` (green)
- Error states: `--error` (red)
- Borders: `--border` (light gray)

## Best Practices

1. **Consistency** - Use design tokens (CSS variables) throughout
2. **Accessibility** - Maintain WCAG AA contrast ratios
3. **Performance** - Use CSS transforms for animations
4. **Responsiveness** - Mobile-first approach
5. **Polish** - Smooth transitions on all interactive elements

## File Structure

```
public/
├── index.html      # Semantic HTML structure
├── style.css       # Complete design system
└── app.js          # UI interactions
```

---

**Design Reference**: Based on card-based UI patterns with modern web aesthetics
**Status**: Production ready
**Last Updated**: 2024
