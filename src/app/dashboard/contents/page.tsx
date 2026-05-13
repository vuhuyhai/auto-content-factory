import Link from 'next/link';
import { FileText, Calendar, Workflow as WorkflowIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  countContentsByStatusForCurrentUser,
  getCurrentUserContents,
} from '@/lib/contents/queries';
import { CONTENT_STATUS_LABELS, type ContentStatus } from '@/lib/contents/types';
import { ContentsFilterTabs } from '@/components/contents/contents-filter-tabs';

export const dynamic = 'force-dynamic';

type FilterKey = ContentStatus | 'all';

const VALID_FILTERS: ReadonlySet<ContentStatus> = new Set(['draft', 'approved', 'rejected']);

function parseStatus(raw: string | undefined): ContentStatus | undefined {
  if (raw && VALID_FILTERS.has(raw as ContentStatus)) {
    return raw as ContentStatus;
  }
  return undefined;
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

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function ContentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsedStatus = parseStatus(params.status);
  const currentStatus: FilterKey = parsedStatus ?? 'all';

  const [counts, contents] = await Promise.all([
    countContentsByStatusForCurrentUser(),
    getCurrentUserContents(parsedStatus),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nội dung đã tạo</h1>
        <p className="text-gray-500">
          {contents.length} nội dung
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
        </div>
      ) : (
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
      )}
    </div>
  );
}
