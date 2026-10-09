"use client";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getCover } from '@/app/data/covers';
import { occasionOrDefault } from '@/app/data/occasions';

interface Props {
  receiver?: string;
  message?: string;
  sender?: string;
  themeId: number;
  occasion?: string;
}

const CONFETTI_COLORS = ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'];

export default function GreetingCard({ receiver, message, sender, themeId, occasion }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const occ = occasionOrDefault(occasion);
  const cover = getCover(themeId);
  const coverImage = cover.image;

  // Random pieces are only created after the first open (client only), so no hydration mismatch.
  const confetti = useMemo(
    () => (isOpen && occ.id === 'birthday'
      ? Array.from({ length: 26 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.8,
          size: 6 + Math.random() * 6,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          rotate: Math.random() * 360,
        }))
      : []),
    [isOpen, occ.id],
  );

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <div
        className="relative w-full max-w-[320px] h-[460px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ perspective: '2500px' }}
        role="button"
        aria-label={isOpen ? 'Close card' : 'Open card'}
      >
        {/* INSIDE PAGE */}
        <div className="absolute inset-0 w-full h-full bg-[#fdfdfd] rounded-2xl shadow-lg border border-gray-100 p-10 flex flex-col justify-center text-center overflow-hidden">
          <div className="space-y-4">
            <h3 className="text-amber-600 font-playfair text-lg tracking-widest uppercase mb-2">{occ.cardTitle}</h3>
            <h2 className="text-2xl font-playfair italic text-gray-800" dir="auto">To {receiver || 'Friend'}</h2>
            <div className="w-8 h-[1px] bg-amber-200 mx-auto" />
            <p dir="auto" className="text-gray-600 font-light italic leading-relaxed text-sm">
              “{message || 'Wishing you a blessed day!'}”
            </p>
            <div className="pt-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">With love,</p>
              <p className="text-xl font-playfair text-gray-900" dir="auto">{sender || 'Someone'}</p>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/5 to-transparent rounded-l-2xl" />

          {confetti.map((c) => (
            <motion.span
              key={c.id}
              className="absolute top-0 rounded-sm pointer-events-none"
              style={{ left: `${c.left}%`, width: c.size, height: c.size * 0.6, background: c.color }}
              initial={{ y: -20, opacity: 0, rotate: 0 }}
              animate={{ y: 480, opacity: [0, 1, 1, 0], rotate: c.rotate + 360 }}
              transition={{ duration: 2.6, delay: 1 + c.delay, ease: 'easeIn' }}
            />
          ))}
        </div>

        {/* COVER (flips open) */}
        <motion.div
          className="w-full h-full relative z-30"
          style={{ transformStyle: 'preserve-3d', transformOrigin: 'left' }}
          animate={{ rotateY: isOpen ? -110 : 0, x: isOpen ? 15 : 0 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div
            className="absolute inset-0 w-full h-full z-20 shadow-xl rounded-2xl overflow-hidden border border-gray-100"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" key={coverImage} />
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] tracking-[0.3em] uppercase border border-white/30">
                {isOpen ? 'Close' : 'Open'}
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 w-full h-full bg-[#fcfcfc] rounded-2xl z-10"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="w-full h-full bg-gradient-to-l from-black/5 to-transparent rounded-2xl opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 grayscale">
              <img src={coverImage} className="w-24 h-24 object-contain" alt="" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
