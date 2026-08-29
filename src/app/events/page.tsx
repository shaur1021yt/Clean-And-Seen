import { getEvents, getContent } from '@/lib/db';
import type { Metadata } from 'next';
import { IconCalendar, IconClock, IconLocation } from '@/components/Icons';
import ScrollReveal, { StaggerGroup } from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Upcoming Events | Project Clean & Seen',
  description: 'Join us at our upcoming volunteer events, donation drives, and community programs.',
};

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
}

const typeColors: Record<string, string> = {
  volunteer: 'bg-blue-100 text-blue-800',
  donation_drive: 'bg-primary-100 text-primary-800',
  kit_assembly: 'bg-purple-100 text-purple-800',
  community: 'bg-orange-100 text-orange-800',
};

const typeLabels: Record<string, string> = {
  volunteer: 'Volunteer',
  donation_drive: 'Donation Drive',
  kit_assembly: 'Kit Assembly',
  community: 'Community Event',
};

export default async function EventsPage() {
  const allEvents = await getEvents() as Event[];
  const upcomingEvents = allEvents.filter(e => e.status === 'upcoming');
  const pastEvents = allEvents.filter(e => e.status !== 'upcoming');
  const content = await getContent('events');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-primary-600/8 blur-[100px] translate-x-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">Events</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">{content.section_title || 'Events'}</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            {content.section_description || 'Join us at our upcoming events to make a difference in your community.'}
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          </ScrollReveal>
          {upcomingEvents.length === 0 ? (
            <ScrollReveal delay={100}>
              <div className="bg-gray-50 rounded-xl p-12 text-center">
                <div className="mb-4 flex justify-center"><IconCalendar size={40} className="text-primary-500" /></div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">
                  Check back soon! We&apos;re always planning new events and opportunities.
                  Follow us on Instagram @projectcleanseen for the latest updates.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={100}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden card-hover" data-stagger>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                        {typeLabels[event.type] || event.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <IconCalendar size={16} />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-2">
                          <IconClock size={16} />
                          <span>{event.time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <IconLocation size={16} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="bg-gray-50/80 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Past Events</h2>
            </ScrollReveal>
            <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={100}>
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-75" data-stagger>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[event.type] || 'bg-gray-100 text-gray-800'}`}>
                    {typeLabels[event.type] || event.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  <p className="text-gray-400 text-sm">
                    <IconCalendar size={14} className="inline mr-1" /> {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#0D1626] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-xl text-blue-100 mb-6">
              Follow us on Instagram @projectcleanseen for the latest event announcements and updates.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <a
              href="https://instagram.com/projectcleanseen"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all inline-block"
            >
              Follow on Instagram
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
