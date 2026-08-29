'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  once?: boolean;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getTransform = () => {
      switch (direction) {
        case 'up': return 'translateY(40px)';
        case 'down': return 'translateY(-40px)';
        case 'left': return 'translateX(40px)';
        case 'right': return 'translateX(-40px)';
        case 'scale': return 'scale(0.92)';
        default: return 'translateY(40px)';
      }
    };

    // Set initial state
    el.style.opacity = '0';
    el.style.transform = getTransform();
    el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.style.opacity = '0';
          el.style.transform = getTransform();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* Stagger container — children animate in sequence */
export function StaggerGroup({
  children,
  className = '',
  baseDelay = 0,
  stagger = 80,
  direction = 'up' as const,
}: {
  children: ReactNode;
  className?: string;
  baseDelay?: number;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = container.querySelectorAll('[data-stagger]');

    items.forEach((el, i) => {
      const htmlEl = el as HTMLElement;
      const getTransform = () => {
        switch (direction) {
          case 'up': return 'translateY(30px)';
          case 'down': return 'translateY(-30px)';
          case 'left': return 'translateX(30px)';
          case 'right': return 'translateX(-30px)';
          case 'scale': return 'scale(0.9)';
          default: return 'translateY(30px)';
        }
      };

      htmlEl.style.opacity = '0';
      htmlEl.style.transform = getTransform();
      htmlEl.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * stagger}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((el) => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.opacity = '1';
            htmlEl.style.transform = 'translateY(0) translateX(0) scale(1)';
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [baseDelay, stagger, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
