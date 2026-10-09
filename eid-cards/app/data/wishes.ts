import type { OccasionId } from './occasions';

export interface Wish { id: number; text: string }

export const EID_WISHES: Wish[] = [
  { id: 1, text: 'May this special day bring peace, happiness, and prosperity to you and your family.' },
  { id: 2, text: 'May Allah accept your prayers, reward your patience and bless you beyond what you asked for.' },
  { id: 3, text: 'May Allah accept all your duas and bless you and your family with immense happiness.' },
  { id: 4, text: 'May this Eid bring you closer to the ones who make your soul smile. Sending love!' },
  { id: 5, text: 'May the colors and joy of Eid brighten your day and fill your life with happiness.' },
  { id: 6, text: 'ڈبے میں ڈبہ، ڈبے میں انجکشن، عید والے دن دیکھنا میری دوست کے ایکشن' },
  { id: 7, text: 'آم کے رس کو جوس کہتے ہیں، جو عید کارڈ نہ بھیجے اسے کنجوس کہتے ہیں' },
  { id: 8, text: 'میرے ہاتھ میں پھول ہے کوئی اسلحہ تو نہیں، ایڈوانس عید مبارک بول دوں کوئی مسئلہ تو نہیں' },
];

export const BIRTHDAY_WISHES: Wish[] = [
  { id: 1, text: 'Happy Birthday! May this year bring you endless joy, good health and everything your heart desires.' },
  { id: 2, text: 'Another year older, another year more wonderful. Have the best birthday ever!' },
  { id: 3, text: 'Wishing you a day filled with laughter, love and cake. Happy Birthday!' },
  { id: 4, text: 'May Allah bless you with happiness, success and a long life. Happy Birthday!' },
  { id: 5, text: 'Cheers to you on your special day. Thank you for being such a blessing in my life.' },
  { id: 6, text: 'سالگرہ مبارک! اللہ آپ کو ہمیشہ خوش اور سلامت رکھے۔' },
];

export const WISHES: Record<OccasionId, Wish[]> = { eid: EID_WISHES, birthday: BIRTHDAY_WISHES };
