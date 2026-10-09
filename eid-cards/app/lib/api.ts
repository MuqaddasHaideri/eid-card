import { createClient } from '@supabase/supabase-js';

/**
 * Every data call lives in this file. When your own backend is ready, replace the
 * bodies with fetch() calls; the pages and components do not need to change.
 *
 * One-time Supabase change so birthday cards can be saved:
 *   alter table cards add column occasion text default 'eid';
 * (Until you run it, creating a card will fail, because we now send `occasion`.)
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

export interface CardData {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  themeId: number;
  occasion: string;
}
export type NewCard = Omit<CardData, 'id'>;

export const cardsApi = {
  async create(card: NewCard): Promise<string> {
    if (!supabase) throw new Error('Missing Supabase environment variables');
    const { data, error } = await supabase
      .from('cards')
      .insert([{ sender_name: card.sender, receiver_name: card.receiver, message: card.message, theme_id: card.themeId, occasion: card.occasion }])
      .select()
      .single();
    if (error) throw error;
    return String(data.id);
  },

  async getById(id: string): Promise<CardData | null> {
    if (!supabase) return null;
    const { data } = await supabase.from('cards').select('*').eq('id', id).single();
    if (!data) return null;
    return {
      id: String(data.id),
      sender: data.sender_name,
      receiver: data.receiver_name,
      message: data.message,
      themeId: data.theme_id,
      occasion: data.occasion ?? 'eid',
    };
  },
};
