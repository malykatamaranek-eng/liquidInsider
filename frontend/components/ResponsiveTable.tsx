'use client';

import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive Table Component
 * Wraps tables with horizontal scroll on mobile devices
 */
export default function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <div className={`min-w-full ${className}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  label?: string; // For mobile label display
}

/**
 * Responsive Table Cell Component
 * Shows label on mobile devices for better readability
 */
export function ResponsiveTableCell({ children, className = '', label }: ResponsiveTableCellProps) {
  return (
    <td className={`px-4 py-3 sm:px-6 sm:py-4 ${className}`}>
      {label && (
        <span className="block sm:hidden font-medium text-gray-700 mb-1">
          {label}:
        </span>
      )}
      {children}
    </td>
  );
}
