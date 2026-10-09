import { forwardRef } from 'react';

export interface PrintSize {
  id: string;
  label: string;
  wMm: number;
  hMm: number;
  px: [number, number]; // design size on screen
}

export const PRINT_SIZES: PrintSize[] = [
  { id: 'bookmark', label: 'Bookmark 50×150 mm', wMm: 50, hMm: 150, px: [300, 900] },
  { id: 'a6', label: 'Card A6', wMm: 105, hMm: 148, px: [420, 592] },
  { id: 'square', label: 'Square post', wMm: 100, hMm: 100, px: [400, 400] },
];

interface Props {
  size: PrintSize;
  image: string;
  sender: string;
  receiver: string;
  message: string;
  accent: string;
  heading: string;
  watermark: boolean;
}

/** Static (non-animated) version of the card, used only for image/PDF export. */
const BookmarkPreview = forwardRef<HTMLDivElement, Props>(function BookmarkPreview(
  { size, image, sender, receiver, message, accent, heading, watermark }, ref,
) {
  const [w, h] = size.px;
  const tall = h > w * 1.5;
  return (
    <div ref={ref} style={{ width: w, height: h, background: '#FDFBF7', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Georgia, serif' }}>
      <div style={{ flex: tall ? 1.1 : 1.2, backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ flex: 1, padding: tall ? 18 : 22, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: accent }}>{heading}</div>
        <div dir="auto" style={{ fontSize: 11, color: '#999' }}>Dear {receiver}</div>
        <div dir="auto" style={{ fontSize: tall ? 13 : 15, fontStyle: 'italic', color: '#222', lineHeight: 1.6 }}>{message}</div>
        <div dir="auto" style={{ fontSize: 12, color: accent, fontWeight: 700 }}>— {sender}</div>
        {watermark && <div style={{ fontSize: 8, color: '#bbb', marginTop: 4 }}>Made with e-eidcard</div>}
      </div>
    </div>
  );
});

export default BookmarkPreview;
