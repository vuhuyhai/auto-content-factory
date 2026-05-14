import { z } from 'zod';
import { CONTENT_STATUS_VALUES, type ContentStatus } from './types';

const CONTENT_STATUS_TUPLE = CONTENT_STATUS_VALUES as unknown as [ContentStatus, ...ContentStatus[]];

export const updateStatusSchema = z.object({
  contentId: z.string().uuid(),
  status: z.enum(CONTENT_STATUS_TUPLE, { message: 'Status không hợp lệ' }),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;

export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
  status: z.enum(CONTENT_STATUS_TUPLE, { message: 'Status không hợp lệ' }),
});

export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;

// M3.1: Edit variant content inline
const HASHTAG_REGEX = /^#?[\p{L}\p{N}_]+$/u; // Hỗ trợ Unicode (tiếng Việt)

export const updateVariantContentSchema = z.object({
  contentId: z.string().uuid({ message: 'ID nội dung không hợp lệ' }),
  variantIndex: z.number().int().min(0).max(2, {
    message: 'Variant index phải là 0, 1, hoặc 2',
  }),
  fields: z.object({
    hook: z
      .string()
      .trim()
      .min(20, { message: 'Hook tối thiểu 20 ký tự' })
      .max(500, { message: 'Hook tối đa 500 ký tự' }),
    title: z
      .string()
      .trim()
      .min(10, { message: 'Tiêu đề tối thiểu 10 ký tự' })
      .max(200, { message: 'Tiêu đề tối đa 200 ký tự' }),
    body: z
      .string()
      .trim()
      .min(100, { message: 'Nội dung tối thiểu 100 ký tự' })
      .max(2000, { message: 'Nội dung tối đa 2000 ký tự' }),
    hashtags: z
      .array(
        z
          .string()
          .trim()
          .min(2, { message: 'Hashtag tối thiểu 2 ký tự' })
          .max(50, { message: 'Hashtag tối đa 50 ký tự' })
          .regex(HASHTAG_REGEX, {
            message: 'Hashtag chỉ chứa chữ, số, gạch dưới (Việt ngữ OK)',
          })
      )
      .min(1, { message: 'Tối thiểu 1 hashtag' })
      .max(10, { message: 'Tối đa 10 hashtag' }),
  }),
});

export type UpdateVariantContentInput = z.infer<typeof updateVariantContentSchema>;
