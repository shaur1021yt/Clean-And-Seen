import { getContent } from '@/lib/db';
import type { Metadata } from 'next';
import { IconStrength, IconSeedling, IconSchool, IconHands, IconUsers, IconGlobe } from '@/components/Icons';
import ScrollReveal, { StaggerGroup } from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us | Project Clean & Seen',
  description: 'Learn about our story, mission, and why hygiene equity matters.',
};

export default async function AboutPage() {
  const content = await getContent('about');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-600/8 blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-accent-500/5 blur-[80px] translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <ScrollReveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">About Us</p>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">Our Story</h1>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Learn about our mission, our team, and why hygiene equity matters.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Our Story</h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="space-y-5">
              {(content.story || 'Project Clean & Seen (PCAS) was founded in November 2025.').split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-gray-600 text-[17px] leading-[1.75]">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StaggerGroup className="grid md:grid-cols-2 gap-8" direction="up">
            <div data-stagger>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center mb-5 border border-primary-100">
                  <IconHands size={22} className="text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Our Mission</h2>
                <p className="text-gray-500 leading-relaxed">
                  To advance hygiene equity by providing essential hygiene products and support to individuals and communities experiencing homelessness, hardship, or limited access to basic necessities.
                </p>
              </div>
            </div>
            <div data-stagger>
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                <div className="w-11 h-11 bg-accent-50 rounded-xl flex items-center justify-center mb-5 border border-accent-100">
                  <IconGlobe size={22} className="text-accent-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Why Hygiene Equity Matters</h2>
                <p className="text-gray-500 leading-relaxed">
                  {content.why_hygiene || 'Hygiene equity matters because access to basic hygiene products is fundamental to human dignity, health, and opportunity.'}
                </p>
              </div>
            </div>
          </StaggerGroup>
        </div>
      </section>

      {/* Youth-Led */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">Youth-Led, Community-Driven</h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <p className="text-gray-500 text-[17px] leading-relaxed max-w-2xl">
              {content.youth_led || 'PCAS is proudly youth-led. We believe that young people have the power and responsibility to drive change in their communities.'}
            </p>
          </ScrollReveal>
          <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-12" stagger={100}>
            <div className="text-center bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-primary-200 transition-all duration-300" data-stagger>
              <div className="mb-4 flex justify-center"><IconSeedling size={36} className="text-primary-500" /></div>
              <h3 className="font-semibold text-gray-900 mb-1.5">Founded 2025</h3>
              <p className="text-gray-500 text-sm">Started by young people passionate about change</p>
            </div>
            <div className="text-center bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-primary-200 transition-all duration-300" data-stagger>
              <div className="mb-4 flex justify-center"><IconSchool size={36} className="text-primary-500" /></div>
              <h3 className="font-semibold text-gray-900 mb-1.5">Bay Area Based</h3>
              <p className="text-gray-500 text-sm">Rooted in our local community</p>
            </div>
            <div className="text-center bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-primary-200 transition-all duration-300" data-stagger>
              <div className="mb-4 flex justify-center"><IconStrength size={36} className="text-primary-500" /></div>
              <h3 className="font-semibold text-gray-900 mb-1.5">Growing Impact</h3>
              <p className="text-gray-500 text-sm">Expanding our reach every day</p>
            </div>
          </StaggerGroup>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="relative overflow-hidden bg-[#0D1626] text-white py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/8 blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight">Who We Serve</h2>
          </ScrollReveal>
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" stagger={80} direction="scale">
            {[
              { title: 'Homelessness', desc: 'Individuals experiencing homelessness', icon: <IconUsers size={22} /> },
              { title: 'Financial Hardship', desc: 'Families facing economic challenges', icon: <IconHands size={22} /> },
              { title: 'Limited Access', desc: 'Communities without hygiene product access', icon: <IconGlobe size={22} /> },
              { title: 'Community Orgs', desc: 'Organizations serving vulnerable populations', icon: <IconStrength size={22} /> },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/[0.07] transition-all duration-300 border border-white/[0.06]" data-stagger>
                <div className="mb-3 flex justify-center text-primary-400">{item.icon}</div>
                <h3 className="font-semibold mb-1.5 text-[15px]">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </div>
  );
}
