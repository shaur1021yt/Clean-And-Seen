'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface HomeContent {
  hero_title?: string;
  hero_subtitle?: string;
  hero_description?: string;
  mission?: string;
  tension_1?: string;
  tension_2?: string;
  tension_3?: string;
  tension_4?: string;
  response_1?: string;
  response_2?: string;
  response_3?: string;
  close_headline?: string;
  close_body?: string;
}

interface Stat {
  id: number;
  label: string;
  value: number;
  icon: string;
  sort_order: number;
}

export default function HomePage() {
  const [content, setContent] = useState<HomeContent>({});
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch('/api/content/home').then(r => r.json()).then(setContent);
    fetch('/api/stats').then(r => r.json()).then(setStats);
  }, []);

  useEffect(() => {
    // Always reset scroll to top when homepage mounts
    window.scrollTo(0, 0);

    const nav = document.querySelector('nav') || document.querySelector('header');
    const footer = document.querySelector('footer');
    if (nav) (nav as HTMLElement).style.display = 'none';
    if (footer) (footer as HTMLElement).style.display = 'none';

    const tryMount = () => {
      if (typeof window !== 'undefined' && (window as any).ScrollCraft) {
        (window as any).ScrollCraft.mount(document.body);
      } else {
        setTimeout(tryMount, 50);
      }
    };
    tryMount();

    // ─── Parallax: throttled to every-other-frame, single rAF ───
    let frameCount = 0;
    let mouseX = 0, mouseY = 0;
    let smoothMouseX = 0, smoothMouseY = 0;
    const root = document.documentElement;

    // Cache elements to avoid querySelector every frame
    const starsEl = root.querySelector('.pcas-stars') as HTMLElement | null;
    const orbsEl = root.querySelector('.pcas-orbs') as HTMLElement | null;
    const dotsEl = root.querySelector('.pcas-dots') as HTMLElement | null;
    const sphereEl = root.querySelector('.pcas-sphere') as HTMLElement | null;

    // Mouse tracking (desktop only)
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const isDesktop = window.matchMedia('(min-width: 861px) and (hover: hover)').matches;
    if (isDesktop) window.addEventListener('mousemove', onMouseMove, { passive: true });

    const tick = () => {
      frameCount++;
      // Only update every other frame for parallax (60fps → 30fps visual, halves GPU work)
      if (frameCount % 2 === 0) {
        // Smooth mouse interpolation
        smoothMouseX += (mouseX - smoothMouseX) * 0.08;
        smoothMouseY += (mouseY - smoothMouseY) * 0.08;

        const scrollY = window.scrollY;
        const mx = isDesktop ? smoothMouseX : 0;
        const my = isDesktop ? smoothMouseY : 0;

        // Use transform3d for GPU-accelerated compositing instead of individual properties
        // This avoids triggering style recalculation on the root element
        if (starsEl) {
          starsEl.style.transform = `translate3d(${scrollY * 0.015 + mx * 3}px, ${scrollY * -0.02 + my * 2}px, 0)`;
        }
        if (orbsEl) {
          orbsEl.style.transform = `translate3d(${scrollY * 0.06 + mx * 12}px, ${scrollY * -0.09 + my * 8}px, 0)`;
        }
        if (dotsEl) {
          dotsEl.style.transform = `translate3d(${scrollY * 0.035 + mx * 7}px, ${scrollY * -0.05 + my * 5}px, 0)`;
        }
        if (sphereEl) {
          // Sphere also needs to read --sc-p from ScrollCraft, so keep that one property on root
          sphereEl.style.transform = `scale(calc(0.4 + var(--sc-p, 0) * 1.8)) translate3d(${mx * 6}px, ${scrollY * -0.12 + my * -4}px, 0)`;
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          tick();
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial

    return () => {
      if (nav) (nav as HTMLElement).style.display = '';
      if (footer) (footer as HTMLElement).style.display = '';
      window.removeEventListener('scroll', onScroll);
      if (isDesktop) window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <Script src="/scrollcraft.js" strategy="beforeInteractive" />
      <link rel="stylesheet" href="/scrollcraft.css" />

      <style>{`
        /* ─── Brand Tokens ─────────────────────────────────────────────── */
        :root {
          --sc-canvas: #0C1524;
          --sc-surface: #12203A;
          --sc-ink: #F0F5FA;
          --sc-ink-soft: #8BA4C0;
          --sc-accent: #4A7FB5;
          --sc-accent-warm: #F5A623;
          --sc-accent-ink: #F0F5FA;
          --sc-accent-dim: rgba(74,127,181,0.08);
          --sc-font-display: "Archivo", system-ui, sans-serif;
          --sc-font-text: "Inter", "Geist", system-ui, sans-serif;
          --sc-font-mono: "JetBrains Mono", ui-monospace, monospace;
        }

        nav, footer.site-footer, footer { display: none !important; }

        /* ─── Starfield — reduced shadows, no animation ──────────────── */
        .pcas-stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          overflow: hidden;
          will-change: transform;
          /* transform set by JS parallax */
        }
        .pcas-stars::before, .pcas-stars::after {
          content: ''; position: absolute; width: 2px; height: 2px;
          border-radius: 50%; background: transparent;
        }
        /* Reduced from 20 to 12 shadows — cuts paint cost by ~40% */
        .pcas-stars::before {
          box-shadow:
            42vw 8vh rgba(255,255,255,0.6), 17vw 23vh rgba(255,255,255,0.3),
            83vw 12vh rgba(255,255,255,0.5), 61vw 31vh rgba(255,255,255,0.2),
            29vw 45vh rgba(255,255,255,0.4), 74vw 52vh rgba(255,255,255,0.3),
            55vw 67vh rgba(255,255,255,0.5), 12vw 78vh rgba(255,255,255,0.2),
            91vw 41vh rgba(255,255,255,0.4), 45vw 34vh rgba(74,127,181,0.5),
            23vw 92vh rgba(255,255,255,0.3), 56vw 4vh rgba(255,255,255,0.5);
        }
        /* Removed twinkle animation — stars are static dots, no need to repaint */
        .pcas-stars::after {
          width: 1px; height: 1px;
          box-shadow:
            15vw 11vh rgba(255,255,255,0.35), 48vw 28vh rgba(255,255,255,0.2),
            72vw 55vh rgba(255,255,255,0.3), 5vw 42vh rgba(255,255,255,0.15),
            89vw 19vh rgba(255,255,255,0.25), 34vw 76vh rgba(255,255,255,0.2),
            62vw 88vh rgba(255,255,255,0.3), 78vw 62vh rgba(255,255,255,0.25),
            44vw 51vh rgba(74,127,181,0.25), 93vw 71vh rgba(255,255,255,0.2),
            58vw 14vh rgba(255,255,255,0.3), 81vw 38vh rgba(255,255,255,0.2);
        }

        /* ─── Hero Zoom Logo — simplified, no rings ──────────────────── */
        .pcas-sphere {
          position: absolute;
          width: clamp(200px, 30vw, 400px);
          height: clamp(200px, 30vw, 400px);
          border-radius: 50%;
          pointer-events: none;
          opacity: calc(0.9 - var(--sc-p, 0) * 0.4);
          background: url('/logo-cropped.png') center center / contain no-repeat;
          filter: drop-shadow(0 0 20px rgba(74,127,181,0.3)) drop-shadow(0 0 40px rgba(74,127,181,0.15));
          will-change: transform;
          /* transform set by JS parallax — includes scale via --sc-p */
        }
        /* Single breathing glow ring instead of 3 separate elements */
        .pcas-sphere::before {
          content: '';
          position: absolute; inset: -25%;
          border-radius: 50%;
          border: 1px solid rgba(74,127,181,0.1);
          background: radial-gradient(circle, rgba(74,127,181,0.06) 0%, transparent 65%);
          animation: pcas-sphere-breathe 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pcas-sphere-breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.06); }
        }
        /* Removed ring2 and ring3 — 3 rings cost 3 GPU layers for invisible detail */

        /* ─── Orb animations — reduced blur, fewer orbs ──────────────── */
        .pcas-orbs {
          position: absolute; inset: 0; overflow: hidden;
          pointer-events: none; z-index: 0;
          will-change: transform;
          /* transform set by JS parallax */
        }
        .pcas-orb {
          position: absolute; border-radius: 50%;
          will-change: transform;
          /* Reduced blur from 80px to 25px — huge GPU savings */
        }
        /* Only 3 orbs instead of 5 (removed orb-4 and the transparent ring orb-5) */
        .pcas-orb--1 {
          width: clamp(240px, 32vw, 440px); height: clamp(240px, 32vw, 440px);
          top: 8%; left: -6%;
          background: radial-gradient(circle, rgba(74,127,181,0.10) 0%, transparent 70%);
          filter: blur(25px);
          animation: pcas-drift-1 32s ease-in-out infinite;
        }
        .pcas-orb--2 {
          width: clamp(180px, 22vw, 320px); height: clamp(180px, 22vw, 320px);
          top: 30%; right: -4%;
          background: radial-gradient(circle, rgba(43,87,151,0.08) 0%, transparent 68%);
          filter: blur(25px);
          animation: pcas-drift-2 38s ease-in-out infinite;
        }
        .pcas-orb--3 {
          width: clamp(120px, 16vw, 220px); height: clamp(120px, 16vw, 220px);
          bottom: 12%; left: 30%;
          background: radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%);
          filter: blur(25px);
          animation: pcas-drift-3 28s ease-in-out infinite;
        }
        @keyframes pcas-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4vw, 3vh) scale(1.04); }
          66% { transform: translate(-2vw, 6vh) scale(0.96); }
        }
        @keyframes pcas-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(-5vw, -4vh) scale(1.06); }
          65% { transform: translate(2vw, 5vh) scale(0.94); }
        }
        @keyframes pcas-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(6vw, -3vh) scale(1.08); }
          70% { transform: translate(-3vw, 4vh) scale(0.94); }
        }

        /* ─── Impact Burst ────────────────────────────────────────────── */
        .pcas-burst {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }
        .pcas-burst::before, .pcas-burst::after {
          content: ''; position: absolute;
          border-radius: 50%; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
        }
        .pcas-burst::before {
          width: clamp(300px, 50vw, 700px);
          height: clamp(300px, 50vw, 700px);
          background: radial-gradient(circle,
            rgba(74,127,181,0.12) 0%,
            rgba(74,127,181,0.04) 40%,
            transparent 65%);
          transform: translate(-50%, -50%) scale(calc(0.3 + var(--sc-p, 0) * 1.2));
          opacity: var(--sc-p, 0);
          transition: none;
        }
        .pcas-burst::after {
          width: clamp(200px, 35vw, 500px);
          height: clamp(200px, 35vw, 500px);
          background: radial-gradient(circle,
            rgba(245,166,35,0.06) 0%,
            transparent 55%);
          transform: translate(-50%, -50%) scale(calc(0.5 + var(--sc-p, 0) * 0.8));
          opacity: calc(var(--sc-p, 0) * 0.7);
          transition: none;
        }

        /* ─── Floating Accent Dots — static, no animation ────────────── */
        .pcas-dots {
          position: fixed; inset: 0; pointer-events: none; z-index: 1;
          will-change: transform;
          /* transform set by JS parallax */
        }
        .pcas-dot {
          position: absolute; border-radius: 50%;
          background: var(--sc-accent);
          opacity: 0.06;
        }
        /* Reduced from 6 to 3, removed all animations */
        .pcas-dot--1 { width: 5px; height: 5px; top: 15%; left: 8%; }
        .pcas-dot--2 { width: 4px; height: 4px; top: 45%; right: 12%; }
        .pcas-dot--3 { width: 4px; height: 4px; bottom: 20%; left: 25%; }

        /* ─── Content Styles ──────────────────────────────────────────── */
        .pcas-label {
          font-family: var(--sc-font-mono); font-size: var(--sc-t-xs);
          letter-spacing: var(--sc-track-wide); text-transform: uppercase;
          color: var(--sc-accent);
        }
        .pcas-hero-title {
          font-family: var(--sc-font-display); font-weight: 800;
          font-size: clamp(3rem, 8vw, 8rem); line-height: 0.92;
          letter-spacing: -0.04em; color: var(--sc-ink);
          text-wrap: balance;
          text-shadow: 0 2px 40px rgba(0,0,0,0.3);
        }
        .pcas-hero-sub {
          font-size: var(--sc-t-xl); line-height: 1.45;
          color: var(--sc-ink-soft); max-width: 38ch;
          margin-top: var(--sc-5);
          text-shadow: 0 1px 20px rgba(0,0,0,0.2);
        }
        .pcas-stat-number {
          font-family: var(--sc-font-display); font-weight: 800;
          font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1;
          color: var(--sc-accent-warm); letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 2px 20px rgba(245,166,35,0.20);
        }
        .pcas-stat-label {
          font-family: var(--sc-font-mono); font-size: 11px;
          color: var(--sc-ink-soft); margin-top: var(--sc-3); max-width: 18ch;
          letter-spacing: var(--sc-track-wide); text-transform: uppercase;
          opacity: 0.7;
        }
        .pcas-prose {
          font-family: var(--sc-font-text); font-size: var(--sc-t-lg);
          line-height: 1.6; color: var(--sc-ink-soft); max-width: var(--sc-measure);
        }
        .pcas-prose strong { color: var(--sc-ink); font-weight: 600; }

        .pcas-cta {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.875rem 2.25rem; background: var(--sc-accent-warm);
          color: #142B54; font-family: var(--sc-font-display);
          font-weight: 700; font-size: var(--sc-t-base); border: none;
          border-radius: var(--sc-r-pill); cursor: pointer; text-decoration: none;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 16px rgba(245,166,35,0.25);
          transition: transform 200ms var(--sc-ease-out), box-shadow 250ms var(--sc-ease-out);
        }
        .pcas-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 40px rgba(245,166,35,0.40), 0 0 0 1px rgba(245,166,35,0.12); }
        .pcas-cta:active { transform: scale(0.97) translateY(-1px); }

        .pcas-cta-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.875rem 2.25rem; background: rgba(255,255,255,0.04);
          color: var(--sc-ink); font-family: var(--sc-font-display);
          font-weight: 600; font-size: var(--sc-t-base);
          border: 1.5px solid rgba(240,245,250,0.18);
          border-radius: var(--sc-r-pill); cursor: pointer; text-decoration: none;
          backdrop-filter: blur(8px);
          transition: border-color 200ms var(--sc-ease-out), background 200ms var(--sc-ease-out), transform 200ms var(--sc-ease-out);
        }
        .pcas-cta-ghost:hover {
          border-color: var(--sc-accent);
          background: rgba(74,127,181,0.10);
          transform: translateY(-2px);
        }

        .pcas-rail-item {
          flex: 0 0 clamp(16rem, 28vw, 24rem); padding: var(--sc-6) var(--sc-6) calc(var(--sc-6) + 3px);
          border-radius: var(--sc-r-lg); background: linear-gradient(165deg, rgba(18,32,58,0.95) 0%, rgba(14,25,41,0.98) 100%);
          border: 1px solid rgba(74,127,181,0.08);
          border-bottom: 2px solid transparent;
          background-clip: padding-box;
          position: relative;
          transition: border-color 250ms var(--sc-ease-out), box-shadow 300ms var(--sc-ease-out), transform 350ms var(--sc-ease-out);
        }
        .pcas-rail-item::after {
          content: '';
          position: absolute; bottom: -1px; left: 20%; right: 20%; height: 2px;
          background: linear-gradient(90deg, transparent, var(--sc-accent), transparent);
          opacity: 0; transition: opacity 250ms var(--sc-ease-out);
          border-radius: 1px;
        }
        .pcas-rail-item:hover {
          border-color: rgba(74,127,181,0.18);
          box-shadow: 0 12px 40px rgba(74,127,181,0.10), 0 2px 8px rgba(0,0,0,0.15);
          transform: translateY(-6px);
        }
        .pcas-rail-item:hover::after { opacity: 1; }
        .pcas-rail-item h3 {
          font-family: var(--sc-font-display); font-weight: 700;
          font-size: var(--sc-t-xl); color: var(--sc-ink); margin-bottom: var(--sc-3);
          letter-spacing: -0.01em;
        }
        .pcas-rail-item p {
          font-size: var(--sc-t-sm); color: var(--sc-ink-soft); line-height: 1.6;
        }
        .pcas-rail-icon {
          width: 52px; height: 52px; margin-bottom: var(--sc-5);
          background: rgba(74,127,181,0.08);
          border-radius: 14px; padding: 10px;
          border: 1px solid rgba(74,127,181,0.10);
        }
        .pcas-rail-icon svg { width: 100%; height: 100%; }

        /* Pan progress bar */
        .pcas-pan-progress {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: rgba(74,127,181,0.15);
          z-index: 10;
        }
        .pcas-pan-progress::after {
          content: ''; position: absolute; top: 0; left: 0; height: 100%;
          width: calc(var(--sc-p, 0) * 100%);
          background: var(--sc-accent);
          transition: none;
          border-radius: 0 1px 1px 0;
        }

        /* Rail scroll hint */
        .pcas-scroll-hint {
          position: absolute; left: 50%; bottom: calc(var(--sc-8) + 2px);
          transform: translateX(-50%);
          display: flex; align-items: center; gap: var(--sc-2);
          font-family: var(--sc-font-mono); font-size: 11px;
          color: var(--sc-ink-soft); letter-spacing: var(--sc-track-wide);
          opacity: 0.4;
        }
        .pcas-scroll-hint svg {
          width: 16px; height: 16px;
          animation: pcas-bounce-right 2.5s ease-in-out infinite;
        }
        @keyframes pcas-bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }

        .argument p {
          font-family: var(--sc-font-display); font-weight: 500;
          font-size: clamp(1.4rem, 3vw, 2.4rem); line-height: 1.35;
          color: var(--sc-ink); letter-spacing: var(--sc-track-snug); max-width: 32ch;
          text-shadow: 0 1px 12px rgba(0,0,0,0.15);
        }
        .argument p em { color: var(--sc-accent-warm); font-style: normal; font-weight: 600; }

        /* Section divider line */
        .pcas-divider {
          width: 60px; height: 2px;
          background: linear-gradient(to right, transparent, var(--sc-accent), transparent);
          margin: 0 auto var(--sc-6);
          opacity: 0.5;
        }

        .close-inner {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: var(--sc-6);
        }
        .pcas-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--sc-6); }

        /* ─── Content visibility — skip painting off-screen sections ── */
        .sc-section { content-visibility: auto; contain-intrinsic-size: auto 100vh; }

        /* ─── Responsive ──────────────────────────────────────────────── */
        @media (max-width: 860px) {
          .pcas-grid { grid-template-columns: 1fr; }
          .pcas-hero-title { font-size: clamp(2.2rem, 10vw, 3.5rem); }
          .argument p { font-size: clamp(1.1rem, 5vw, 1.6rem); }
          .pcas-rail-item { flex: 0 0 clamp(14rem, 75vw, 20rem); }
          .pcas-orb { transform: scale(0.6) !important; }
          .pcas-sphere { width: 180px !important; height: 180px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pcas-orb { animation: none !important; filter: blur(25px) !important; }
          .pcas-sphere::before { animation: none !important; }
        }
      `}</style>

      {/* Persistent layers (fixed behind everything) */}
      <div className="pcas-stars" aria-hidden="true" />
      <div className="pcas-dots" aria-hidden="true">
        <div className="pcas-dot pcas-dot--1" />
        <div className="pcas-dot pcas-dot--2" />
        <div className="pcas-dot pcas-dot--3" />
      </div>

      <div id="top">
        {/* ─── 1 · RECOGNITION ─── */}
        <section data-sc-act="pin" data-sc-span="2.5" data-sc-drift="#0D1626">
          <div data-sc-stage style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pcas-orbs" aria-hidden="true">
              <div className="pcas-orb pcas-orb--1" />
              <div className="pcas-orb pcas-orb--2" />
              <div className="pcas-orb pcas-orb--3" />
            </div>
            {/* Scroll-driven sphere — transform set by JS */}
            <div className="pcas-sphere" aria-hidden="true" />
            <div style={{ textAlign: 'center', padding: 'var(--sc-gutter)', position: 'relative', zIndex: 1 }}>
              <p className="pcas-label" data-sc-cue="0 0.85 0">Youth-Led Nonprofit · Bay Area</p>
              <h1 className="pcas-hero-title" data-sc-cue="0 0.85 0" data-sc-kinetic="lines" style={{ marginTop: 'var(--sc-5)' }}>
                {content.hero_title || 'Project Clean\u00A0&\u00A0Seen'}
              </h1>
              <p className="pcas-hero-sub" data-sc-cue="0.12 0.85" style={{ margin: 'var(--sc-5) auto 0' }}>
                {content.hero_subtitle || 'Advancing hygiene equity, one kit at a time.'}
              </p>
              <div data-sc-cue="0.25 0.85" style={{ marginTop: 'var(--sc-7)', display: 'flex', gap: 'var(--sc-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/get-involved" className="pcas-cta">Get Involved</a>
                <a href="/about" className="pcas-cta-ghost">Our Story</a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2 · TENSION ─── */}
        <section data-sc-act="pin" data-sc-span="2.8" data-sc-drift="#0E1929">
          <div data-sc-stage className="argument" style={{ display: 'flex', alignItems: 'center', padding: 'var(--sc-gutter)' }}>
            <div style={{ maxWidth: '32ch' }}>
              <p className="pcas-label" data-sc-cue="0 0.24 0" style={{ marginBottom: 'var(--sc-5)' }}>The Reality</p>
              <p data-sc-cue="0 0.32 0">{content.tension_1 || <>Soap. A toothbrush. <em>Deodorant.</em></>}</p>
              <p data-sc-cue="0.26 0.58">{content.tension_2 || 'Things most people never think twice about.'}</p>
              <p data-sc-cue="0.52 0.82">{content.tension_3 || <>But for millions facing <em>homelessness</em> and hardship, these basics are out of reach.</>}</p>
              <p data-sc-cue="0.76 1">{content.tension_4 || <>No one should have to choose between <em>food and soap.</em></>}</p>
            </div>
          </div>
        </section>

        {/* ─── 3 · TURN ─── */}
        <section data-sc-act="flow" data-sc-drift="#0F1C2E" className="sc-section">
          <div className="sc-wrap" style={{ maxWidth: '52rem' }}>
            <div data-sc-in data-sc-stagger="70">
              <p className="pcas-label" style={{ marginBottom: 'var(--sc-5)', opacity: 0.6 }}>Our Response</p>
              <h2 className="sc-display sc-display--lg" style={{ marginBottom: 'var(--sc-6)' }}>
                Born from the community, for the community.
              </h2>
              <p className="pcas-prose" style={{ marginBottom: 'var(--sc-5)' }}>
                {content.response_1 || <><strong>Project Clean & Seen</strong> was founded in November 2025 by young people in the Bay Area who saw a gap no one was filling. While shelters and nonprofits distributed food and clothing, <strong>hygiene products</strong> were consistently overlooked.</>}
              </p>
              <p className="pcas-prose" style={{ marginBottom: 'var(--sc-5)' }}>
                {content.response_2 || <>We are <strong>youth-led</strong>, community-driven, and focused on a single mission: making sure everyone has access to the basic necessities that preserve <strong>dignity and health.</strong></>}
              </p>
              <p className="pcas-prose">
                {content.response_3 || 'From assembling hygiene kits in living rooms to organizing donation drives across schools and shelters, we are building something that lasts.'}
              </p>
            </div>

            <figure data-sc-reveal="up" data-sc-reveal-at="0.12 0.58" style={{
              marginTop: 'var(--sc-9)', borderRadius: 'var(--sc-r-lg)', overflow: 'hidden',
              aspectRatio: '16 / 9',
              background: 'linear-gradient(135deg, #12203A 0%, #162642 40%, #101E32 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(74,127,181,0.06)',
            }}>
              <div style={{ textAlign: 'center', padding: 'var(--sc-6)' }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ display: 'block', margin: '0 auto var(--sc-4)' }}>
                  <rect x="8" y="34" width="24" height="14" rx="4" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                  <path d="M12 34V30a4 4 0 014-4h8a4 4 0 014 4v4" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                  <path d="M14 38h8" stroke="#4A7FB5" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <rect x="40" y="22" width="14" height="26" rx="3" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                  <rect x="43" y="16" width="8" height="6" rx="2" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                  <path d="M43 32h8" stroke="#4A7FB5" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  <path d="M30 14l6 18" stroke="#4A7FB5" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <rect x="28" y="10" width="5" height="8" rx="2" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                </svg>
                <span className="pcas-label" style={{ opacity: 0.6 }}>Hygiene Kits · Donation Drives · Community Outreach</span>
              </div>
            </figure>
          </div>
        </section>

        {/* ─── 4 · RANGE ─── */}
        <section data-sc-act="pan" data-sc-span="5.0" data-sc-drift="#111F34" style={{ position: 'relative' }}>
          <div data-sc-stage>
            <div style={{ padding: 'var(--sc-gutter)', paddingBottom: 'var(--sc-4)' }}>
              <p className="pcas-label" style={{ marginBottom: 'var(--sc-4)', opacity: 0.6 }}>What We Do</p>
              <h2 className="sc-display sc-display--md" style={{ maxWidth: '20ch' }}>Our Programs</h2>
            </div>

            <div className="rail" data-sc-pan="0.7" style={{ padding: '0 var(--sc-gutter)' }}>
              <div className="pcas-rail-item" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p className="pcas-label" style={{ marginBottom: 'var(--sc-3)' }}>What We Build</p>
                <p style={{ fontSize: 'var(--sc-t-lg)', color: 'var(--sc-ink)', lineHeight: 1.4 }}>
                  Four programs, each designed to close the gap between what people need and what they can access.
                </p>
              </div>
              <article className="pcas-rail-item">
                <div className="pcas-rail-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <path d="M10 18h28v22a3 3 0 01-3 3H13a3 3 0 01-3-3V18z" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                    <path d="M16 18v-4a8 8 0 0116 0v4" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <rect x="18" y="22" width="5" height="10" rx="1.5" stroke="#4A7FB5" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <rect x="25" y="24" width="6" height="8" rx="2" stroke="#4A7FB5" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <circle cx="36" cy="28" r="3" stroke="#4A7FB5" strokeWidth="1.5" fill="none" opacity="0.5" />
                  </svg>
                </div>
                <h3>Hygiene Kits</h3>
                <p>Complete kits assembled with care: soap, shampoo, toothbrush, toothpaste, deodorant, feminine products, and more. Every kit restores dignity.</p>
              </article>
              <article className="pcas-rail-item">
                <div className="pcas-rail-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <path d="M8 20l16-8 16 8" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 20v18l16 8 16-8V20" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinejoin="round" />
                    <path d="M24 28v18" stroke="#4A7FB5" strokeWidth="1.5" opacity="0.5" />
                    <path d="M8 20l16 8 16-8" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinejoin="round" />
                    <path d="M21 10c0-2 2-3.5 3-2 1-1.5 3 0 3 2 0 3-3 5-3 5s-3-2-3-5z" stroke="#4A7FB5" strokeWidth="1.5" fill="none" opacity="0.6" />
                  </svg>
                </div>
                <h3>Donation Drives</h3>
                <p>We organize collections at schools, shelters, and community centers, turning individual generosity into collective impact.</p>
              </article>
              <article className="pcas-rail-item">
                <div className="pcas-rail-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <path d="M12 32c2-4 5-6 8-6s4 2 4 4" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M36 32c-2-4-5-6-8-6s-4 2-4 4" stroke="#4A7FB5" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M20 20c0-3 2.5-5 4-3.5 1.5-1.5 4 0.5 4 3.5 0 4-4 7-4 7s-4-3-4-7z" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                    <circle cx="14" cy="16" r="1.5" fill="#4A7FB5" opacity="0.4" />
                    <circle cx="34" cy="14" r="1" fill="#4A7FB5" opacity="0.3" />
                  </svg>
                </div>
                <h3>Volunteering</h3>
                <p>From sorting donations to assembling kits to running events, volunteers are the backbone of everything we do.</p>
              </article>
              <article className="pcas-rail-item">
                <div className="pcas-rail-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="14" r="4" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="32" r="4" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                    <circle cx="36" cy="32" r="4" stroke="#4A7FB5" strokeWidth="2" fill="none" />
                    <path d="M24 18v4l-8 6" stroke="#4A7FB5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                    <path d="M24 22l8 6" stroke="#4A7FB5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
                    <path d="M16 32h12" stroke="#4A7FB5" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
                    <circle cx="24" cy="24" r="2" fill="#4A7FB5" opacity="0.3" />
                  </svg>
                </div>
                <h3>Community Outreach</h3>
                <p>Partnerships with nonprofits, schools, and organizations to reach people where they are, including supporting Stitchers On A Mission.</p>
              </article>
            </div>
            {/* Progress indicator */}
            <div className="pcas-pan-progress" aria-hidden="true" />
            <div className="pcas-scroll-hint" aria-hidden="true">
              <span>SCROLL</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </section>

        {/* ─── 5 · IMPACT (PEAK) ─── */}
        <section data-sc-act="pin" data-sc-span="2.8" data-sc-drift="#121E32">
          <div data-sc-stage style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pcas-burst" aria-hidden="true" />
            <div style={{ width: '100%', maxWidth: 'var(--sc-maxw)', padding: 'var(--sc-gutter)', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '80px', height: '2px', background: 'linear-gradient(to right, transparent, var(--sc-accent-warm), transparent)', margin: '0 auto var(--sc-6)', opacity: 0.5 }} data-sc-cue="0 0.15" />
              <p className="pcas-label" data-sc-cue="0 0.18 0" style={{ marginBottom: 'var(--sc-5)', opacity: 0.6, textAlign: 'center' }}>Our Impact</p>
              <h2 className="sc-display sc-display--md" data-sc-cue="0.04 0.92" style={{ marginBottom: 'var(--sc-8)', maxWidth: '20ch', textAlign: 'center', margin: '0 auto var(--sc-8)' }}>
                The numbers are real. And growing.
              </h2>
              <div className="pcas-grid" data-sc-cue="0.14 0.92" style={{ justifyItems: 'center' }}>
                {stats.length > 0 ? (
                  stats.slice(0, 6).map((stat, i) => (
                    <div key={stat.id} style={{ textAlign: 'center' }}>
                      <span
                        className="pcas-stat-number"
                        style={{ display: 'inline-block' }}
                      >{stat.value.toLocaleString()}</span>
                      <p className="pcas-stat-label">{stat.label}</p>
                    </div>
                  ))
                ) : (
                  [{ label: 'Loading...', value: 0 }].map((s, i) => (
                    <div key={i}>
                      <span className="pcas-stat-number">—</span>
                      <p className="pcas-stat-label">{s.label}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 6 · COMMITMENT (CLOSE) ─── */}
        <section id="join" data-sc-act="pin" data-sc-span="1.8" data-sc-drift="#0D1626">
          <div data-sc-stage data-sc-spotlight style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="close-inner" style={{ padding: 'var(--sc-gutter)', width: '100%', maxWidth: '42rem' }}>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, transparent, var(--sc-accent), transparent)', margin: '0 auto var(--sc-5)', opacity: 0.4 }} data-sc-cue="0.04" />
              <p className="pcas-label" data-sc-cue="0.06" style={{ marginBottom: 'var(--sc-3)', opacity: 0.6, textAlign: 'center' }}>Join Us</p>
              <h2 className="sc-display sc-display--lg" data-sc-cue="0.06" data-sc-kinetic="lines" style={{ textAlign: 'center' }}>
                {content.close_headline || <>Clean isn't a privilege. It's a right.</>}
              </h2>
              <p className="pcas-prose" data-sc-cue="0.12" style={{ textAlign: 'center', maxWidth: '38ch', margin: '0 auto' }}>
                {content.close_body || 'Whether you donate, volunteer, or partner with us, every action advances hygiene equity in our communities.'}
              </p>
              <div data-sc-cue="0.18" data-sc-rise="0" style={{ display: 'flex', gap: 'var(--sc-4)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 'var(--sc-4)' }}>
                <a href="/get-involved" className="pcas-cta" data-sc-magnet="0.28" data-sc-rise="0">Donate Now</a>
                <a href="/get-involved" className="pcas-cta-ghost" data-sc-rise="0">Become a Volunteer</a>
              </div>
              <div data-sc-cue="0.30" style={{ marginTop: 'var(--sc-9)', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--sc-t-xs)', color: 'var(--sc-ink-soft)', letterSpacing: 'var(--sc-track-wide)' }}>
                  @projectcleanseen · Bay Area, California
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
