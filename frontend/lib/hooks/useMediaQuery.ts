'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoints
 * Usage: const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with undefined to prevent hydration mismatch
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    
    // Update state with current value
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // All modern browsers support addEventListener
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Predefined breakpoint hooks for common screen sizes
 */
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1280px)');
export const useIsXLScreen = () => useMediaQuery('(min-width: 1536px)');
