"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function EidCard({ receiver, message, sender, themeId }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const getCoverImage = (id: number) => {
    if (id === 1) return "/cover1.png";
    if (id >= 2 && id <= 5) return `/cover${id}.jpeg`;
    return `/cover${id}.png`; 
  };

  const coverImage = getCoverImage(themeId);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {/* The Container */}
      <div 
        className="relative w-full max-w-[320px] h-[460px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ perspective: "2500px" }} 
      >
        {/* THE BACK PAGE (The one that stays still) */}
        <div className="absolute inset-0 w-full h-full bg-[#fdfdfd] rounded-2xl shadow-lg border border-gray-100 p-10 flex flex-col justify-center text-center">
             <div className="space-y-4">
                <h2 className="text-2xl font-playfair italic text-gray-800">To {receiver || "Friend"}</h2>
                <div className="w-8 h-[1px] bg-amber-200 mx-auto" />
                <p className="text-gray-600 font-light italic leading-relaxed text-sm">
                  "{message || "Wishing you a blessed Eid!"}"
                </p>
                <div className="pt-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">With love,</p>
                    <p className="text-xl font-playfair text-gray-900">{sender || "Someone"}</p>
                </div>
            </div>
            {/* Spine Shadow Effect */}
            <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-black/5 to-transparent rounded-l-2xl" />
        </div>

        {/* THE FRONT COVER (The one that flips) */}
        <motion.div
          className="w-full h-full relative z-30"
          style={{ 
            transformStyle: "preserve-3d",
            transformOrigin: "left" // This makes it flip like a book/card
          }}
          animate={{ 
            rotateY: isOpen ? -110 : 0,
            x: isOpen ? 15 : 0 // Subtle shift to keep it centered when open
          }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* COVER FACE */}
          <div 
            className="absolute inset-0 w-full h-full z-20 shadow-xl rounded-2xl overflow-hidden border border-gray-100" 
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" key={coverImage} />
            <div className="absolute bottom-6 left-0 right-0 text-center">
               <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[9px] tracking-[0.3em] uppercase border border-white/30">
                 {isOpen ? "Close" : "Open"}
               </span>
            </div>
          </div>

          {/* INNER COVER FACE (What you see on the left side when card is open) */}
          <div 
            className="absolute inset-0 w-full h-full bg-[#fcfcfc] rounded-2xl z-10" 
            style={{ 
                backfaceVisibility: "hidden", 
                WebkitBackfaceVisibility: "hidden", 
                transform: "rotateY(180deg)" 
            }}
          >
            {/* This adds a "paper" look to the back of the cover */}
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