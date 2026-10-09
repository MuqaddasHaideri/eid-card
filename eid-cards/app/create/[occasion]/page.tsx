"use client";
import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Eye, Edit3, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import GreetingCard from '@/app/components/GreetingCard';
import ExportPanel from '@/app/components/ExportPanel';
import { coversFor } from '@/app/data/covers';
import { WISHES } from '@/app/data/wishes';
import { getOccasion } from '@/app/data/occasions';
import { cardsApi } from '@/app/lib/api';

export default function CreatePage() {
  const params = useParams<{ occasion: string }>();
  const occasion = getOccasion(params.occasion);
  if (!occasion) notFound();

  const covers = useMemo(() => coversFor(occasion.id), [occasion.id]);
  const wishes = WISHES[occasion.id];

  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState(wishes[0].text);
  const [themeIndex, setThemeIndex] = useState(0);
  const [wishIndex, setWishIndex] = useState(0);
  const [link, setLink] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (covers.length === 0) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4 text-slate-700 px-6 text-center">
        <p className="font-playfair text-xl">{occasion.cardTitle} designs are coming soon.</p>
        <Link href="/" className="underline text-sm">← Back to occasions</Link>
      </main>
    );
  }

  const cover = covers[themeIndex];
  const setWish = (i: number) => { setWishIndex(i); setMessage(wishes[i].text); };
  const nextTheme = () => setThemeIndex((p) => (p + 1) % covers.length);
  const prevTheme = () => setThemeIndex((p) => (p - 1 + covers.length) % covers.length);
  const nextWish = () => setWish((wishIndex + 1) % wishes.length);
  const prevWish = () => setWish((wishIndex - 1 + wishes.length) % wishes.length);

  const createCard = async () => {
    setLoading(true); setError('');
    try {
      const id = await cardsApi.create({ sender: sender.trim(), receiver: receiver.trim(), message, themeId: cover.id, occasion: occasion.id });
      setLink(`${window.location.origin}/card/${id}`);
      setIsPreview(false);
    } catch (e) {
      console.error(e);
      setError('Could not save your card. Please try again.'); // stay on preview so nothing is lost
    } finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${occasion.emoji} I made a card for you: ${link}`)}`;
  const accentStyle = { backgroundColor: occasion.accent };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-12 px-6">
      <AnimatePresence mode="wait">
        {!isPreview ? (
          <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md w-full">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← All occasions</Link>
            <div className="text-center mb-8 mt-2 text-slate-900">
              <h1 className="text-4xl font-playfair italic font-bold">{occasion.title}</h1>
              <p className="text-gray-500 text-sm mt-2">{occasion.subtitle}</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8 border border-gray-100">
              {/* Theme Selector */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 block text-center font-bold">1. Select Design</label>
                <div className="flex items-center justify-between">
                  <button onClick={prevTheme} type="button" aria-label="Previous design" className="p-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition"><ChevronLeft size={20} /></button>
                  <div className="w-40 h-56 overflow-hidden rounded-2xl shadow-inner border-[6px] border-gray-50 bg-white">
                    <motion.img key={cover.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={cover.image} alt={cover.name} className="w-full h-full object-cover" />
                  </div>
                  <button onClick={nextTheme} type="button" aria-label="Next design" className="p-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition"><ChevronRight size={20} /></button>
                </div>
                <p className="text-center mt-3 text-xs font-medium text-slate-600 italic">{cover.name} · {themeIndex + 1}/{covers.length}</p>
              </div>

              {/* Names */}
              <div className="flex gap-4">
                {[
                  { label: 'From', value: sender, set: setSender, ph: 'Your Name' },
                  { label: 'To', value: receiver, set: setReceiver, ph: occasion.receiverPlaceholder },
                ].map((f) => (
                  <div key={f.label} className="flex-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-2 mb-1 block">{f.label}</label>
                    <input value={f.value} maxLength={40} dir="auto" placeholder={f.ph} onChange={(e) => f.set(e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-1 focus:ring-amber-200 transition text-sm text-slate-900 placeholder:text-gray-400" />
                  </div>
                ))}
              </div>

              {/* Wishes */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-4 block text-center font-bold">2. Choose a Wish</label>
                <div className="flex items-center justify-between gap-2">
                  <button onClick={prevWish} type="button" aria-label="Previous wish" className="text-gray-400 hover:text-amber-600"><ChevronLeft size={20} /></button>
                  <div className="flex-1 min-h-[60px] flex items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                      <motion.p key={wishIndex} dir="auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm italic font-serif text-slate-800">
                        “{wishes[wishIndex].text}”
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <button onClick={nextWish} type="button" aria-label="Next wish" className="text-gray-400 hover:text-amber-600"><ChevronRight size={20} /></button>
                </div>
                <textarea value={message} maxLength={300} dir="auto" onChange={(e) => setMessage(e.target.value)}
                  className="w-full mt-4 bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none resize-none h-24 text-center text-slate-900 shadow-sm" />
                <p className="text-right text-[10px] text-gray-400 mt-1">{message.length}/300</p>
              </div>

              <button onClick={() => setIsPreview(true)} disabled={!sender.trim() || !receiver.trim() || !message.trim()}
                style={accentStyle} className="w-full text-white p-5 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg">
                <Eye size={18} /> Preview Card
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-lg">
            <header className="text-center mb-6">
              <span className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Live Preview</span>
            </header>
            <div className="w-full py-4 min-h-[500px] flex items-center justify-center">
              <GreetingCard receiver={receiver} message={message} sender={sender} themeId={cover.id} occasion={occasion.id} />
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            <div className="flex gap-4 mt-8 w-full px-4">
              <button onClick={() => setIsPreview(false)} className="flex-1 bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-medium">
                <Edit3 size={18} /> Edit
              </button>
              <button onClick={createCard} disabled={loading} style={accentStyle} className="flex-[2] text-white p-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
                {loading ? 'Saving...' : <><Sparkles size={18} /> Confirm & Share</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Result */}
      {link && !isPreview && (
        <>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 p-6 bg-white rounded-[2.5rem] shadow-2xl border-2 border-dashed border-amber-200 max-w-md w-full">
            <p className="text-[10px] text-center text-gray-400 mb-4 tracking-[0.2em] uppercase font-bold">Your Link is Ready</p>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <code className="flex-1 truncate text-xs text-amber-900 font-medium px-2">{link}</code>
              <button onClick={copy} aria-label="Copy link" className="p-3 bg-amber-100 text-amber-700 rounded-xl transition">
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 w-full p-3 rounded-2xl bg-emerald-600 text-white text-sm flex items-center justify-center gap-2">
              <Share2 size={16} /> Share on WhatsApp
            </a>
          </motion.div>

          <ExportPanel image={cover.image} sender={sender} receiver={receiver} message={message} accent={occasion.accent} heading={occasion.cardTitle} />
        </>
      )}
    </main>
  );
}
