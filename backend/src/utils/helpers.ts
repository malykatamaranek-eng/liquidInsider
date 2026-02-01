export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const calculateTax = (subtotal: number, taxRate: number = 0.08): number => {
  return Math.round(subtotal * taxRate * 100) / 100;
};

export const calculateShipping = (subtotal: number): number => {
  if (subtotal >= 100) return 0; // Free shipping over $100
  if (subtotal >= 50) return 5.99;
  return 9.99;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
