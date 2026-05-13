import { z } from 'zod';
import { SCHEDULE_PRESETS } from './constants';

const CONTENT_TYPE_VALUES = ['news_based', 'evergreen', 'promotional'] as const;

/**
 * Source of truth: SCHEDULE_PRESETS từ constants.ts.
 * Schema tự reflect khi thêm/sửa preset (chỉ đụng 1 file).
 */
const SCHEDULE_CRON_VALUES = SCHEDULE_PRESETS.map((p) => p.value) as [
  (typeof SCHEDULE_PRESETS)[number]['value'],
  ...(typeof SCHEDULE_PRESETS)[number]['value'][],
];

export const workflowFormSchema = z
  .object({
    name: z
      .string({ message: 'Tên workflow là bắt buộc' })
      .trim()
      .min(3, { message: 'Tên workflow tối thiểu 3 ký tự' })
      .max(100, { message: 'Tên workflow tối đa 100 ký tự' }),
    type: z.enum(CONTENT_TYPE_VALUES, {
      message: 'Loại content không hợp lệ',
    }),
    scheduleCron: z.enum(SCHEDULE_CRON_VALUES, {
      message: 'Lịch chạy không hợp lệ',
    }),
    newsSources: z
      .array(z.string().url({ message: 'URL không hợp lệ' }))
      .optional()
      .default([]),
    enabled: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'news_based') {
      if (!data.newsSources || data.newsSources.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newsSources'],
          message: 'Workflow tin tức cần ít nhất 1 nguồn URL',
        });
      }
    }
  });

export type WorkflowFormSchema = z.infer<typeof workflowFormSchema>;