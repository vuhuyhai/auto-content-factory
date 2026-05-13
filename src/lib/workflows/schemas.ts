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
    enabled: z.boolean().default(true),
    // Type-specific fields, validate qua superRefine
    newsSources: z
      .array(z.string().url({ message: 'URL không hợp lệ' }))
      .optional()
      .default([]),
    topicFocus: z.string().trim().optional().default(''),
    productLink: z.string().trim().optional().default(''),
    offer: z.string().trim().optional().default(''),
  })
  .superRefine((data, ctx) => {
    // news_based: cần ít nhất 1 RSS URL
    if (data.type === 'news_based') {
      if (!data.newsSources || data.newsSources.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newsSources'],
          message: 'Workflow tin tức cần ít nhất 1 nguồn URL',
        });
      }
    }

    // evergreen: cần topicFocus 20-500 chars
    if (data.type === 'evergreen') {
      const topic = data.topicFocus?.trim() ?? '';
      if (topic.length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topicFocus'],
          message: 'Chủ đề evergreen tối thiểu 20 ký tự (mô tả đủ rõ để AI viết)',
        });
      }
      if (topic.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['topicFocus'],
          message: 'Chủ đề evergreen tối đa 500 ký tự',
        });
      }
    }

    // promotional: cần productLink (URL) + offer (30-500 chars)
    if (data.type === 'promotional') {
      const productLink = data.productLink?.trim() ?? '';
      const offer = data.offer?.trim() ?? '';

      // Validate productLink as URL manually (vì base schema optional default '')
      if (productLink.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['productLink'],
          message: 'Link sản phẩm là bắt buộc',
        });
      } else {
        try {
          new URL(productLink);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['productLink'],
            message: 'Link sản phẩm phải là URL hợp lệ (http:// hoặc https://)',
          });
        }
      }

      if (offer.length < 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['offer'],
          message: 'Mô tả ưu đãi tối thiểu 30 ký tự (đủ context cho AI)',
        });
      }
      if (offer.length > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['offer'],
          message: 'Mô tả ưu đãi tối đa 500 ký tự',
        });
      }
    }
  });

export type WorkflowFormSchema = z.infer<typeof workflowFormSchema>;