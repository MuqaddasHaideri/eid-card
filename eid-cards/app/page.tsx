"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, Eye, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import EidCard from '@/app/components/EidCard';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const PRESET_WISHES = [
  { id: 1, text: "May your heart be as light as the moon and your day as sweet as the dates. Eid Mubarak!" },
  { id: 2, text: "Wishing you an Eid filled with the smell of jasmine and old memories. Have a blessed day!" },
  { id: 3, text: "Eid Mubarak! Now stop reading this and go bring me my Eidi. 😂" },
  { id: 4, text: "May this Eid bring you closer to the ones who make your soul smile. Sending love!" },
  { id: 5, text: "A nostalgic wish for a modern day. May your Eid be as beautiful as a childhood memory." }
];

const COVERS = [
  { id: 1, name: "Minimalist Border", image: "/cover1.png" },
  { id: 2, name: "Golden Mosque Silhouette", image: "/cover2.jpeg" },
  { id: 3, name: "Vintage Floral Bouquet", image: "/cover3.jpeg" },
  { id: 4, name: "Moonlit Night Sky", image: "/cover4.jpeg" },
  { id: 5, name: "Blue Watercolor Splash", image: "/cover5.jpeg" },
  { id: 6, name: "Happy Ghost Doodle", image: "/cover6.png" },
  { id: 7, name: "Elegant Archway", image: "/cover7.png" },
  { id: 8, name: "Pink Lantern Dream", image: "/cover8.png" },
  { id: 9, name: "Geometric Gold Pattern", image: "/cover9.png" },
  { id: 10, name: "Eid Meowbarak Cat", image: "/cover10.png" },
];

export default function HomePage() {
  const [formData, setFormData] = useState({ 
    sender: '', 
    receiver: '', 
    message: PRESET_WISHES[0].text, 
    themeId: COVERS[0].id 
  });
  
  const [themeIndex, setThemeIndex] = useState(0);
  const [wishIndex, setWishIndex] = useState(0);
  const [link, setLink] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const nextTheme = () => {
    const i = (themeIndex + 1) % COVERS.length;
    setThemeIndex(i);
    setFormData({ ...formData, themeId: COVERS[i].id });
  };
  
  const prevTheme = () => {
    const i = (themeIndex - 1 + COVERS.length) % COVERS.length;
    setThemeIndex(i);
    setFormData({ ...formData, themeId: COVERS[i].id });
  };

  const nextWish = () => {
    const i = (wishIndex + 1) % PRESET_WISHES.length;
    setWishIndex(i);
    setFormData({ ...formData, message: PRESET_WISHES[i].text });
  };
  
  const prevWish = () => {
    const i = (wishIndex - 1 + PRESET_WISHES.length) % PRESET_WISHES.length;
    setWishIndex(i);
    setFormData({ ...formData, message: PRESET_WISHES[i].text });
  };

  const createCard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([{ 
            sender_name: formData.sender, 
            receiver_name: formData.receiver, 
            message: formData.message,
            theme_id: formData.themeId
        }])
        .select();

      if (data && data[0]) {
        setLink(`${window.location.origin}/card/${data[0].id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsPreview(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-12 px-6">
      <AnimatePresence mode="wait">
        {!isPreview ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-md w-full"
          >
            <div className="text-center mb-8 text-slate-900">
                <h1 className="text-4xl font-playfair italic font-bold">Eid Greeting Maker</h1>
                <p className="text-gray-500 text-sm mt-2">Craft your digital nostalgia</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-8 border border-gray-100">
              
              {/* Theme Selector */}
              <div className="relative">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 block text-center font-bold">1. Select Design</label>
                <div className="flex items-center justify-between">
                    <button onClick={prevTheme} type="button" className="p-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition"><ChevronLeft size={20} /></button>
                    <div className="w-40 h-56 overflow-hidden rounded-2xl shadow-inner border-[6px] border-gray-50 bg-white">
                        <motion.img 
                            key={themeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            src={COVERS[themeIndex].image} className="w-full h-full object-cover"
                        />
                    </div>
                    <button onClick={nextTheme} type="button" className="p-2 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition"><ChevronRight size={20} /></button>
                </div>
                <p className="text-center mt-3 text-xs font-medium text-slate-600 italic">{COVERS[themeIndex].name}</p>
              </div>

              {/* Names - FIXED COLOR HERE */}
              <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-2 mb-1 block">From</label>
                    <input 
                      placeholder="Your Name" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-1 focus:ring-amber-200 transition text-sm text-slate-900 placeholder:text-gray-400" 
                      onChange={(e) => setFormData({...formData, sender: e.target.value})} 
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-2 mb-1 block">To</label>
                    <input 
                      placeholder="Friend's Name" 
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-1 focus:ring-amber-200 transition text-sm text-slate-900 placeholder:text-gray-400" 
                      onChange={(e) => setFormData({...formData, receiver: e.target.value})} 
                    />
                  </div>
              </div>

              {/* Wishes - FIXED COLOR HERE */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-4 block text-center font-bold">2. Choose a Wish</label>
                <div className="flex items-center justify-between gap-2">
                  <button onClick={prevWish} type="button" className="text-gray-400 hover:text-amber-600"><ChevronLeft size={20} /></button>
                  <div className="flex-1 min-h-[60px] flex items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={wishIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-sm italic font-serif text-slate-800"
                      >
                        "{PRESET_WISHES[wishIndex].text}"
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <button onClick={nextWish} type="button" className="text-gray-400 hover:text-amber-600"><ChevronRight size={20} /></button>
                </div>
                <textarea 
                  value={formData.message} 
                  className="w-full mt-4 bg-white border border-gray-200 p-4 rounded-xl text-sm outline-none resize-none h-24 text-center text-slate-900 shadow-sm" 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                />
              </div>

              <button 
                onClick={() => setIsPreview(true)}
                disabled={!formData.sender || !formData.receiver}
                className="w-full bg-[#344D41] text-white p-5 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg"
              >
                <Eye size={18} /> Preview Card
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- PREVIEW MODE --- */
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-lg">
            <header className="text-center mb-6">
                <span className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Live Preview</span>
            </header>
            
            <div className="w-full py-4 min-h-[500px] flex items-center justify-center">
              <EidCard receiver={formData.receiver} message={formData.message} sender={formData.sender} themeId={formData.themeId} />
            </div>

            <div className="flex gap-4 mt-8 w-full px-4">
              <button onClick={() => setIsPreview(false)} className="flex-1 bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-medium">
                <Edit3 size={18} /> Edit
              </button>
              <button onClick={createCard} disabled={loading} className="flex-[2] bg-[#344D41] text-white p-4 rounded-2xl font-medium flex items-center justify-center gap-2 shadow-lg">
                {loading ? "Saving..." : <><Sparkles size={18} /> Confirm & Share</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Result */}
      {link && !isPreview && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 p-6 bg-white rounded-[2.5rem] shadow-2xl border-2 border-dashed border-amber-200 max-w-md w-full">
          <p className="text-[10px] text-center text-gray-400 mb-4 tracking-[0.2em] uppercase font-bold">Your Link is Ready</p>
          <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <code className="flex-1 truncate text-xs text-amber-900 font-medium px-2">{link}</code>
            <button 
              onClick={() => { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
              className="p-3 bg-amber-100 text-amber-700 rounded-xl transition"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </motion.div>
      )}
    </main>
  );
}