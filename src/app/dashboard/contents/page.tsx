import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';
import {
  countContentsByStatusForCurrentUser,
  getContentsTotalCount,
  getCurrentUserContents,
} from '@/lib/contents/queries';
import {
  CONTENT_STATUS_LABELS,
  CONTENTS_PAGE_SIZE,
  type ContentStatus,
} from '@/lib/contents/types';
import { ContentsFilterTabs } from '@/components/contents/contents-filter-tabs';
import { ContentsPagination } from '@/components/contents/contents-pagination';
import { ContentsBulkActions } from '@/components/contents/contents-bulk-actions';

export const dynamic = 'force-dynamic';

type FilterKey = ContentStatus | 'all';

const VALID_FILTERS: ReadonlySet<ContentStatus> = new Set(['draft', 'approved', 'rejected']);

function parseStatus(raw: string | undefined): ContentStatus | undefined {
  if (raw && VALID_FILTERS.has(raw as ContentStatus)) {
    return raw as ContentStatus;
  }
  return undefined;
}

function parsePage(raw: string | undefined): number {
  if (!raw) return 1;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

const EMPTY_MESSAGES: Record<FilterKey, string> = {
  all: 'Bạn chưa có nội dung nào. Tạo một workflow để hệ thống tự viết content theo lịch.',
  draft: 'Không có content nào chờ duyệt. 🎉',
  approved: 'Chưa duyệt content nào.',
  rejected: 'Chưa từ chối content nào.',
  generating: 'Không có content nào đang tạo.',
};

function baseHref(status?: ContentStatus): string {
  return status ? `/dashboard/contents?status=${status}` : '/dashboard/contents';
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function ContentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsedStatus = parseStatus(params.status);
  const currentStatus: FilterKey = parsedStatus ?? 'all';
  const requestedPage = parsePage(params.page);

  const [counts, totalCount, contents] = await Promise.all([
    countContentsByStatusForCurrentUser(),
    getContentsTotalCount(parsedStatus),
    getCurrentUserContents(parsedStatus, requestedPage),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / CONTENTS_PAGE_SIZE));

  if (requestedPage > totalPages && totalCount > 0) {
    redirect(baseHref(parsedStatus));
  }

  const currentPage = requestedPage;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nội dung đã tạo</h1>
        <p className="text-gray-500">
          {totalCount} nội dung
          {currentStatus !== 'all' ? ` · ${CONTENT_STATUS_LABELS[currentStatus]}` : ''}
        </p>
      </div>

      <div className="mb-6">
        <ContentsFilterTabs currentStatus={currentStatus} counts={counts} />
      </div>

      {contents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <FileText className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 max-w-md">{EMPTY_MESSAGES[currentStatus]}</p>
          {currentStatus === 'all' && (
            <Link
              href="/dashboard/workflows/new"
              className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Tạo workflow đầu tiên
            </Link>
          )}
          {currentPage > 1 && (
            <p className="text-sm text-gray-500 mt-3">
              Trang {currentPage} không có nội dung.{' '}
              <Link href={baseHref(parsedStatus)} className="text-red-600 hover:underline">
                Quay lại trang đầu.
              </Link>
            </p>
          )}
        </div>
      ) : (
        <>
          <ContentsBulkActions contents={contents} statusFilter={parsedStatus} />

          <ContentsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            statusFilter={parsedStatus}
          />
        </>
      )}
    </div>
  );
}
