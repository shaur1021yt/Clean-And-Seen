import { getPartners, getContent } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IconPartners, IconDonation, IconHygieneKit, IconVolunteer } from '@/components/Icons';
import ScrollReveal, { StaggerGroup } from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Partners | Project Clean & Seen',
  description: 'Learn about the organizations we collaborate with to advance hygiene equity.',
};

interface Partner {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
}

export default async function PartnersPage() {
  const partners = await getPartners() as Partner[];
  const content = await getContent('partners');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-primary-600/8 blur-[100px] translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">Partners</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">{content.section_title || 'Our Partners'}</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            {content.section_description || 'We collaborate with nonprofits, schools, community organizations, and businesses to expand our impact.'}
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {partners.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-12">
                <div className="mb-4 flex justify-center"><IconPartners size={40} className="text-primary-500" /></div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Partners Coming Soon</h3>
                <p className="text-gray-500 mb-6">
                  We&apos;re building partnerships with organizations that share our commitment to hygiene equity.
                </p>
                <Link href="/contact" className="btn-primary inline-block">
                  Become a Partner
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={100} direction="scale">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 card-hover" data-stagger>
                  {partner.logo_url && (
                    <div className="mb-4">
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="h-16 object-contain"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      {/* Become a Partner */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Become a Partner</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-gray-600 text-lg mb-8">
              We&apos;re always looking for organizations that share our commitment to hygiene equity.
              Whether you&apos;re a nonprofit, school, business, or community group, we&apos;d love to explore how we can work together.
            </p>
          </ScrollReveal>
          <StaggerGroup className="grid md:grid-cols-3 gap-6 mb-8" stagger={120} direction="scale">
            {[
              { Icon: IconDonation, title: 'Donation Drives', desc: 'Organize collection drives together' },
              { Icon: IconHygieneKit, title: 'Hygiene Kits', desc: 'Create and distribute kits' },
              { Icon: IconVolunteer, title: 'Events', desc: 'Host volunteer events' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm" data-stagger>
                <item.Icon size={32} className="text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </StaggerGroup>
          <ScrollReveal delay={400}>
            <Link href="/contact" className="btn-primary inline-block">
              Get in Touch
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
