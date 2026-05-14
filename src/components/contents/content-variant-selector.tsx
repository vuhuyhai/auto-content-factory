'use client';

import { useState, useTransition } from 'react';
import { Check, Copy, Loader2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContentVariant } from '@/lib/content/types';
import {
  CONTENT_STATUS_LABELS,
  normalizeHashtag,
  type ContentStatus,
  type VariantFields,
} from '@/lib/contents/types';
import { selectVariant, updateContentStatus } from '@/app/dashboard/contents/actions';
import { VariantEditor } from './variant-editor';

interface Props {
  contentId: string;
  variants: ContentVariant[];
  initialSelectedIndex: number;
  status: ContentStatus;
}

const STATUS_BADGE_CLASS: Record<ContentStatus, string> = {
  generating: 'bg-gray-200 text-gray-800 hover:bg-gray-200',
  draft: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-100',
  approved: 'bg-green-600 text-white hover:bg-green-600',
  rejected: 'bg-red-600 text-white hover:bg-red-600',
};

export function ContentVariantSelector({
  contentId,
  variants,
  initialSelectedIndex,
  status,
}: Props) {
  const [activeTab, setActiveTab] = useState(initialSelectedIndex);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [copiedTab, setCopiedTab] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<ContentStatus>(status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [localVariants, setLocalVariants] = useState<ContentVariant[]>(variants);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  function handleVariantSaved(index: number, newFields: VariantFields) {
    setLocalVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...newFields };
      return next;
    });
    setEditingVariantIndex(null);
    setToast({ type: 'success', msg: 'Đã lưu thay đổi' });
    setTimeout(() => setToast(null), 3000);
  }

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

  async function handleUpdateStatus(newStatus: ContentStatus) {
    const prev = currentStatus;
    setCurrentStatus(newStatus);
    setIsUpdatingStatus(true);
    try {
      await updateContentStatus({ contentId, status: newStatus });
      setToast({ type: 'success', msg: `Đã chuyển trạng thái sang ${CONTENT_STATUS_LABELS[newStatus]}` });
    } catch {
      setCurrentStatus(prev);
      setToast({ type: 'error', msg: 'Cập nhật trạng thái thất bại. Anh thử lại nhé.' });
    } finally {
      setIsUpdatingStatus(false);
      setTimeout(() => setToast(null), 3000);
    }
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

      <div className="mb-4 pb-4 border-b border-gray-200 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <Badge className={STATUS_BADGE_CLASS[currentStatus]}>
          {CONTENT_STATUS_LABELS[currentStatus]}
        </Badge>

        {currentStatus === 'draft' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus('approved')}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Duyệt
            </button>
            <button
              onClick={() => handleUpdateStatus('rejected')}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Từ chối
            </button>
          </div>
        )}

        {(currentStatus === 'approved' || currentStatus === 'rejected') && (
          <button
            onClick={() => handleUpdateStatus('draft')}
            disabled={isUpdatingStatus}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#c73937] disabled:opacity-50 transition-colors self-start sm:self-auto"
          >
            {isUpdatingStatus && <Loader2 className="w-3 h-3 animate-spin" />}
            Đặt lại chờ duyệt
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {localVariants.map((_, i) => (
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

      {localVariants.map((v, i) => (
        <div key={i} className={activeTab === i ? 'block' : 'hidden'}>
          {editingVariantIndex === i ? (
            <VariantEditor
              contentId={contentId}
              variantIndex={i}
              initialFields={{
                hook: v.hook,
                title: v.title,
                body: v.body,
                hashtags: v.hashtags,
              }}
              onSaved={(newFields) => handleVariantSaved(i, newFields)}
              onCancel={() => setEditingVariantIndex(null)}
            />
          ) : (
            <>
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

              <div className="flex flex-wrap gap-3">
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

                <button
                  onClick={() => setEditingVariantIndex(i)}
                  disabled={editingVariantIndex !== null}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Sửa nội dung
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
