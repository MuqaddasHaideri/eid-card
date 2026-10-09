"use client";
import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, FileText, Lock } from 'lucide-react';
import BookmarkPreview, { PRINT_SIZES } from './BookmarkPreview';

// Later: set this from the user's paid status. Free = 2x + watermark, premium = 4x, no watermark.
const IS_PREMIUM = false;

interface Props {
  image: string;
  sender: string;
  receiver: string;
  message: string;
  accent: string;
  heading: string;
}

export default function ExportPanel(props: Props) {
  const [sizeId, setSizeId] = useState(PRINT_SIZES[0].id);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const size = PRINT_SIZES.find((s) => s.id === sizeId)!;
  const scale = size.id === 'bookmark' ? 0.5 : 0.6; // on-screen preview scale only
  const pixelRatio = IS_PREMIUM ? 4 : 2;

  const save = async (kind: 'png' | 'pdf') => {
    setBusy(kind); setError('');
    try {
      if (!ref.current) throw new Error('Nothing to render');
      const dataUrl = await toPng(ref.current, { pixelRatio, cacheBust: true });
      const name = `card-${sizeId}`;
      if (kind === 'png') {
        const a = document.createElement('a');
        a.href = dataUrl; a.download = `${name}.png`; a.click();
      } else {
        const pdf = new jsPDF({ unit: 'mm', format: [size.wMm, size.hMm], orientation: size.wMm > size.hMm ? 'l' : 'p' });
        pdf.addImage(dataUrl, 'PNG', 0, 0, size.wMm, size.hMm);
        pdf.save(`${name}.pdf`);
      }
    } catch (e) {
      console.error(e);
      setError('Could not create the file. Please try again.');
    } finally { setBusy(null); }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-md w-full">
      <p className="text-[10px] text-center text-gray-400 mb-4 tracking-[0.2em] uppercase font-bold">Print or Save</p>

      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {PRINT_SIZES.map((s) => (
          <button key={s.id} type="button" onClick={() => setSizeId(s.id)}
            className={`px-3 py-2 rounded-full text-xs border transition ${s.id === sizeId ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-200'}`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center py-2">
        <div className="shadow-lg overflow-hidden" style={{ width: size.px[0] * scale, height: size.px[1] * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: size.px[0], height: size.px[1] }}>
            <BookmarkPreview ref={ref} size={size} watermark={!IS_PREMIUM} {...props} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={() => save('png')} disabled={!!busy} className="flex-1 p-3 rounded-2xl bg-slate-900 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          <Download size={16} /> {busy === 'png' ? 'Saving…' : 'Image'}
        </button>
        <button onClick={() => save('pdf')} disabled={!!busy} className="flex-1 p-3 rounded-2xl bg-slate-900 text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50">
          <FileText size={16} /> {busy === 'pdf' ? 'Saving…' : 'PDF'}
        </button>
      </div>

      {!IS_PREMIUM && (
        <button type="button" onClick={() => console.log('upgrade_click')} className="mt-3 w-full p-3 rounded-2xl border border-dashed border-amber-300 text-amber-800 text-xs flex items-center justify-center gap-2">
          <Lock size={14} /> HD print file without watermark (coming soon)
        </button>
      )}
      {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
    </div>
  );
}
