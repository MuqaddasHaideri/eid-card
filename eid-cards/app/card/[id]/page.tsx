import type { Metadata } from 'next';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import GreetingCard from '@/app/components/GreetingCard';
import { cardsApi } from '@/app/lib/api';
import { occasionOrDefault } from '@/app/data/occasions';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const card = await cardsApi.getById(id);
  if (!card) return { title: 'Card not found' };
  const occ = occasionOrDefault(card.occasion);
  return { title: `${occ.cardTitle} from ${card.sender}`, description: `${card.sender} sent you a card. Tap to open it!` };
}

export default async function CardPage({ params }: Params) {
  const { id } = await params;
  const card = await cardsApi.getById(id);

  if (!card) {
    return (
      <div className="h-screen flex items-center justify-center font-playfair bg-[#FDFBF7] text-slate-800">
        Card not found.
      </div>
    );
  }

  const occ = occasionOrDefault(card.occasion);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-between py-12 px-6">
      <div className="text-center animate-bounce mt-4">
        <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
          ✨ Tap the card to open ✨
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-lg">
        <GreetingCard receiver={card.receiver} message={card.message} sender={card.sender} themeId={card.themeId} occasion={card.occasion} />
      </div>

      <div className="w-full max-w-md text-center mt-12 mb-8 space-y-4">
        <p className="text-slate-400 text-xs italic font-playfair" dir="auto">
          Liked this? Send a greeting back to {card.sender}!
        </p>
        <Link
          href={`/create/${occ.id}`}
          style={{ backgroundColor: occ.accent }}
          className="w-full inline-flex items-center justify-center gap-2 text-white p-4 rounded-2xl font-medium shadow-xl hover:opacity-90 transition-all transform active:scale-95"
        >
          <PlusCircle size={20} />
          Create your own card
        </Link>
      </div>
    </main>
  );
}
