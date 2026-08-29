'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ContentData {
  [section: string]: { [key: string]: string };
}

interface EditableRegion {
  section: string;
  fieldKey: string;
  label: string;
  selector: string;
  page: string;
  type: 'text' | 'image';
}

// Static editable regions for structured content (matches content DB)
const STATIC_MAP: EditableRegion[] = [
  // HOME
  { section: 'home', fieldKey: 'hero_title', label: 'Hero Title', selector: '.pcas-hero-title', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'hero_subtitle', label: 'Hero Subtitle', selector: '.pcas-hero-sub', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'tension_1', label: 'Tension Line 1', selector: '[data-sc-cue="0 0.32 0"]', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'tension_2', label: 'Tension Line 2', selector: '[data-sc-cue="0.26 0.58"]', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'tension_3', label: 'Tension Line 3', selector: '[data-sc-cue="0.52 0.82"]', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'tension_4', label: 'Tension Line 4', selector: '[data-sc-cue="0.76 1"]', page: '/', type: 'text' },
  { section: 'home', fieldKey: 'close_headline', label: 'Close Headline', selector: '.sc-display--md:last-of-type', page: '/', type: 'text' },
  // ABOUT
  { section: 'about', fieldKey: 'story', label: 'Our Story', selector: 'main p:first-of-type', page: '/about', type: 'text' },
  { section: 'about', fieldKey: 'why_hygiene', label: 'Why Hygiene Equity', selector: 'main h2 + p', page: '/about', type: 'text' },
  // PROGRAMS
  { section: 'programs', fieldKey: 'section_title', label: 'Programs Title', selector: 'h1', page: '/programs', type: 'text' },
  { section: 'programs', fieldKey: 'section_description', label: 'Programs Description', selector: 'main p:first-of-type', page: '/programs', type: 'text' },
  // EVENTS
  { section: 'events', fieldKey: 'section_title', label: 'Events Title', selector: 'h1', page: '/events', type: 'text' },
  { section: 'events', fieldKey: 'section_description', label: 'Events Description', selector: 'main p:first-of-type', page: '/events', type: 'text' },
  // PARTNERS
  { section: 'partners', fieldKey: 'section_title', label: 'Partners Title', selector: 'h1', page: '/partners', type: 'text' },
  { section: 'partners', fieldKey: 'section_description', label: 'Partners Description', selector: 'main p:first-of-type', page: '/partners', type: 'text' },
  // CONTACT
  { section: 'contact', fieldKey: 'section_title', label: 'Contact Title', selector: 'h1', page: '/contact', type: 'text' },
  { section: 'contact', fieldKey: 'email', label: 'Email', selector: 'a[href^="mailto:"]', page: '/contact', type: 'text' },
  // GET INVOLVED
  { section: 'get_involved', fieldKey: 'volunteer_title', label: 'Volunteer Title', selector: 'main h2:first-of-type', page: '/get-involved', type: 'text' },
  { section: 'get_involved', fieldKey: 'donate_title', label: 'Donate Title', selector: 'main h2:nth-of-type(2)', page: '/get-involved', type: 'text' },
  { section: 'get_involved', fieldKey: 'venmo_username', label: 'Venmo Username', selector: '.font-mono.text-xl', page: '/get-involved', type: 'text' },
  { section: 'get_involved', fieldKey: 'paypal_email', label: 'PayPal Email', selector: 'li:nth-child(1) span:last-child', page: '/get-involved', type: 'text' },
];

// Pages to auto-scan for editable elements
const AUTO_SCAN_PAGES = ['/', '/about', '/programs', '/impact', '/events', '/partners', '/gallery', '/get-involved', '/contact'];

const PAGE_OPTIONS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/programs', label: 'Programs' },
  { path: '/impact', label: 'Impact' },
  { path: '/events', label: 'Events' },
  { path: '/partners', label: 'Partners' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/get-involved', label: 'Get Involved' },
  { path: '/contact', label: 'Contact' },
];

