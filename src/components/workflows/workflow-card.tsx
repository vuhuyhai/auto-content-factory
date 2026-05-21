'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  Calendar,
  Newspaper,
  Pin,
  Megaphone,
  Clock,
  Trash2,
  Pencil,
  Loader2,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  getContentTypeLabel,
  getScheduleLabel,
} from '@/lib/workflows/constants';
import type { WorkflowWithConfig } from '@/lib/workflows/types';
import {
  toggleWorkflowEnabled,
  deleteWorkflow,
  runWorkflow,
} from '@/app/dashboard/workflows/actions';

interface WorkflowCardProps {
  workflow: WorkflowWithConfig;
}

type ToastMessage = { type: 'success' | 'error'; text: string } | null;

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isRunning, startRunTransition] = useTransition();
  const [enabled, setEnabled] = useState(workflow.enabled);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastMessage>(null);

  // Auto-dismiss toast sau 5s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const name =
    workflow.config?.name ??
    `${getContentTypeLabel(workflow.type)} - ${getScheduleLabel(workflow.scheduleCron)}`;
  const typeLabel = getContentTypeLabel(workflow.type);
  const scheduleLabel = getScheduleLabel(workflow.scheduleCron);

  const TypeIcon =
    workflow.type === 'news_based'
      ? Newspaper
      : workflow.type === 'evergreen'
        ? Pin
        : Megaphone;

  function handleToggle() {
    const next = !enabled;
    // Optimistic update
    setEnabled(next);
    setErrorMsg(null);

    startTransition(async () => {
      const result = await toggleWorkflowEnabled(workflow.id, next);
      if (!result.ok) {
        // Revert
        setEnabled(!next);
        setErrorMsg(result.message ?? 'Có lỗi xảy ra.');
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteWorkflow(workflow.id);
      if (!result.ok) {
        setErrorMsg(result.message ?? 'Không thể xoá.');
      }
      // Nếu ok, revalidatePath sẽ remove card khỏi list
    });
  }

  function handleRun() {
    setToastMessage(null);
    setErrorMsg(null);

    startRunTransition(async () => {
      const result = await runWorkflow(workflow.id);
      if (result.success) {
        setToastMessage({
          type: 'success',
          text: result.message ?? 'Đã enqueue. Content sẽ hiện sau 1-2 phút.',
        });
      } else {
        setToastMessage({
          type: 'error',
          text: result.error ?? 'Không thể chạy workflow.',
        });
      }
    });
  }

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
                  Chạy gần nhất: {formatRelativeTime(new Date(workflow.lastRunAt))}
                </div>
              )}

              {errorMsg && (
                <div className="mt-2 text-xs text-red-600">{errorMsg}</div>
              )}

              {toastMessage && (
                <div
                  role="status"
                  className={`mt-2 rounded-md border px-3 py-2 text-xs ${
                    toastMessage.type === 'success'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-red-200 bg-red-50 text-red-700'
                  }`}
                >
                  {toastMessage.text}
                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant={enabled ? 'default' : 'secondary'}
              className={
                enabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-100'
              }
            >
              {enabled ? 'Đang chạy' : 'Tạm dừng'}
            </Badge>

            {/* Toggle button (custom switch) */}
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label={enabled ? 'Tạm dừng workflow' : 'Bật workflow'}
              onClick={handleToggle}
              disabled={isPending || isRunning}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
                enabled ? 'bg-pink-600' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>

            {/* Run-now button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={!enabled || isRunning || isPending}
              aria-label="Chạy workflow ngay"
              className="h-8 gap-1.5 border-pink-200 text-pink-700 hover:bg-pink-50 hover:text-pink-800 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Đang tạo content...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Chạy ngay
                </>
              )}
            </Button>

            {/* Edit button */}
            <Link
              href={`/dashboard/workflows/${workflow.id}/edit`}
              aria-label="Sửa workflow"
              title="Sửa workflow"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            >
              <Pencil className="h-4 w-4" />
            </Link>

            {/* Delete button + AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                  disabled={isPending || isRunning}
                  aria-label="Xoá workflow"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xoá workflow?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn sắp xoá workflow{' '}
                    <span className="font-semibold text-zinc-900">{name}</span>. Tất cả content đã sinh từ workflow này cũng sẽ bị xoá. Hành động này không hoàn tác được.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>Huỷ</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xoá...
                      </>
                    ) : (
                      'Xoá'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
