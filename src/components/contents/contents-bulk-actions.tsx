'use client';

import { useEffect, useState, useTransition } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ContentListItem } from './content-list-item';
import { bulkUpdateStatus } from '@/app/dashboard/contents/actions';
import type { ContentStatus, ContentWithWorkflow } from '@/lib/contents/types';

interface Props {
  contents: ContentWithWorkflow[];
  statusFilter?: ContentStatus;
}

type ToastState = { type: 'success' | 'error'; msg: string } | null;

export function ContentsBulkActions({ contents, statusFilter }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const total = contents.length;
  const selectedCount = selectedIds.size;
  const allSelected = total > 0 && selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.size === total ? new Set() : new Set(contents.map((c) => c.id))
    );
  }

  function runBulk(status: ContentStatus) {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    startTransition(async () => {
      const result = await bulkUpdateStatus({ ids, status });
      if (result.success) {
        const label = status === 'approved' ? 'duyệt' : 'từ chối';
        setSelectedIds(new Set());
        setToast({
          type: 'success',
          msg: `Đã ${label} ${result.updated_count} nội dung`,
        });
      } else {
        setToast({ type: 'error', msg: result.error ?? 'Có lỗi xảy ra' });
      }
    });
  }

  return (
    <div>
      {toast && (
        <div
          className={cn(
            'mb-4 px-4 py-3 rounded-lg text-sm',
            toast.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          )}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3 pl-1">
        <Checkbox
          id="select-all"
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={toggleAll}
        />
        <label htmlFor="select-all" className="text-sm text-gray-600 cursor-pointer">
          Chọn tất cả {total} nội dung trong trang
        </label>
      </div>

      <div className="grid gap-4">
        {contents.map((content) => (
          <ContentListItem
            key={content.id}
            content={content}
            isSelected={selectedIds.has(content.id)}
            onToggleSelect={toggleOne}
          />
        ))}
      </div>

      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg animate-in slide-in-from-bottom-2">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-gray-700">
              Đã chọn {selectedCount} nội dung
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                disabled={isPending}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Bỏ chọn
              </button>
              <button
                type="button"
                onClick={() => runBulk('rejected')}
                disabled={isPending}
                className="px-4 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={() => runBulk('approved')}
                disabled={isPending}
                className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
              >
                Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
