'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// Predefined classes that Tailwind can detect
const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-2 sm:px-4',
  md: 'px-4 sm:px-6 lg:px-8',
  lg: 'px-6 sm:px-8 lg:px-12',
};

/**
 * Responsive Container Component
 * Provides consistent responsive padding and max-width across the application
 */
export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '7xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

// Predefined grid column classes for Tailwind purge
const gridColClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  'sm-1': 'sm:grid-cols-1',
  'sm-2': 'sm:grid-cols-2',
  'sm-3': 'sm:grid-cols-3',
  'sm-4': 'sm:grid-cols-4',
  'sm-5': 'sm:grid-cols-5',
  'sm-6': 'sm:grid-cols-6',
  'md-1': 'md:grid-cols-1',
  'md-2': 'md:grid-cols-2',
  'md-3': 'md:grid-cols-3',
  'md-4': 'md:grid-cols-4',
  'md-5': 'md:grid-cols-5',
  'md-6': 'md:grid-cols-6',
  'lg-1': 'lg:grid-cols-1',
  'lg-2': 'lg:grid-cols-2',
  'lg-3': 'lg:grid-cols-3',
  'lg-4': 'lg:grid-cols-4',
  'lg-5': 'lg:grid-cols-5',
  'lg-6': 'lg:grid-cols-6',
  'xl-1': 'xl:grid-cols-1',
  'xl-2': 'xl:grid-cols-2',
  'xl-3': 'xl:grid-cols-3',
  'xl-4': 'xl:grid-cols-4',
  'xl-5': 'xl:grid-cols-5',
  'xl-6': 'xl:grid-cols-6',
  '2xl-1': '2xl:grid-cols-1',
  '2xl-2': '2xl:grid-cols-2',
  '2xl-3': '2xl:grid-cols-3',
  '2xl-4': '2xl:grid-cols-4',
  '2xl-5': '2xl:grid-cols-5',
  '2xl-6': '2xl:grid-cols-6',
};

/**
 * Responsive Grid Component
 * Provides a flexible grid system with responsive column counts
 */
export function ResponsiveGrid({
  children,
  className = '',
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gridCols = [
    cols.default && gridColClasses[String(cols.default)],
    cols.sm && gridColClasses[`sm-${cols.sm}`],
    cols.md && gridColClasses[`md-${cols.md}`],
    cols.lg && gridColClasses[`lg-${cols.lg}`],
    cols.xl && gridColClasses[`xl-${cols.xl}`],
    cols['2xl'] && gridColClasses[`2xl-${cols['2xl']}`],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('grid', gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

const spacingClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

// Predefined direction classes
const directionClasses = {
  vertical: {
    sm: 'flex-col sm:flex-row',
    md: 'flex-col md:flex-row',
    lg: 'flex-col lg:flex-row',
    xl: 'flex-col xl:flex-row',
  },
  horizontal: {
    sm: 'flex-row sm:flex-col',
    md: 'flex-row md:flex-col',
    lg: 'flex-row lg:flex-col',
    xl: 'flex-row xl:flex-col',
  },
};

/**
 * Responsive Stack Component
 * Stacks items vertically on mobile, can switch to horizontal on larger screens
 */
export function ResponsiveStack({
  children,
  className = '',
  direction = 'vertical',
  spacing = 'md',
  breakpoint = 'md',
}: ResponsiveStackProps) {
  const directionClass = directionClasses[direction][breakpoint];

  return (
    <div className={cn('flex', directionClass, spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}
