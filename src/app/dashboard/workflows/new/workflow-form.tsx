'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import type { WorkflowFormData } from '@/lib/workflows/types';
import { createWorkflow, updateWorkflow } from '../actions';

interface WorkflowFormProps {
  mode?: 'create' | 'edit';
  workflowId?: string;
  initialValues?: WorkflowFormData;
}

export function WorkflowForm({
  mode = 'create',
  workflowId,
  initialValues,
}: WorkflowFormProps = {}) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newSourceInput, setNewSourceInput] = useState('');

  const form = useForm<WorkflowFormInput, unknown, WorkflowFormOutput>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues: initialValues ?? DEFAULT_WORKFLOW_FORM_DATA,
    mode: 'onBlur',
  });

  const watchedType = form.watch('type');
  const watchedSources = form.watch('newsSources') ?? [];
  const watchedTopicFocus = form.watch('topicFocus') ?? '';
  const watchedOffer = form.watch('offer') ?? '';
  const needsNewsSource = watchedType === 'news_based';
  const needsTopicFocus = watchedType === 'evergreen';
  const needsPromotional = watchedType === 'promotional';

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
      const result =
        isEdit && workflowId
          ? await updateWorkflow(workflowId, values)
          : await createWorkflow(values);

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
              className={`flex items-start gap-3 rounded-lg border p-3 transition ${
                watchedType === opt.value
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-zinc-200 hover:border-zinc-300'
              } ${isEdit ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              <input
                type="radio"
                value={opt.value}
                checked={watchedType === opt.value}
                onChange={() => form.setValue('type', opt.value, { shouldValidate: true })}
                disabled={isEdit}
                className="mt-1 accent-pink-600"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-900">{opt.label}</div>
                <div className="text-xs text-zinc-600">{opt.description}</div>
              </div>
            </label>
          ))}
        </div>
        {isEdit && (
          <p className="text-xs text-zinc-500">
            Không thể đổi loại workflow sau khi tạo. Tạo workflow mới nếu cần loại khác.
          </p>
        )}
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

      {/* Field 4a: News sources (conditional - news_based) */}
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

      {/* Field 4b: Topic focus (conditional - evergreen) */}
      {needsTopicFocus && (
        <div className="space-y-2">
          <Label htmlFor="topicFocus">
            Chủ đề cố định <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-zinc-600">
            Mô tả chủ đề rõ ràng để AI viết nhiều bài quanh chủ đề này. Tối thiểu 20 ký tự.
          </p>
          <Textarea
            id="topicFocus"
            rows={4}
            placeholder="VD: Tập gym sau sinh - làm sao vừa giảm mỡ bụng vừa giữ sữa cho con bú, không bị mất cân bằng hormone"
            {...form.register('topicFocus')}
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">{watchedTopicFocus.length} / 500 ký tự</span>
            {form.formState.errors.topicFocus && (
              <span className="text-red-600">
                {form.formState.errors.topicFocus.message}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Field 4c: Product link + offer (conditional - promotional) */}
      {needsPromotional && (
        <>
          <div className="space-y-2">
            <Label htmlFor="productLink">
              Link sản phẩm <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-zinc-600">
              URL trang sản phẩm hoặc khoá học. AI sẽ đưa link này vào CTA.
            </p>
            <Input
              id="productLink"
              type="url"
              placeholder="https://ladysfit.vn/khoa-hoc-giam-can-90-ngay"
              {...form.register('productLink')}
            />
            {form.formState.errors.productLink && (
              <p className="text-xs text-red-600">
                {form.formState.errors.productLink.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer">
              Mô tả ưu đãi <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-zinc-600">
              Mô tả sản phẩm + ưu đãi cụ thể (giá, deadline, quà tặng). Tối thiểu 30 ký tự.
            </p>
            <Textarea
              id="offer"
              rows={4}
              placeholder="VD: Khoá học giảm cân sau sinh 90 ngày. 24 buổi tập với HLV nữ + thực đơn 4 tuần. Ưu đãi tháng 5: giảm 30% còn 2.490.000 VNĐ. Đăng ký trước 20/05 tặng 4 buổi yoga."
              {...form.register('offer')}
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">{watchedOffer.length} / 500 ký tự</span>
              {form.formState.errors.offer && (
                <span className="text-red-600">
                  {form.formState.errors.offer.message}
                </span>
              )}
            </div>
          </div>
        </>
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
              {isEdit ? 'Đang lưu...' : 'Đang tạo...'}
            </>
          ) : (
            isEdit ? 'Lưu thay đổi' : 'Tạo workflow'
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
    topicFocus: 'Chủ đề cố định',
    productLink: 'Link sản phẩm',
    offer: 'Mô tả ưu đãi',
    enabled: 'Trạng thái',
  };
  return labels[field] ?? field;
}