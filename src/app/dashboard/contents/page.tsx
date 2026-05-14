import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, Calendar, Workflow as WorkflowIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  all: 'Chưa có nội dung nào. Workflow sẽ tự generate khi đến lịch.',
  draft: 'Không có content nào chờ duyệt. 🎉',
  approved: 'Chưa duyệt content nào.',
  rejected: 'Chưa từ chối content nào.',
  generating: 'Không có content nào đang tạo.',
};

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diffMin = Math.floor((now - t) / 60000);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

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
          <div className="grid gap-4">
            {contents.map((content) => {
              const variantCount = content.variants?.length ?? 0;
              const statusLabel = CONTENT_STATUS_LABELS[content.status];

              return (
                <Link
                  key={content.id}
                  href={`/dashboard/contents/${content.id}`}
                  className="block"
                >
                  <Card className="p-6 hover:shadow-md hover:border-[#c73937]/30 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-semibold leading-snug line-clamp-2 flex-1">
                        {content.source_title ?? 'Không có tiêu đề'}
                      </h3>
                      <Badge variant="outline" className="shrink-0">
                        {statusLabel}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <WorkflowIcon className="w-3.5 h-3.5" />
                        {content.workflow_name ?? 'Workflow'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatRelativeTime(content.generated_at)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {variantCount} variant
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

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
