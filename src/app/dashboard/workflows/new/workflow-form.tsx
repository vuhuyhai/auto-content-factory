'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { workflowFormSchema, type WorkflowFormSchema } from '@/lib/workflows/schemas';
import type { z } from 'zod';

type WorkflowFormInput = z.input<typeof workflowFormSchema>;
type WorkflowFormOutput = z.output<typeof workflowFormSchema>;
import { CONTENT_TYPES, SCHEDULE_PRESETS } from '@/lib/workflows/constants';
import { DEFAULT_WORKFLOW_FORM_DATA } from '@/lib/workflows/types';
import { createWorkflow } from '../actions';

export function WorkflowForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newSourceInput, setNewSourceInput] = useState('');

  const form = useForm<WorkflowFormInput, unknown, WorkflowFormOutput>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: DEFAULT_WORKFLOW_FORM_DATA,
    mode: 'onBlur',
  });

  const watchedType = form.watch('type');
  const watchedSources = form.watch('newsSources') ?? [];
  const needsNewsSource = watchedType === 'news_based';

  function addNewsSource() {
    const trimmed = newSourceInput.trim();
    if (!trimmed) return;
    const current = form.getValues('newsSources') ?? [];
    form.setValue('newsSources', [...current, trimmed], { shouldValidate: true });
    setNewSourceInput('');
  }

  function removeNewsSource(index: number) {
    const current = form.getValues('newsSources') ?? [];
    form.setValue(
      'newsSources',
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  function onSubmit(values: WorkflowFormOutput) {
    setServerError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await createWorkflow(values);

      if (!result?.ok) {
        setServerError(result?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.');
        if (result?.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6"
    >
      {/* Server error banner */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">{serverError}</p>
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li key={field}>
                    <span className="font-medium">{getFieldLabel(field)}:</span> {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Field 1: Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên workflow <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="VD: Tin tức ngành sáng 7h"
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Field 2: Content type */}
      <div className="space-y-2">
        <Label>
          Loại content <span className="text-red-500">*</span>
        </Label>
        <div className="grid gap-2">
          {CONTENT_TYPES.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                watchedType === opt.value
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <input
                type="radio"
                value={opt.value}
                checked={watchedType === opt.value}
                onChange={() => form.setValue('type', opt.value, { shouldValidate: true })}
                className="mt-1 accent-pink-600"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-900">{opt.label}</div>
                <div className="text-xs text-zinc-600">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
        {form.formState.errors.type && (
          <p className="text-xs text-red-600">{form.formState.errors.type.message}</p>
        )}
      </div>

      {/* Field 3: Schedule */}
      <div className="space-y-2">
        <Label htmlFor="scheduleCron">
          Lịch chạy <span className="text-red-500">*</span>
        </Label>
        <Select
          value={form.watch('scheduleCron')}
          onValueChange={(val) =>
            form.setValue('scheduleCron', val as WorkflowFormSchema['scheduleCron'], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger id="scheduleCron">
            <SelectValue placeholder="Chọn lịch chạy" />
          </SelectTrigger>
          <SelectContent>
            {SCHEDULE_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.scheduleCron && (
          <p className="text-xs text-red-600">{form.formState.errors.scheduleCron.message}</p>
        )}
      </div>

      {/* Field 4: News sources (conditional) */}
      {needsNewsSource && (
        <div className="space-y-2">
          <Label>
            Nguồn tin <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-zinc-600">
            Thêm URL các website bạn muốn AI đọc tin từ đó.
          </p>

          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/feed"
              value={newSourceInput}
              onChange={(e) => setNewSourceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNewsSource();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addNewsSource}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {watchedSources.length > 0 && (
            <ul className="space-y-1">
              {watchedSources.map((src, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm"
                >
                  <span className="flex-1 truncate text-zinc-700">{src}</span>
                  <button
                    type="button"
                    onClick={() => removeNewsSource(idx)}
                    className="text-zinc-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {form.formState.errors.newsSources && (
            <p className="text-xs text-red-600">
              {form.formState.errors.newsSources.message ??
                'Vui lòng thêm ít nhất 1 nguồn URL'}
            </p>
          )}
        </div>
      )}

      {/* Field 5: Enabled toggle */}
      <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <Checkbox
          id="enabled"
          checked={form.watch('enabled')}
          onCheckedChange={(checked) =>
            form.setValue('enabled', checked === true, { shouldValidate: true })
          }
        />
        <div className="flex-1">
          <Label htmlFor="enabled" className="cursor-pointer text-sm font-medium">
            Bật ngay sau khi tạo
          </Label>
          <p className="text-xs text-zinc-600">
            Nếu tắt, workflow sẽ ở trạng thái Tạm dừng và không tự chạy.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/workflows')}
          disabled={isPending}
        >
          Huỷ
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-pink-600 text-white hover:bg-pink-700"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            'Tạo workflow'
          )}
        </Button>
      </div>
    </form>
  );
}

function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    name: 'Tên workflow',
    type: 'Loại content',
    scheduleCron: 'Lịch chạy',
    newsSources: 'Nguồn tin',
    enabled: 'Trạng thái',
  };
  return labels[field] ?? field;
}
