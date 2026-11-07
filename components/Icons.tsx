const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const SearchIcon = () => (
  <svg {...base}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></svg>
);
export const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" /></svg>
);
export const BagIcon = () => (
  <svg {...base}><path d="M5.5 8h13l-1 11.5h-11z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>
);
export const ArrowIcon = ({ size = 16 }: { size?: number }) => (
  <svg {...base} width={size} height={size} strokeWidth={2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const PlusIcon = () => (
  <svg {...base} width={16} height={16} strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
);
export const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" /></svg>
);
export const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
    {Array.from({ length: 8 }).map((_, i) => (
      <ellipse key={i} cx="12" cy="5" rx="1.6" ry="3.6" transform={`rotate(${i * 45} 12 12)`} />
    ))}
    <circle cx="12" cy="12" r="2.2" />
  </svg>
);
