import { getImpactStats, getContent } from '@/lib/db';
import { IconSchool, IconCheckCircle, IconVolunteer, IconCalendar, IconDonation, IconPartner, IconHygieneKit, IconStrength } from '@/components/Icons';
import type { Metadata } from 'next';
import ScrollReveal, { StaggerGroup } from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Impact | Project Clean & Seen',
  description: 'See the measurable impact of our hygiene equity programs.',
};

interface ImpactStat {
  id: number;
  label: string;
  value: number;
  icon: string;
}

function getStatIcon(icon: string, size: number) {
  const cls = 'text-primary-600';
  switch (icon) {
    case 'kits': return <IconHygieneKit size={size} className={cls} />;
    case 'products': return <IconDonation size={size} className={cls} />;
    case 'people': return <IconVolunteer size={size} className={cls} />;
    case 'drives': return <IconCalendar size={size} className={cls} />;
    case 'volunteers': return <IconStrength size={size} className={cls} />;
    case 'partners': return <IconPartner size={size} className={cls} />;
    case 'hours': return <IconStrength size={size} className={cls} />;
    default: return <IconCheckCircle size={size} className={cls} />;
  }
}

export default async function ImpactPage() {
  const stats = await getImpactStats() as ImpactStat[];
  const content = await getContent('impact');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-primary-600/8 blur-[100px] translate-x-1/4 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">Impact</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">
            {content.section_title || 'Our Impact'}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            {content.section_description || "Every kit assembled, every product donated, and every volunteer hour contributes to a more equitable community."}
          </p>
        </div>
      </section>

      {/* Stats Grid with animated counters */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" stagger={80} direction="scale">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
                data-stagger
              >
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {getStatIcon(stat.icon, 40)}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-3">
                  <AnimatedCounter value={stat.value} duration={2000} />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Where We Make a Difference
            </h2>
          </ScrollReveal>
          <StaggerGroup className="grid md:grid-cols-2 gap-8" stagger={120}>
            {[
              {
                icon: 'schools',
                title: 'Schools',
                description: 'Providing hygiene products to elementary school students who may not have access at home.',
              },
              {
                icon: 'shelters',
                title: 'Shelters',
                description: 'Supporting shelters and housing organizations with hygiene kits and products.',
              },
              {
                icon: 'community',
                title: 'Community Organizations',
                description: 'Partnering with nonprofits to distribute hygiene products to those in need.',
              },
              {
                icon: 'outreach',
                title: 'Street Outreach',
                description: 'Supporting organizations like Stitchers On A Mission through hygiene-kit drives.',
              },
            ].map((area) => (
              <div key={area.title} className="bg-white rounded-xl p-6 shadow-sm flex items-start space-x-4 hover:shadow-md transition-shadow duration-300" data-stagger>
                <div className="flex-shrink-0 mt-1">
                  {area.icon === 'schools' ? <IconSchool size={32} className="text-primary-600" /> :
                   area.icon === 'community' ? <IconPartner size={32} className="text-primary-600" /> :
                   area.icon === 'outreach' ? <IconVolunteer size={32} className="text-primary-600" /> :
                   <IconHygieneKit size={32} className="text-primary-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{area.title}</h3>
                  <p className="text-gray-600">{area.description}</p>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Past Projects with timeline style */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Work</h2>
          </ScrollReveal>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200" />
            
            <StaggerGroup className="space-y-12" stagger={150}>
              {[
                { title: 'Stitchers On A Mission Partnership', desc: 'Collecting products and assembling hygiene kits to support street outreach efforts.', date: '2025' },
                { title: 'Elementary School Supply Drive', desc: 'Organizing collections of school and hygiene supplies for elementary school students.', date: '2025' },
                { title: 'Community Hygiene Kit Assembly', desc: 'Creating complete hygiene kits for distribution to community organizations.', date: '2025' },
                { title: 'Youth Organization Collaborations', desc: 'Working with student and youth organizations to expand our reach.', date: '2025' },
              ].map((project, index) => (
                <div key={project.title} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`} data-stagger>
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-md transform -translate-x-2 md:-translate-x-2 z-10" />
                  
                  {/* Content card */}
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="text-sm text-primary-600 font-medium mb-2">{project.date}</div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{project.title}</h3>
                      <p className="text-gray-600">{project.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">See Your Impact in Action</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-xl text-blue-100 mb-8">
              Every contribution counts. Join us in making a difference.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-involved" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
                Donate Now
              </a>
              <a href="/get-involved" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all">
                Become a Volunteer
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
