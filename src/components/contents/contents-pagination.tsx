import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONTENTS_PAGE_SIZE, type ContentStatus } from '@/lib/contents/types';

interface Props {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  statusFilter?: ContentStatus;
}

function buildHref(page: number, status?: ContentStatus): string {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/dashboard/contents?${qs}` : '/dashboard/contents';
}

const BTN_BASE =
  'inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors';
const BTN_ENABLED =
  'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600';
const BTN_DISABLED =
  'border-gray-200 text-gray-300 pointer-events-none';

export function ContentsPagination({
  currentPage,
  totalPages,
  totalCount,
  statusFilter,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * CONTENTS_PAGE_SIZE + 1;
  const end = Math.min(currentPage * CONTENTS_PAGE_SIZE, totalCount);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        {start}-{end} / {totalCount} nội dung
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(currentPage - 1, statusFilter)}
          className={cn(BTN_BASE, prevDisabled ? BTN_DISABLED : BTN_ENABLED)}
          aria-disabled={prevDisabled}
          tabIndex={prevDisabled ? -1 : undefined}
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
        </Link>
        <Link
          href={buildHref(currentPage + 1, statusFilter)}
          className={cn(BTN_BASE, nextDisabled ? BTN_DISABLED : BTN_ENABLED)}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : undefined}
        >
          Sau
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
