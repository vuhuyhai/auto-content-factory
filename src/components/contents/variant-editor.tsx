'use client';

import { useState, useTransition } from 'react';
import { updateVariantContent } from '@/app/dashboard/contents/actions';
import type { VariantFields } from '@/lib/contents/types';

interface VariantEditorProps {
  contentId: string;
  variantIndex: number;
  initialFields: VariantFields;
  onSaved: (newFields: VariantFields) => void;
  onCancel: () => void;
}

export function VariantEditor({
  contentId,
  variantIndex,
  initialFields,
  onSaved,
  onCancel,
}: VariantEditorProps) {
  const [hook, setHook] = useState(initialFields.hook);
  const [title, setTitle] = useState(initialFields.title);
  const [body, setBody] = useState(initialFields.body);
  const [hashtagsRaw, setHashtagsRaw] = useState(initialFields.hashtags.join(' '));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);

    const hashtagsParsed = hashtagsRaw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (hashtagsParsed.length === 0) {
      setError('Phải có tối thiểu 1 hashtag');
      return;
    }

    const newFields: VariantFields = {
      hook: hook.trim(),
      title: title.trim(),
      body: body.trim(),
      hashtags: hashtagsParsed,
    };

    startTransition(async () => {
      const result = await updateVariantContent({
        contentId,
        variantIndex,
        fields: newFields,
      });

      if (result.success) {
        const normalizedFields: VariantFields = {
          ...newFields,
          hashtags: hashtagsParsed.map((t) => (t.startsWith('#') ? t : `#${t}`)),
        };
        onSaved(normalizedFields);
      } else {
        setError(result.error ?? 'Lưu thất bại');
      }
    });
  };

  const counterClass = (current: number, min: number, max: number) => {
    if (current < min || current > max) return 'text-red-600 font-semibold';
    return 'text-gray-500';
  };

  const hashtagsCount = hashtagsRaw.split(/[\s,]+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label className="text-sm font-semibold text-gray-700">Hook</label>
          <span className={`text-xs ${counterClass(hook.length, 20, 500)}`}>
            {hook.length} / 20-500 ký tự
          </span>
        </div>
        <textarea
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isPending}
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label className="text-sm font-semibold text-gray-700">Tiêu đề</label>
          <span className={`text-xs ${counterClass(title.length, 10, 200)}`}>
            {title.length} / 10-200 ký tự
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isPending}
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label className="text-sm font-semibold text-gray-700">Nội dung</label>
          <span className={`text-xs ${counterClass(body.length, 100, 2000)}`}>
            {body.length} / 100-2000 ký tự
          </span>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isPending}
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <label className="text-sm font-semibold text-gray-700">
            Hashtag (cách nhau bằng dấu cách hoặc dấu phẩy)
          </label>
          <span className={`text-xs ${counterClass(hashtagsCount, 1, 10)}`}>
            {hashtagsCount} / 1-10 tag
          </span>
        </div>
        <input
          type="text"
          value={hashtagsRaw}
          onChange={(e) => setHashtagsRaw(e.target.value)}
          placeholder="#Ladysfit #SucKhoeChiEm"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isPending}
        />
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          Huỷ
        </button>
      </div>
    </div>
  );
}
