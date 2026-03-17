import { createClient } from '@supabase/supabase-js';
import EidCard from '@/app/components/EidCard';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = await params;
  const cardId = resolvedParams.id;

  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId) 
    .single();

  if (!card) {
    return (
      <div className="h-screen flex items-center justify-center font-playfair bg-[#FDFBF7] text-slate-800">
        Card not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-between py-12 px-6">
      
      {/* 1. Header Hint for Friend */}
      <div className="text-center animate-bounce mt-4">
        <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
          ✨ Tap the card to open ✨
        </span>
      </div>

      {/* 2. The Card Container */}
      <div className="flex-1 flex items-center justify-center w-full max-w-lg">
        <EidCard 
          receiver={card.receiver_name} 
          message={card.message} 
          sender={card.sender_name}
          themeId={card.theme_id}
        />
      </div>

      {/* 3. Footer: Create Your Own Card */}
      <div className="w-full max-w-md text-center mt-12 mb-8 space-y-4">
        <p className="text-slate-400 text-xs italic font-playfair">
          Liked this? Send a greeting back to {card.sender_name}!
        </p>
        
        <Link 
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#344D41] text-white p-4 rounded-2xl font-medium shadow-xl hover:bg-[#2a3d34] transition-all transform active:scale-95"
        >
          <PlusCircle size={20} />
          Create your own e-EidCard
        </Link>
        
        <p className="text-[10px] text-slate-300 tracking-tighter uppercase font-bold">
          Developed by Muqaddas Haideri
        </p>
      </div>
    </main>
  );
}