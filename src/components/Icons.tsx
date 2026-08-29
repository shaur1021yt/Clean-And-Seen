/* ─── PCAS SVG Icon Library ──────────────────────────────────────────────
   All icons: 24×24 viewBox, 2px stroke, stroke-linecap round,
   stroke-linejoin round, currentColor. Fill variants use the accent.
   ──────────────────────────────────────────────────────────────────────── */

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// ─── Logo ───────────────────────────────────────────────────────────────
export function Logo({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Water drop / soap bubble */}
      <path
        d="M24 4C24 4 8 22 8 30a16 16 0 0032 0C40 22 24 4 24 4z"
        stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Inner shine */}
      <path
        d="M18 30a8 8 0 008 6"
        stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"
      />
      {/* Highlight */}
      <ellipse cx="18" cy="24" rx="3" ry="4" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

// ─── Admin Sidebar ──────────────────────────────────────────────────────
export function IconDashboard({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

export function IconContent({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

export function IconImpact({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export function IconEvents({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function IconPartners({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function IconSettings({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export function IconUsers({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

export function IconGlobe({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function IconLogout({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ─── Public Page Icons ──────────────────────────────────────────────────
export function IconHygieneKit({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 18h28v22a3 3 0 01-3 3H13a3 3 0 01-3-3V18z" />
      <path d="M16 18v-4a8 8 0 0116 0v4" />
      <rect x="18" y="22" width="5" height="10" rx="1.5" strokeWidth="1.5" opacity="0.6" />
      <rect x="25" y="24" width="6" height="8" rx="2" strokeWidth="1.5" opacity="0.6" />
      <circle cx="36" cy="28" r="3" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

export function IconDonation({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 20l16-8 16 8" /><path d="M8 20v18l16 8 16-8V20" /><path d="M24 28v18" strokeWidth="1.5" opacity="0.5" />
      <path d="M8 20l16 8 16-8" />
      <path d="M21 10c0-2 2-3.5 3-2 1-1.5 3 0 3 2 0 3-3 5-3 5s-3-2-3-5z" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function IconVolunteer({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 32c2-4 5-6 8-6s4 2 4 4" /><path d="M36 32c-2-4-5-6-8-6s-4 2-4 4" />
      <path d="M20 20c0-3 2.5-5 4-3.5 1.5-1.5 4 0.5 4 3.5 0 4-4 7-4 7s-4-3-4-7z" />
      <circle cx="14" cy="16" r="1.5" fill="currentColor" opacity="0.3" stroke="none" />
      <circle cx="34" cy="14" r="1" fill="currentColor" opacity="0.2" stroke="none" />
    </svg>
  );
}

export function IconOutreach({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="24" cy="14" r="4" /><circle cx="12" cy="32" r="4" /><circle cx="36" cy="32" r="4" />
      <path d="M24 18v4l-8 6" strokeWidth="1.5" opacity="0.5" />
      <path d="M24 22l8 6" strokeWidth="1.5" opacity="0.5" />
      <path d="M16 32h12" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.2" stroke="none" />
    </svg>
  );
}

export function IconEmail({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function IconInstagram({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCalendar({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function IconStrength({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M28 8a6 6 0 016 6v4h4a2 2 0 012 2v16a2 2 0 01-2 2H10a2 2 0 01-2-2V20a2 2 0 012-2h4v-4a6 6 0 016-6z" />
      <path d="M18 20v-4a6 6 0 0112 0v4" strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="30" r="3" fill="currentColor" opacity="0.2" stroke="none" />
    </svg>
  );
}

export function IconBottle({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="17" y="22" width="14" height="20" rx="3" />
      <rect x="20" y="14" width="8" height="8" rx="2" />
      <path d="M21 30h6" strokeWidth="1.5" opacity="0.4" />
      <path d="M21 34h6" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

export function IconPartner({ className = '', size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="24" cy="14" r="5" /><circle cx="10" cy="34" r="5" /><circle cx="38" cy="34" r="5" />
      <path d="M24 19v5l-10 8" strokeWidth="1.5" opacity="0.5" />
      <path d="M24 24l10 8" strokeWidth="1.5" opacity="0.5" />
      <path d="M15 34h18" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

// ─── Utility Icons ───────────────────────────────────────────────────
export function IconLocation({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconClock({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function IconCrown({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4l3 12h14l3-12-5 4-5-4-5 4z" /><line x1="5" y1="20" x2="19" y2="20" /><line x1="5" y1="20" x2="7" y2="16" /><line x1="17" y1="20" x2="19" y2="16" />
    </svg>
  );
}

export function IconWrench({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export function IconLock({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export function IconBook({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

export function IconCheck({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconCheckCircle({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function IconSeedling({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22V10" /><path d="M6 8c0-3 2.5-6 6-6 3.5 0 6 3 6 6" /><path d="M4 14c0-2 1.5-4 4-4" />
    </svg>
  );
}

export function IconSchool({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 10l10-6 10 6-10 6z" /><path d="M6 12v5c0 0 2.5 3 6 3s6-3 6-3v-5" />
    </svg>
  );
}

export function IconCelebration({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5.8 11.3L2 22l10.7-3.8" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="M22 2l-2.24.75a2.9 2.9 0 00-1.97 2.44l-.12.51" /><path d="M13.2 8.2L8.7 3.7" />
    </svg>
  );
}

// ─── Hygiene Kit Item Icons ──────────────────────────────────────────
export function IconToothbrush({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 4h2l1 4H6L7 4z" /><path d="M8 8v12" /><path d="M6.5 20h3" />
    </svg>
  );
}

export function IconFloss({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="7" y="3" width="10" height="18" rx="5" /><path d="M12 3v5" strokeWidth="1.5" />
    </svg>
  );
}

export function IconDeodorant({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="8" y="10" width="8" height="11" rx="2" /><path d="M10 10V7a2 2 0 014 0v3" /><path d="M9 14h6" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

export function IconDrop({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2.7c-4.5 5.4-7 8.6-7 11.3a7 7 0 0014 0c0-2.7-2.5-5.9-7-11.3z" />
    </svg>
  );
}

export function IconHands({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 11V7a5 5 0 0110 0v4" /><path d="M3 11h4v6a2 2 0 002 2h6a2 2 0 002-2v-6h4" />
    </svg>
  );
}

export function IconBandage({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2l4 4-8 8-4-4 8-8z" /><path d="M2 22l4-4" /><circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRazor({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 2l-4 4v4l4 4" /><path d="M2 6h16" /><path d="M6 2v20" /><path d="M18 2l4 4v4l-4 4" />
    </svg>
  );
}

export function IconComb({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="8" width="16" height="12" rx="2" /><path d="M8 8V4" /><path d="M12 8V4" /><path d="M16 8V4" />
    </svg>
  );
}

export function IconBaby({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPlane({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

export function IconSocks({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 3h6v8l-2 2v8H9v-8l-2-2V3z" /><path d="M9 3h6" strokeWidth="2.5" />
    </svg>
  );
}

export function IconSoap({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="8" width="16" height="12" rx="3" /><path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" /><circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}

export function IconShampoo({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="7" y="8" width="10" height="13" rx="2" /><path d="M10 8V5a2 2 0 014 0v3" />
    </svg>
  );
}

export function IconPreview({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconGallery({ className = '' }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
