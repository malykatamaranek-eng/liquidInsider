'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

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
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
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
  const baseClass = 'flex';
  const directionClass =
    direction === 'vertical'
      ? `flex-col ${breakpoint}:flex-row`
      : `flex-row ${breakpoint}:flex-col`;

  return (
    <div className={cn(baseClass, directionClass, spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}
