import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getContentById } from '@/lib/contents/queries';
import { ContentVariantSelector } from '@/components/contents/content-variant-selector';

export const dynamic = 'force-dynamic';

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const content = await getContentById(id);

  if (!content) {
    notFound();
  }

  const variants = content.variants ?? [];
  const selectedIndex = content.selected_variant_index ?? 0;

  const statusLabel = {
    draft: 'Bản nháp',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
    sent: 'Đã gửi',
  }[content.status] ?? content.status;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/dashboard/contents"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c73937] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại danh sách
      </Link>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-2xl font-bold leading-tight flex-1">
            {content.source_title ?? 'Không có tiêu đề'}
          </h1>
          <Badge variant="outline" className="shrink-0">
            {statusLabel}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(content.generated_at).toLocaleString('vi-VN')}
          </span>
          {content.source_url && (
            <a
              href={content.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#c73937] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Xem bài nguồn
            </a>
          )}
        </div>
      </div>

      {variants.length === 0 ? (
        <div className="p-6 border border-amber-200 bg-amber-50 rounded-lg text-amber-800">
          Content này chưa có variant nào. Có thể workflow generate đã fail.
        </div>
      ) : (
        <ContentVariantSelector
          contentId={content.id}
          variants={variants}
          initialSelectedIndex={selectedIndex}
        />
      )}
    </div>
  );
}
