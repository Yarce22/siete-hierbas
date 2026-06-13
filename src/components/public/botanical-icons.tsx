export function LeafIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c0 0-8-4-8-11a8 8 0 0 1 16 0c0 7-8 11-8 11z" />
      <path d="M12 22V10" />
    </svg>
  );
}

export function HerbIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 12 7 10 6 6c3 0 6 2 6 6z" />
      <path d="M12 12C12 12 17 10 18 6c-3 0-6 2-6 6z" />
      <path d="M12 17C12 17 8 15 7 11c3 0 5 3 5 6z" />
      <path d="M12 17C12 17 16 15 17 11c-3 0-5 3-5 6z" />
    </svg>
  );
}

export function FlowerIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2c0 0-2 3-2 5s2 3 2 3 2-1 2-3-2-5-2-5z" />
      <path d="M12 22c0 0-2-3-2-5s2-3 2-3 2 1 2 3-2 5-2 5z" />
      <path d="M2 12c0 0 3-2 5-2s3 2 3 2-1 2-3 2-5-2-5-2z" />
      <path d="M22 12c0 0-3-2-5-2s-3 2-3 2 1 2 3 2 5-2 5-2z" />
      <path d="M5.6 5.6c0 0 1 3.4 2.8 4.6s3.6.4 3.6.4-.4-2-2.2-3.2-4.2-1.8-4.2-1.8z" />
      <path d="M18.4 18.4c0 0-1-3.4-2.8-4.6s-3.6-.4-3.6-.4.4 2 2.2 3.2 4.2 1.8 4.2 1.8z" />
      <path d="M18.4 5.6c0 0-3.4 1-4.6 2.8s-.4 3.6-.4 3.6 2-.4 3.2-2.2 1.8-4.2 1.8-4.2z" />
      <path d="M5.6 18.4c0 0 3.4-1 4.6-2.8s.4-3.6.4-3.6-2 .4-3.2 2.2-1.8 4.2-1.8 4.2z" />
    </svg>
  );
}

export function DropIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 2l7 10a7 7 0 1 1-14 0z" />
    </svg>
  );
}

export function MoonIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12,5 19,12 12,19" />
    </svg>
  );
}

export function getIconByName(name: string): React.ReactNode {
  switch (name) {
    case "flower": return <FlowerIcon size={28} />;
    case "drop":   return <DropIcon size={28} />;
    case "moon":   return <MoonIcon size={28} />;
    default:       return <LeafIcon size={28} />;
  }
}
