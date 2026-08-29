import { getPrograms, getContent } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';
import { IconToothbrush, IconFloss, IconDeodorant, IconDrop, IconHands, IconBandage, IconRazor, IconComb, IconBaby, IconPlane, IconSocks, IconSoap, IconShampoo, IconHygieneKit, IconDonation, IconVolunteer, IconOutreach } from '@/components/Icons';
import ScrollReveal, { StaggerGroup } from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Programs | Project Clean & Seen',
  description: 'Learn about our hygiene kit drives, donation drives, volunteer programs, and community outreach.',
};

interface Program {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: string;
  sort_order: number;
}

function getProgramIcon(icon: string, size: number) {
  const cls = 'text-primary-600';
  switch (icon) {
    case 'hygiene_kit': return <IconHygieneKit size={size} className={cls} />;
    case 'donation': return <IconDonation size={size} className={cls} />;
    case 'volunteer': return <IconVolunteer size={size} className={cls} />;
    case 'outreach': return <IconOutreach size={size} className={cls} />;
    default: return <IconHygieneKit size={size} className={cls} />;
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms() as Program[];
  const content = await getContent('programs');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[450px] h-[450px] rounded-full bg-primary-600/8 blur-[100px] -translate-y-1/3" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-500/5 blur-[80px] translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <ScrollReveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">Programs</p>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">{content.section_title || 'Our Programs'}</h1>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              {content.section_description || 'Through our programs, we make hygiene products accessible to those who need them most.'}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Programs List with alternating layout */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-20">
            {programs.map((program, index) => (
              <ScrollReveal key={program.id} delay={index * 100}>
                <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:direction-rtl' : ''}`}>
                  <div className={index % 2 !== 0 ? 'md:order-2' : ''}>
                    <div className="mb-4">{getProgramIcon(program.icon, 48)}</div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {program.title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">{program.description}</p>
                    <p className="text-gray-500">{program.details}</p>
                  </div>
                  <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                    <div className="text-center">
                      <div className="flex justify-center opacity-40">{getProgramIcon(program.icon, 80)}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hygiene Kit Items with hover effects */}
      <section className="py-16 md:py-24 bg-gray-50/80">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What&apos;s in a Hygiene Kit?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Each kit is carefully assembled with essential hygiene products to restore dignity and health.
            </p>
          </ScrollReveal>
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" stagger={50} direction="scale">
            {[
              { icon: <IconSoap size={28} />, label: 'Soap & Body Wash' },
              { icon: <IconShampoo size={28} />, label: 'Shampoo & Conditioner' },
              { icon: <IconToothbrush size={28} />, label: 'Toothbrushes & Toothpaste' },
              { icon: <IconFloss size={28} />, label: 'Dental Floss' },
              { icon: <IconDeodorant size={28} />, label: 'Deodorant' },
              { icon: <IconDrop size={28} />, label: 'Lotion' },
              { icon: <IconHands size={28} />, label: 'Hand Sanitizer' },
              { icon: <IconBandage size={28} />, label: 'Feminine Hygiene Products' },
              { icon: <IconRazor size={28} />, label: 'Razors & Shaving Supplies' },
              { icon: <IconComb size={28} />, label: 'Combs' },
              { icon: <IconBaby size={28} />, label: 'Baby Wipes & Tissues' },
              { icon: <IconPlane size={28} />, label: 'Travel-Size Products' },
              { icon: <IconSocks size={28} />, label: 'New Socks' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-5 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 group" data-stagger>
                <div className="mb-3 flex justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <span className="font-medium text-gray-700 text-sm">{item.label}</span>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">Want to Support Our Programs?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-xl text-blue-100 mb-8">
              Whether you volunteer, donate, or partner with us, you can make a difference.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-involved" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
                Get Involved
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all">
                Contact Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
