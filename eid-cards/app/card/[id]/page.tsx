import { createClient } from '@supabase/supabase-js';
import EidCard from '@/app/components/EidCard';

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

  if (!card) return <div className="h-screen flex items-center justify-center font-playfair">Card not found.</div>;

  return (
    <main className="bg-[#FDFBF7]">
      <EidCard 
        receiver={card.receiver_name} 
        message={card.message} 
        sender={card.sender_name}
        themeId={card.theme_id}
      />
    </main>
  );
}