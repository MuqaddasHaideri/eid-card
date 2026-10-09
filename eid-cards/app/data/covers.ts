import type { OccasionId } from './occasions';

export interface Cover {
  id: number;
  name: string;
  image: string;
  occasion: OccasionId;
}

export const COVERS: Cover[] = [
  { id: 1, name: 'Minimalist Border', image: 'eidcards/cover1.png', occasion: 'eid' },
  { id: 2, name: 'Golden Mosque Silhouette', image: 'eidcards/cover2.jpeg', occasion: 'eid' },
  { id: 3, name: 'Vintage Floral Bouquet', image: 'eidcards/cover3.jpeg', occasion: 'eid' },
  { id: 4, name: 'Moonlit Night Sky', image: 'eidcards/cover4.jpeg', occasion: 'eid' },
  { id: 5, name: 'Blue Watercolor Splash', image: 'eidcards/cover5.jpeg', occasion: 'eid' },
  { id: 6, name: 'Happy Ghost Doodle', image: 'eidcards/cover6.png', occasion: 'eid' },
  { id: 7, name: 'Elegant Archway', image: 'eidcards/cover7.png', occasion: 'eid' },
  { id: 8, name: 'Pink Lantern Dream', image: 'eidcards/cover8.png', occasion: 'eid' },
  { id: 9, name: 'Geometric Gold Pattern', image: 'eidcards/cover9.png', occasion: 'eid' },
  { id: 10, name: 'Eid Meowbarak Cat', image: 'eidcards/cover10.png', occasion: 'eid' },
  { id: 11, name: 'Sage Mosque Silhouette', image: 'eidcards/cover11.jpeg', occasion: 'eid' },
  { id: 12, name: 'Floral Pastels & Lanterns', image: 'eidcards/cover12.jpeg', occasion: 'eid' },
  { id: 13, name: 'Monochrome Palms & Lanterns', image: 'eidcards/cover13.jpeg', occasion: 'eid' },
  { id: 14, name: 'Midnight Botanical', image: 'eidcards/cover14.png', occasion: 'eid' },
  { id: 15, name: 'Dreamy Marble Mosque', image: 'eidcards/cover15.jpeg', occasion: 'eid' },

];

export const coversFor = (occasion: OccasionId) => COVERS.filter((c) => c.occasion === occasion);

export const getCover = (id: number) => COVERS.find((c) => c.id === id) ?? COVERS[0];
