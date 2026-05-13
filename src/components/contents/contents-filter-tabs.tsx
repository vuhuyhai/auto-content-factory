import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ContentStatus } from '@/lib/contents/types';
import type { ContentStatusCounts } from '@/lib/contents/queries';

type FilterKey = ContentStatus | 'all';

interface TabDef {
  key: FilterKey;
  label: string;
  href: string;
}

const TABS: readonly TabDef[] = [
  { key: 'all', label: 'Tất cả', href: '/dashboard/contents' },
  { key: 'draft', label: 'Chờ duyệt', href: '/dashboard/contents?status=draft' },
  { key: 'approved', label: 'Đã duyệt', href: '/dashboard/contents?status=approved' },
  { key: 'rejected', label: 'Đã từ chối', href: '/dashboard/contents?status=rejected' },
] as const;

interface Props {
  currentStatus: FilterKey;
  counts: ContentStatusCounts;
}

export function ContentsFilterTabs({ currentStatus, counts }: Props) {
  return (
    <div className="flex gap-6 border-b border-border overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      {TABS.map((tab) => {
        const isActive = tab.key === currentStatus;
        const count = counts[tab.key];

        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              'inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 pt-2 text-sm transition-colors',
              isActive
                ? 'border-red-600 font-semibold text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            )}
          >
            <span>{tab.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
                  isActive ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
                )}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
