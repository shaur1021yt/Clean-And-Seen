'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  alt: string;
  category: string;
  created_at: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'events', label: 'Events' },
  { id: 'kits', label: 'Hygiene Kits' },
  { id: 'volunteers', label: 'Volunteers' },
  { id: 'drives', label: 'Donation Drives' },
  { id: 'partners', label: 'Partners' },
  { id: 'general', label: 'General' },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewImage, setViewImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(setImages)
      .finally(() => setLoading(false));
  }, []);

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0D1626]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-400/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-primary-400 text-sm font-mono uppercase tracking-widest mb-4">Gallery</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
            Our Work in Action
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See the impact of hygiene equity — from kit assembly to community outreach events.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4 opacity-30">📷</div>
              <p className="text-gray-500 text-lg">No images yet</p>
              <p className="text-gray-600 text-sm mt-2">Check back soon for photos from our events and drives!</p>
              <Link href="/get-involved" className="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all">
                Get Involved
              </Link>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredImages.map((image) => (
                <ScrollReveal key={image.id} className="break-inside-avoid">
                  <button
                    onClick={() => setViewImage(image)}
                    className="group relative w-full rounded-xl overflow-hidden bg-white/5 hover:ring-2 hover:ring-primary-500/50 transition-all cursor-pointer"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.alt || image.caption}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    {image.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                        {image.category !== 'general' && (
                          <p className="text-white/60 text-xs capitalize">{image.category}</p>
                        )}
                      </div>
                    )}
                  </button>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {viewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewImage(null)}
        >
          <button
            onClick={() => setViewImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={viewImage.url}
              alt={viewImage.alt || viewImage.caption}
              width={1200}
              height={800}
              className="object-contain w-full h-auto max-h-[85vh] rounded-xl"
            />
            {viewImage.caption && (
              <div className="mt-4 text-center">
                <p className="text-white font-medium text-lg">{viewImage.caption}</p>
                {viewImage.category !== 'general' && (
                  <p className="text-white/50 text-sm capitalize mt-1">{viewImage.category}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
