import Link from 'next/link';
import { OCCASIONS } from '@/app/data/occasions';
import { coversFor } from '@/app/data/covers';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-playfair italic font-bold text-slate-900 text-center">e-eidcard</h1>
      <p className="text-gray-500 text-sm mt-2 mb-10 text-center">Beautiful animated cards in under a minute</p>
      <div className="grid gap-5 w-full max-w-md">
        {OCCASIONS.map((o) => {
          const soon = coversFor(o.id).length === 0;
          return (
            <Link key={o.id} href={`/create/${o.id}`}
              className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition">
              <span className="text-4xl">{o.emoji}</span>
              <span className="flex-1">
                <span className="block text-lg font-semibold text-slate-900">{o.cardTitle}</span>
                <span className="block text-xs text-gray-500">{o.subtitle}</span>
              </span>
              {soon && <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full">Soon</span>}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
