export type OccasionId = 'eid' | 'birthday';

export interface Occasion {
  id: OccasionId;
  title: string;      
  cardTitle: string;  
  subtitle: string;
  emoji: string;
  accent: string;    
  receiverPlaceholder: string;
}

export const OCCASIONS: Occasion[] = [
  { id: 'eid', title: 'Eid Greeting Maker', cardTitle: 'Eid Mubarak', subtitle: 'Craft your digital nostalgia', emoji: '🌙', accent: '#344D41', receiverPlaceholder: "Friend's Name" },
  { id: 'birthday', title: 'Birthday Card Maker', cardTitle: 'Happy Birthday', subtitle: 'Make someone’s day special', emoji: '🎂', accent: '#9A3F5C', receiverPlaceholder: 'Birthday person' },
];

export const getOccasion = (id?: string): Occasion | undefined => OCCASIONS.find((o) => o.id === id);
// Old cards saved before occasions existed have no value, so they count as Eid.
export const occasionOrDefault = (id?: string | null): Occasion => getOccasion(id ?? 'eid') ?? OCCASIONS[0];
