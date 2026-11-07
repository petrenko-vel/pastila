export const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const img = (p: string) => base + p;
