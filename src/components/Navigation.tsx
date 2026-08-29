'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/impact', label: 'Impact' },
  { href: '/events', label: 'Events' },
  { href: '/partners', label: 'Partners' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/volunteer-hours', label: 'Log Hours' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const handleNavClick = (href: string) => {
    if (href === '/') {
      // Force scroll to top for homepage
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_24px_rgba(0,0,0,0.06)] border-b border-gray-100/60' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-[60px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Image 
                src="/logo-nav.png" 
                alt="Project Clean & Seen" 
                width={36} 
                height={36}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="font-bold text-[15px] text-gray-800 group-hover:text-primary-600 transition-colors duration-200 hidden sm:block tracking-tight">
              Project Clean & Seen
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50/60 rounded-md transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-involved"
              className="ml-4 bg-accent-500 text-white px-5 py-[7px] rounded-lg text-[13px] font-bold hover:bg-accent-600 hover:shadow-[0_4px_16px_rgba(245,166,35,0.3)] transition-all duration-200 active:scale-95 tracking-wide uppercase"
            >
              Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav with animation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pb-4 pt-1 space-y-0.5 border-t border-gray-100">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block px-3 py-2.5 text-[15px] font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50/60 rounded-lg transition-all duration-200"
                style={{ transitionDelay: `${index * 25}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-involved"
              onClick={() => setIsOpen(false)}
              className="block mx-3 mt-3 bg-accent-500 text-white px-4 py-2.5 rounded-lg text-center font-bold text-sm hover:bg-accent-600 transition-all duration-200"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
