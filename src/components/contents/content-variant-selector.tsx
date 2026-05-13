'use client';

import { useState, useTransition } from 'react';
import { Check, Copy, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContentVariant } from '@/lib/content/types';
import { normalizeHashtag } from '@/lib/contents/types';
import { selectVariant } from '@/app/dashboard/contents/actions';

interface Props {
  contentId: string;
  variants: ContentVariant[];
  initialSelectedIndex: number;
}

export function ContentVariantSelector({ contentId, variants, initialSelectedIndex }: Props) {
  const [activeTab, setActiveTab] = useState(initialSelectedIndex);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [copiedTab, setCopiedTab] = useState<number | null>(null);

  function handleSelect(index: number) {
    const prev = selectedIndex;
    setSelectedIndex(index);

    startTransition(async () => {
      const result = await selectVariant(contentId, index);
      if (result.success) {
        setToast({ type: 'success', msg: `Đã chọn Variant ${index + 1}` });
      } else {
        setSelectedIndex(prev);
        setToast({ type: 'error', msg: result.error ?? 'Lỗi không xác định' });
      }
      setTimeout(() => setToast(null), 3000);
    });
  }

  function handleCopy(index: number) {
    const v = variants[index];
    if (!v) return;
    const tags = v.hashtags.map(normalizeHashtag).filter(Boolean).join(' ');
    const text = `${v.body}\n\n${tags}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTab(index);
      setTimeout(() => setCopiedTab(null), 2000);
    });
  }

  return (
    <div>
      {toast && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {variants.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === i
                ? 'border-[#c73937] text-[#c73937]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Variant {i + 1}
            {selectedIndex === i && (
              <Check className="inline w-3.5 h-3.5 ml-1 text-green-600" />
            )}
          </button>
        ))}
      </div>

      {variants.map((v, i) => (
        <div key={i} className={activeTab === i ? 'block' : 'hidden'}>
          <h2 className="text-xl font-semibold mb-3">{v.title}</h2>

          <div className="mb-4 p-4 bg-gray-50 border-l-4 border-[#c73937] rounded">
            <p className="italic text-gray-700">{v.hook}</p>
          </div>

          <div className="prose prose-sm max-w-none mb-6 whitespace-pre-wrap">
            {v.body}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {v.hashtags.map((tag, idx) => (
              <Badge key={idx} variant="secondary">
                {normalizeHashtag(tag)}
              </Badge>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSelect(i)}
              disabled={isPending || selectedIndex === i}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedIndex === i
                  ? 'bg-green-100 text-green-800 cursor-default'
                  : 'bg-[#c73937] text-white hover:bg-[#a82e2c] disabled:opacity-50'
              }`}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : selectedIndex === i ? (
                <Check className="w-4 h-4" />
              ) : null}
              {selectedIndex === i ? 'Đã chọn variant này' : 'Chọn variant này'}
            </button>

            <button
              onClick={() => handleCopy(i)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {copiedTab === i ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copiedTab === i ? 'Đã copy' : 'Copy nội dung'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
