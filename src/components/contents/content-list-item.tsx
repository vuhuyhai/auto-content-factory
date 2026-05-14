'use client';

import Link from 'next/link';
import { FileText, Calendar, Workflow as WorkflowIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  CONTENT_STATUS_LABELS,
  type ContentWithWorkflow,
} from '@/lib/contents/types';

interface Props {
  content: ContentWithWorkflow;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

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

export function ContentListItem({ content, isSelected, onToggleSelect }: Props) {
  const variantCount = content.variants?.length ?? 0;
  const statusLabel = CONTENT_STATUS_LABELS[content.status];
  const checkboxId = `select-${content.id}`;
  const titleId = `title-${content.id}`;

  return (
    <div className="flex items-start gap-3">
      <label htmlFor={checkboxId} className="sr-only">
        Chọn nội dung
      </label>
      <Checkbox
        id={checkboxId}
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(content.id)}
        aria-labelledby={titleId}
        className="mt-7"
      />
      <Link
        href={`/dashboard/contents/${content.id}`}
        className="block flex-1"
      >
        <Card
          className={cn(
            'p-6 transition-all hover:shadow-md',
            isSelected
              ? 'border-red-500 bg-red-50/30'
              : 'hover:border-[#c73937]/30'
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              id={titleId}
              className="text-lg font-semibold leading-snug line-clamp-2 flex-1"
            >
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
    </div>
  );
}
