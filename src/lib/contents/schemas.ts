import { z } from 'zod';
import { CONTENT_STATUS_VALUES, type ContentStatus } from './types';

const CONTENT_STATUS_TUPLE = CONTENT_STATUS_VALUES as unknown as [ContentStatus, ...ContentStatus[]];

export const updateStatusSchema = z.object({
  contentId: z.string().uuid(),
  status: z.enum(CONTENT_STATUS_TUPLE, { message: 'Status không hợp lệ' }),
});

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
