import Link from 'next/link';
import Image from 'next/image';
import { IconEmail, IconInstagram } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-[#0B1320] text-white">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-600/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/logo-nav.png" alt="Project Clean & Seen" width={44} height={44} />
              <span className="font-bold text-lg tracking-tight">Project Clean & Seen</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Advancing hygiene equity by providing essential hygiene products and support to communities in need. Youth-led, community-driven.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/projectcleanseen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600/20 hover:border-primary-600/30 transition-all duration-300"
              >
                <IconInstagram size={18} />
              </a>
              <a
                href="mailto:projectcleanseen@gmail.com"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600/20 hover:border-primary-600/30 transition-all duration-300"
              >
                <IconEmail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/programs', label: 'Our Programs' },
                { href: '/impact', label: 'Our Impact' },
                { href: '/events', label: 'Events' },
                { href: '/gallery', label: 'Gallery' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-5">Get Involved</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/get-involved', label: 'Volunteer' },
                { href: '/get-involved', label: 'Donate' },
                { href: '/partners', label: 'Partners' },
                { href: '/contact', label: 'Contact' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white hover:pl-1 transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-5">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:projectcleanseen@gmail.com" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors duration-200 group">
                  <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-primary-600/20 flex items-center justify-center transition-colors duration-200">
                    <IconEmail size={13} />
                  </div>
                  <span className="truncate text-[13px]">projectcleanseen@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/projectcleanseen" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors duration-200 group">
                  <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-primary-600/20 flex items-center justify-center transition-colors duration-200">
                    <IconInstagram size={13} />
                  </div>
                  <span className="text-[13px]">@projectcleanseen</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 mt-14 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs tracking-wide">
              &copy; {new Date().getFullYear()} Project Clean & Seen. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs tracking-wide">
              A youth-led nonprofit advancing hygiene equity.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
