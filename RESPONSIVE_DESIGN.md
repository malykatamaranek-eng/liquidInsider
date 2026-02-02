# Responsive Design Guide

## Overview

LiquidInsider uses a mobile-first responsive design approach built with Tailwind CSS. This guide documents the responsive design patterns, utilities, and best practices used throughout the application.

## Breakpoints

The application uses Tailwind's standard breakpoints plus custom additions:

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `xs` | 475px | Extra small devices |
| `sm` | 640px | Small devices (phones) |
| `md` | 768px | Medium devices (tablets) |
| `lg` | 1024px | Large devices (desktops) |
| `xl` | 1280px | Extra large devices |
| `2xl` | 1536px | 2X large devices |
| `3xl` | 1920px | Ultra-wide displays |

## Custom Hooks

### useMediaQuery

A custom React hook for responsive breakpoints.

```typescript
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

// Custom query
const isMobile = useMediaQuery('(max-width: 768px)');

// Predefined hooks
const isMobile = useIsMobile();      // max-width: 639px
const isTablet = useIsTablet();      // 640px - 1023px
const isDesktop = useIsDesktop();    // min-width: 1024px
const isLarge = useIsLargeScreen();  // min-width: 1280px
const isXL = useIsXLScreen();        // min-width: 1536px
```

## Responsive Components

### ResponsiveContainer

Provides consistent responsive padding and max-width.

```tsx
import ResponsiveContainer from '@/components/ResponsiveContainer';

<ResponsiveContainer maxWidth="7xl" padding="md">
  <h1>Content</h1>
</ResponsiveContainer>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
- `padding`: 'none' | 'sm' | 'md' | 'lg'

### ResponsiveGrid

Flexible grid system with responsive column counts.

```tsx
import { ResponsiveGrid } from '@/components/ResponsiveContainer';

<ResponsiveGrid 
  cols={{ default: 1, sm: 2, md: 3, lg: 4 }}
  gap="md"
>
  {items.map(item => <GridItem key={item.id} />)}
</ResponsiveGrid>
```

### ResponsiveStack

Stacks items vertically on mobile, switches to horizontal on larger screens.

```tsx
import { ResponsiveStack } from '@/components/ResponsiveContainer';

<ResponsiveStack 
  direction="vertical"
  spacing="md"
  breakpoint="md"
>
  <div>Item 1</div>
  <div>Item 2</div>
</ResponsiveStack>
```

### ResponsiveTable

Wraps tables with horizontal scroll on mobile devices.

```tsx
import ResponsiveTable from '@/components/ResponsiveTable';

<ResponsiveTable>
  <table>
    {/* table content */}
  </table>
</ResponsiveTable>
```

## Utility Classes

### Touch Targets

Minimum touch target size for mobile devices (48x48px):

```html
<button className="touch-target">
  Click me
</button>
```

### Animations

```html
<!-- Fade in -->
<div className="animate-fade-in">Content</div>

<!-- Slide up -->
<div className="animate-slide-up">Content</div>

<!-- Slide down -->
<div className="animate-slide-down">Content</div>

<!-- Fade in with delay -->
<div className="animate-fade-in-delay">Content</div>
```

### Container Queries

```html
<div className="container-query">
  {/* Content adapts based on container width */}
</div>
```

## Common Patterns

### Responsive Navigation

```tsx
// Desktop navigation
<div className="hidden md:flex items-center space-x-8">
  <NavLink href="/products">Products</NavLink>
  <NavLink href="/cart">Cart</NavLink>
</div>

// Mobile menu
<div className="md:hidden">
  <MobileMenu />
</div>
```

### Responsive Grids

```html
<!-- Product grid -->
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  <!-- Items -->
</div>

<!-- Dashboard stats -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Stat cards -->
</div>
```

### Responsive Forms

```html
<!-- Two-column form on larger screens -->
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input type="text" placeholder="First Name" />
  <input type="text" placeholder="Last Name" />
</div>
```

### Responsive Typography

```html
<!-- Responsive heading sizes -->
<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
  Large Heading
</h1>

<!-- Responsive text alignment -->
<p className="text-center md:text-left">
  Paragraph text
</p>
```

## Print Styles

Print-friendly styles are automatically applied for orders and checkout pages:

```html
<!-- Hide in print -->
<button className="no-print">Action</button>

<!-- Print-specific container -->
<div className="print-container">
  <h1>Order Receipt</h1>
  <!-- Order details -->
</div>
```

## Best Practices

1. **Mobile-First**: Always start with mobile styles and add larger breakpoints as needed
2. **Touch Targets**: Ensure interactive elements are at least 48x48px on mobile
3. **Readable Text**: Maintain readable font sizes (minimum 16px on mobile)
4. **Consistent Spacing**: Use responsive padding/margin utilities
5. **Test on Real Devices**: Always test on actual mobile devices, not just browser dev tools
6. **Avoid Horizontal Scroll**: Ensure content doesn't cause horizontal scrolling on mobile
7. **Optimize Images**: Use responsive image sizes with `sizes` attribute

## Testing Responsive Design

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test various device sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1024px+)

### Responsive Checklist

- [ ] Navigation works on all screen sizes
- [ ] Forms are usable on mobile
- [ ] Tables scroll horizontally on mobile
- [ ] Images scale properly
- [ ] Touch targets are adequately sized
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling
- [ ] Print styles work correctly

## Examples

### Admin Table (Mobile-Responsive)

```tsx
<ResponsiveTable>
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 sm:px-6 sm:py-4">Product</th>
        <th className="hidden md:table-cell">Category</th>
        <th className="px-4 py-3">Price</th>
      </tr>
    </thead>
    <tbody>
      {products.map(product => (
        <tr key={product.id}>
          <td className="px-4 py-3 sm:px-6">{product.name}</td>
          <td className="hidden md:table-cell">{product.category}</td>
          <td className="px-4 py-3">${product.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
</ResponsiveTable>
```

### Hero Section

```tsx
<section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 lg:py-32">
  <ResponsiveContainer>
    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
      Welcome to LiquidInsider
    </h1>
    <p className="text-lg md:text-xl lg:text-2xl mb-8">
      Discover amazing products
    </p>
    <div className="flex flex-col sm:flex-row gap-4">
      <Button size="lg">Shop Now</Button>
      <Button variant="outline" size="lg">Learn More</Button>
    </div>
  </ResponsiveContainer>
</section>
```

## Support

For questions or issues related to responsive design, please open an issue on GitHub.
