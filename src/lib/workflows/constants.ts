import type { ContentType, ScheduleCronValue } from './types';

export interface ContentTypeOption {
  value: ContentType;
  label: string;
  description: string;
  needsNewsSource: boolean;
}

export const CONTENT_TYPES: ContentTypeOption[] = [
  {
    value: 'news_based',
    label: 'Tin tức ngành',
    description: 'Tự động viết bài từ tin tức mới hàng ngày',
    needsNewsSource: true,
  },
  {
    value: 'evergreen',
    label: 'Bài evergreen',
    description: 'Bài về chủ đề cố định lặp đi lặp lại',
    needsNewsSource: false,
  },
  {
    value: 'promotional',
    label: 'Quảng bá sản phẩm',
    description: 'Push sản phẩm hoặc khóa học của brand',
    needsNewsSource: false,
  },
];

export interface SchedulePresetOption {
  value: ScheduleCronValue;
  label: string;
  description: string;
}

export const SCHEDULE_PRESETS: SchedulePresetOption[] = [
  {
    value: '0 7 * * *',
    label: 'Mỗi sáng 7h',
    description: 'Phù hợp đăng buổi sáng để bắt trend ngày mới',
  },
  {
    value: '0 20 * * *',
    label: 'Mỗi tối 8h',
    description: 'Phù hợp khung giờ vàng buổi tối',
  },
  {
    value: '0 7,20 * * *',
    label: '2 lần mỗi ngày (7h sáng + 8h tối)',
    description: 'Phủ cả 2 khung giờ vàng',
  },
  {
    value: '0 9 * * 1',
    label: 'Mỗi thứ Hai 9h sáng',
    description: 'Bài mở đầu tuần',
  },
  {
    value: '0 9 * * 1,3,5',
    label: 'Thứ 2, 4, 6 lúc 9h',
    description: 'Cách ngày, đều đặn',
  },
];

/**
 * Helper lấy label người-đọc-được từ cron string.
 * Nếu cron không match preset, trả về cron raw.
 */
export function getScheduleLabel(cron: string): string {
  const preset = SCHEDULE_PRESETS.find((p) => p.value === cron);
  return preset?.label ?? cron;
}

/**
 * Helper lấy label người-đọc-được từ content type.
 */
export function getContentTypeLabel(type: string): string {
  const option = CONTENT_TYPES.find((t) => t.value === type);
  return option?.label ?? type;
}
