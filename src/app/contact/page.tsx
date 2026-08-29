'use client';

import { useState, useEffect } from 'react';
import { IconEmail, IconInstagram, IconCheckCircle, IconLocation, IconClock } from '@/components/Icons';

interface ContentData {
  section_title?: string;
  section_description?: string;
  email?: string;
  instagram?: string;
}

export default function ContactPage() {
  const [content, setContent] = useState<ContentData>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/content/contact').then(r => r.json()).then(setContent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '', type: 'general' });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0D1626] py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-600/8 blur-[100px] -translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/60 mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight">{content.section_title || 'Contact Us'}</h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
            {content.section_description || "Have questions? Want to get involved? We'd love to hear from you."}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-accent-50 border border-accent-200 rounded-xl p-8 text-center">
                  <div className="mb-4 flex justify-center"><IconCheckCircle size={40} className="text-accent-500" /></div>
                  <h3 className="text-xl font-semibold text-accent-800 mb-2">Message Sent!</h3>
                  <p className="text-accent-700">Thank you for reaching out. We&apos;ll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type</label>
                    <select
                      className="input-field"
                      value={form.type}
                      onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteering</option>
                      <option value="donation">Donation</option>
                      <option value="partnership">Partnership</option>
                      <option value="support_request">Request Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.subject}
                      onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea
                      required
                      className="textarea-field"
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2"><IconEmail size={18} /> Email</h3>
                  <a
                    href={`mailto:${content.email || 'projectcleanseen@gmail.com'}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {content.email || 'projectcleanseen@gmail.com'}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2"><IconInstagram size={18} /> Instagram</h3>
                  <a
                    href="https://instagram.com/projectcleanseen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {content.instagram || '@projectcleanseen'}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2"><IconLocation size={18} /> Location</h3>
                  <p className="text-gray-600">Bay Area, California</p>
                </div>
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-primary-900 mb-2"><IconClock size={18} /> Response Time</h3>
                  <p className="text-primary-700 text-sm">
                    We aim to respond to all inquiries within 48 hours. For urgent matters, please reach out via Instagram DM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
