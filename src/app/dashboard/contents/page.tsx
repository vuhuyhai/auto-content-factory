import Link from 'next/link';
import { FileText, Calendar, Workflow as WorkflowIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentUserContents } from '@/lib/contents/queries';

export const dynamic = 'force-dynamic';

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

export default async function ContentsPage() {
  const contents = await getCurrentUserContents();

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <FileText className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Chưa có nội dung nào</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Khi workflow chạy, nội dung Claude tạo sẽ xuất hiện ở đây để bạn xem lại trước khi đăng.
        </p>
        <Link
          href="/dashboard/workflows"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#c73937] text-white rounded-lg hover:bg-[#a82e2c] transition-colors"
        >
          <WorkflowIcon className="w-4 h-4" />
          Xem workflows
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Nội dung đã tạo</h1>
        <p className="text-gray-500">{contents.length} nội dung Claude đã generate</p>
      </div>

      <div className="grid gap-4">
        {contents.map((content) => {
          const variantCount = content.variants?.length ?? 0;
          const statusLabel = {
            draft: 'Bản nháp',
            approved: 'Đã duyệt',
            rejected: 'Đã từ chối',
            sent: 'Đã gửi',
          }[content.status] ?? content.status;

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
    </div>
  );
}
