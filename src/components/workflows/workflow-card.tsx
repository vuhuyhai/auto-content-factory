import { Calendar, Newspaper, Pin, Megaphone, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  getContentTypeLabel,
  getScheduleLabel,
} from '@/lib/workflows/constants';
import type { WorkflowWithConfig } from '@/lib/workflows/types';

interface WorkflowCardProps {
  workflow: WorkflowWithConfig;
}

/**
 * Card hiển thị 1 workflow trong list.
 * Day 8 readonly. Day 8 M4 sẽ thêm toggle + delete.
 */
export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const name = workflow.config?.name ?? `${getContentTypeLabel(workflow.type)} - ${getScheduleLabel(workflow.scheduleCron)}`;
  const typeLabel = getContentTypeLabel(workflow.type);
  const scheduleLabel = getScheduleLabel(workflow.scheduleCron);

  const TypeIcon =
    workflow.type === 'news_based'
      ? Newspaper
      : workflow.type === 'evergreen'
        ? Pin
        : Megaphone;

  return (
    <Card className="transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-100">
              <TypeIcon className="h-4 w-4 text-pink-600" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-zinc-900">
                {name}
              </h3>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {scheduleLabel}
                </span>
                <span className="text-zinc-300">•</span>
                <span>{typeLabel}</span>
              </div>

              {workflow.lastRunAt && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  Chạy gần nhất: {formatRelativeTime(workflow.lastRunAt)}
                </div>
              )}
            </div>
          </div>

          <Badge
            variant={workflow.enabled ? 'default' : 'secondary'}
            className={
              workflow.enabled
                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-100'
            }
          >
            {workflow.enabled ? 'Đang chạy' : 'Tạm dừng'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}