export default function SitePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activePage, setActivePage] = useState('/');
  const [content, setContent] = useState<ContentData>({});
  const [editingRegion, setEditingRegion] = useState<EditableRegion | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [hoveredRegion, setHoveredRegion] = useState<EditableRegion | null>(null);
  const [autoRegions, setAutoRegions] = useState<EditableRegion[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  // Fetch all content
  useEffect(() => {
    fetch('/api/admin/content').then(r => r.json()).then(setContent);
  }, []);

  // Auto-discover all editable text elements in the iframe
  const autoDiscoverElements = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const discovered: EditableRegion[] = [];

    // Scan all heading, paragraph, list item, and span elements
    const textElements = doc.querySelectorAll('h1, h2, h3, h4, p, li, span, a, button, td');
    const seen = new Set<string>();

    textElements.forEach((el, idx) => {
      const htmlEl = el as HTMLElement;
      const text = htmlEl.textContent?.trim();
      if (!text || text.length < 3 || text.length > 500) return;

      // Skip navigation elements, admin UI, very small text
      if (htmlEl.closest('nav, .admin-sidebar, .pcas-edit-label, iframe, script, style')) return;
      if (htmlEl.closest('[data-pcas-skip]')) return;

      // Create a unique selector for this element
      const tagName = htmlEl.tagName.toLowerCase();
      const className = htmlEl.className ? `.${htmlEl.className.split(' ').filter(c => c && !c.startsWith('pcas-') && c.length < 30).slice(0, 2).join('.')}` : '';
      const textPreview = text.substring(0, 30).replace(/[^a-zA-Z0-9 ]/g, '').trim();

      if (!textPreview) return;

      // Create a data attribute-based selector
      const autoKey = `auto_${activePage.replace(/\//g, '_')}_${tagName}_${idx}`;
      if (seen.has(autoKey)) return;
      seen.add(autoKey);

      // Label based on tag and content
      let label = '';
      if (tagName === 'h1') label = `Heading: ${textPreview}`;
      else if (tagName === 'h2') label = `Section: ${textPreview}`;
      else if (tagName === 'h3') label = `Subhead: ${textPreview}`;
      else if (tagName === 'h4') label = `Label: ${textPreview}`;
      else if (tagName === 'p') label = `Text: ${textPreview}`;
      else if (tagName === 'li') label = `List item: ${textPreview}`;
      else if (tagName === 'a') label = `Link: ${textPreview}`;
      else if (tagName === 'button') label = `Button: ${textPreview}`;
      else label = `${tagName.toUpperCase()}: ${textPreview}`;

      // Mark the element with a data attribute so we can find it later
      htmlEl.setAttribute('data-pcas-auto-key', autoKey);

      discovered.push({
        section: 'auto',
        fieldKey: autoKey,
        label: label.substring(0, 60),
        selector: `[data-pcas-auto-key="${autoKey}"]`,
        page: activePage,
        type: 'text',
      });
    });

    // Discover all images
    const images = doc.querySelectorAll('img:not([data-pcas-skip])');
    images.forEach((img, idx) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.closest('nav, .admin-sidebar, .pcas-edit-label, iframe, script, style')) return;
      if (htmlImg.width < 20 || htmlImg.height < 20) return;

      const autoKey = `img_${activePage.replace(/\//g, '_')}_${idx}`;
      htmlImg.setAttribute('data-pcas-auto-key', autoKey);

      discovered.push({
        section: 'auto',
        fieldKey: autoKey,
        label: `Image: ${htmlImg.alt || htmlImg.src.split('/').pop()?.substring(0, 30) || 'unknown'}`,
        selector: `[data-pcas-auto-key="${autoKey}"]`,
        page: activePage,
        type: 'image',
      });
    });

    setAutoRegions(discovered);
  }, [activePage]);

  // Get all editable regions for current page (static + auto-discovered)
  const getAllRegions = useCallback((): EditableRegion[] => {
    const staticRegions = STATIC_MAP.filter(r => r.page === activePage);
    const dynamicRegions = autoRegions.filter(r => r.page === activePage);
    return [...staticRegions, ...dynamicRegions];
  }, [activePage, autoRegions]);

  // Inject editable overlays into iframe
  const injectEditableOverlays = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;

    // Clean up old overlays
    doc.querySelectorAll('.pcas-edit-overlay, .pcas-edit-highlight, .pcas-edit-label, .pcas-edit-img-badge').forEach(el => el.remove());

    // Auto-discover elements
    autoDiscoverElements();

    // Get all regions for current page
    const allRegions = [...STATIC_MAP.filter(r => r.page === activePage), ...autoRegions.filter(r => r.page === activePage)];

    allRegions.forEach(region => {
      const elements = doc.querySelectorAll(region.selector);
      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl) return;

        htmlEl.classList.add('pcas-edit-highlight');
        htmlEl.setAttribute('data-pcas-section', region.section);
        htmlEl.setAttribute('data-pcas-key', region.fieldKey);

        // Create label
        const label = doc.createElement('div');
        label.className = 'pcas-edit-label';
        label.textContent = region.label;
        label.style.cssText = `
          position: absolute; top: -22px; left: 0; z-index: 99999; pointer-events: none;
          background: ${region.type === 'image' ? '#8b5cf6' : '#3b82f6'}; color: white;
          padding: 2px 8px; border-radius: 4px; font-size: 11px; font-family: -apple-system, sans-serif;
          font-weight: 600; white-space: nowrap; opacity: 0; transition: opacity 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        const pos = window.getComputedStyle(htmlEl).position;
        if (pos === 'static') htmlEl.style.position = 'relative';
        htmlEl.appendChild(label);

        // For images, add an upload badge
        if (region.type === 'image') {
          const badge = doc.createElement('div');
          badge.className = 'pcas-edit-img-badge';
          badge.innerHTML = '📷';
          badge.style.cssText = `
            position: absolute; top: 4px; right: 4px; z-index: 99999;
            background: rgba(139,92,246,0.9); color: white; width: 28px; height: 28px;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 14px; cursor: pointer; opacity: 0; transition: opacity 0.15s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          `;
          htmlEl.appendChild(badge);

          htmlEl.addEventListener('mouseenter', () => { badge.style.opacity = '1'; });
          htmlEl.addEventListener('mouseleave', () => { badge.style.opacity = '0'; });

          badge.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            handleImageUpload(region);
          });
        }

        // Hover events
        htmlEl.addEventListener('mouseenter', () => {
          label.style.opacity = '1';
          setHoveredRegion(region);
        });
        htmlEl.addEventListener('mouseleave', () => {
          label.style.opacity = '0';
          setHoveredRegion(null);
        });

        // Click to edit
        htmlEl.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          if (region.type === 'image') {
            handleImageUpload(region);
          } else {
            setEditingRegion(region);
            const val = content[region.section]?.[region.fieldKey] || htmlEl.textContent || '';
            setEditValue(val);
          }
        });

        // Drag-and-drop for list items
        if (htmlEl.tagName === 'LI' || htmlEl.closest('ul, ol')) {
          htmlEl.draggable = true;
          htmlEl.addEventListener('dragstart', (e) => {
            (e as DragEvent).dataTransfer?.setData('text/plain', region.fieldKey);
            setDragTarget(region.fieldKey);
            htmlEl.style.opacity = '0.4';
          });
          htmlEl.addEventListener('dragend', () => {
            setDragTarget(null);
            htmlEl.style.opacity = '1';
          });
          htmlEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            htmlEl.style.borderTop = '2px solid #3b82f6';
          });
          htmlEl.addEventListener('dragleave', () => {
            htmlEl.style.borderTop = '';
          });
          htmlEl.addEventListener('drop', (e) => {
            e.preventDefault();
            htmlEl.style.borderTop = '';
            const draggedKey = (e as DragEvent).dataTransfer?.getData('text/plain');
            if (draggedKey && draggedKey !== region.fieldKey) {
              // Reorder in the DOM
              const parent = htmlEl.parentNode;
              const draggedEl = doc.querySelector(`[data-pcas-key="${draggedKey}"]`);
              if (parent && draggedEl) {
                const allItems = Array.from(parent.children);
                const draggedIdx = allItems.indexOf(draggedEl);
                const dropIdx = allItems.indexOf(htmlEl);
                if (draggedIdx < dropIdx) {
                  parent.insertBefore(draggedEl, htmlEl.nextSibling);
                } else {
                  parent.insertBefore(draggedEl, htmlEl);
                }
              }
            }
          });
        }
      });
    });

    // Inject styles
    if (!doc.getElementById('pcas-edit-styles')) {
      const style = doc.createElement('style');
      style.id = 'pcas-edit-styles';
      style.textContent = `
        .pcas-edit-highlight {
          outline: 2px dashed transparent !important;
          outline-offset: 2px; cursor: pointer !important;
          transition: outline-color 0.15s, background-color 0.15s !important;
          border-radius: 4px;
        }
        .pcas-edit-highlight:hover {
          outline-color: #3b82f6 !important;
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
        .pcas-edit-highlight[data-pcas-key^="img_"]:hover {
          outline-color: #8b5cf6 !important;
          background-color: rgba(139, 92, 246, 0.05) !important;
        }
        .pcas-edit-highlight.pcas-editing {
          outline-color: #10b981 !important; outline-style: solid !important;
          background-color: rgba(16, 185, 129, 0.08) !important;
        }
        .pcas-edit-highlight[data-dragging="true"] {
          opacity: 0.4 !important;
        }
      `;
      doc.head.appendChild(style);
    }
  }, [activePage, content, autoRegions, autoDiscoverElements]);

  // Handle image upload
  const handleImageUpload = async (region: EditableRegion) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          // Replace the image src in the iframe
          const iframe = iframeRef.current;
          if (iframe?.contentDocument) {
            const imgEl = iframe.contentDocument.querySelector(`[data-pcas-key="${region.fieldKey}"]`) as HTMLImageElement;
            if (imgEl) {
              imgEl.src = data.url;
              imgEl.classList.add('pcas-editing');
              setTimeout(() => imgEl.classList.remove('pcas-editing'), 2000);
            }
          }
          setMessage('Image uploaded!');
          setTimeout(() => setMessage(''), 2000);
        }
      } catch (err) {
        setMessage('Upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  };

  // Inject when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const handleLoad = () => setTimeout(injectEditableOverlays, 500);
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [injectEditableOverlays]);

  // Re-inject when content changes
  useEffect(() => {
    if (Object.keys(content).length > 0) setTimeout(injectEditableOverlays, 300);
  }, [content, injectEditableOverlays]);

  // Navigate to page
  const navigateTo = (path: string) => {
    setActivePage(path);
    setEditingRegion(null);
    setHoveredRegion(null);
    setAutoRegions([]);
    if (iframeRef.current) iframeRef.current.src = path;
  };

  // Save edited content
  const handleSave = async () => {
    if (!editingRegion) return;
    setSaving(true);

    try {
      if (editingRegion.section === 'auto') {
        // Auto-discovered element — update directly in the iframe DOM
        const iframe = iframeRef.current;
        if (iframe?.contentDocument) {
          const el = iframe.contentDocument.querySelector(
            `[data-pcas-key="${editingRegion.fieldKey}"]`
          );
          if (el) {
            el.textContent = editValue;
            el.classList.add('pcas-editing');
            setTimeout(() => el.classList.remove('pcas-editing'), 2000);
          }
        }
        setMessage('Updated (visual only)');
        setTimeout(() => setMessage(''), 2000);
      } else {
        // Static content — save to database
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section: editingRegion.section,
            data: { [editingRegion.fieldKey]: editValue },
          }),
        });

        if (res.ok) {
          setContent(prev => ({
            ...prev,
            [editingRegion.section]: {
              ...(prev[editingRegion.section] || {}),
              [editingRegion.fieldKey]: editValue,
            },
          }));

          const iframe = iframeRef.current;
          if (iframe?.contentDocument) {
            const el = iframe.contentDocument.querySelector(
              `[data-pcas-key="${editingRegion.fieldKey}"]`
            );
            if (el) {
              el.classList.add('pcas-editing');
              setTimeout(() => el.classList.remove('pcas-editing'), 2000);
            }
          }

          setMessage('Saved!');
          setTimeout(() => setMessage(''), 2000);

          // Reload iframe
          setTimeout(() => {
            if (iframeRef.current) iframeRef.current.src = activePage;
          }, 500);
        }
      }
    } catch {
      setMessage('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const allRegions = getAllRegions();
  const isLongText = editValue.length > 100;

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-0 -m-6">
      {/* Left: iframe */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page tabs */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-1 flex-shrink-0">
          <span className="text-xs text-gray-400 font-mono mr-2">VIEWING:</span>
          {PAGE_OPTIONS.map(page => (
            <button
              key={page.path}
              onClick={() => navigateTo(page.path)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePage === page.path
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {page.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {uploadingImage && (
              <span className="text-xs text-purple-600 font-medium animate-pulse">Uploading image...</span>
            )}
            {hoveredRegion && !editingRegion && (
              <span className="text-xs text-primary-600 font-medium animate-pulse">
                Click to edit: {hoveredRegion.label}
              </span>
            )}
            {message && (
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>{message}</span>
            )}
          </div>
        </div>

        {/* Iframe */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden">
          <iframe
            ref={iframeRef}
            src={activePage}
            className="w-full h-full border-0"
            style={{ zoom: 0.75 }}
            title="Site Preview"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-mono">
            75% &middot; Click any highlighted text to edit &middot; Images: click 📷 to upload &middot; Lists: drag to reorder
          </div>
        </div>
      </div>

      {/* Right: Edit panel */}
      <div className={`bg-white border-l border-gray-200 flex-shrink-0 transition-all duration-300 ${
        editingRegion ? 'w-96' : 'w-80'
      }`}>
        {editingRegion ? (
          <div className="h-full flex flex-col">
            {/* Edit header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-sm">Editing</h3>
                <button onClick={() => setEditingRegion(null)} className="p-1 hover:bg-gray-200 rounded-lg">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-primary-600 font-semibold text-sm">{editingRegion.label}</p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                {editingRegion.section} / {editingRegion.fieldKey}
                {editingRegion.section === 'auto' && <span className="ml-2 text-amber-500">(visual edit only)</span>}
              </p>
            </div>

            {/* Edit form */}
            <div className="flex-1 overflow-auto p-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</label>
              {isLongText ? (
                <textarea
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 resize-y min-h-[200px]"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  rows={8}
                />
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  autoFocus
                />
              )}
              <p className="text-[11px] text-gray-400 mt-2 font-mono">{editValue.length} characters</p>
            </div>

            {/* Save bar */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-2">
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-50 shadow-sm">
                {saving ? 'Saving...' : editingRegion.section === 'auto' ? 'Update Visual' : 'Save & Refresh'}
              </button>
              <button onClick={() => setEditingRegion(null)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Inline Editor</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Click any highlighted element to edit. Images: click 📷 to upload. Lists: drag to reorder.
              </p>
            </div>

            {/* All editable regions */}
            <div className="flex-1 overflow-auto p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {allRegions.length} editable elements on this page
              </p>
              <div className="space-y-1.5">
                {allRegions.map((region) => {
                  const val = region.type === 'image' ? '[Image]' : (content[region.section]?.[region.fieldKey] || '');
                  const isHovered = hoveredRegion?.fieldKey === region.fieldKey;
                  return (
                    <button
                      key={region.fieldKey}
                      onClick={() => {
                        if (region.type === 'image') {
                          handleImageUpload(region);
                        } else {
                          setEditingRegion(region);
                          setEditValue(val);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all border ${
                        isHovered
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : region.type === 'image'
                            ? 'bg-purple-50/50 border-transparent hover:bg-purple-50 hover:border-purple-200 text-purple-700'
                            : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm text-gray-700'
                      }`}
                    >
                      <div className="font-semibold mb-0.5">{region.label}</div>
                      {region.type !== 'image' && (
                        <div className="text-[10px] text-gray-400 truncate max-w-[250px]">
                          {val || <em className="text-gray-300">No content</em>}
                        </div>
                      )}
                      {region.type === 'image' && (
                        <div className="text-[10px] text-purple-400">Click to upload new image</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {allRegions.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8">No editable content found.</p>
              )}
            </div>

            {/* Quick nav */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">All Pages</p>
              <div className="flex flex-wrap gap-1">
                {PAGE_OPTIONS.map(page => (
                  <button
                    key={page.path}
                    onClick={() => navigateTo(page.path)}
                    className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                      activePage === page.path
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-500 hover:text-primary-600 border border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
