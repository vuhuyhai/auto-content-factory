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

/**
 * QUAN TRỌNG: Cron lưu UTC (industry standard). Label hiển thị VN time.
 * VN = UTC + 7h.
 * 
 * Conversion:
 *   VN 7h sáng  = UTC 0h   = '0 0 * * *'
 *   VN 8h tối   = UTC 13h  = '0 13 * * *'
 *   VN 9h sáng  = UTC 2h   = '0 2 * * *'
 */
export const SCHEDULE_PRESETS: SchedulePresetOption[] = [
  {
    value: '0 0 * * *',
    label: 'Mỗi sáng 7h (giờ Việt Nam)',
    description: 'Phù hợp đăng buổi sáng để bắt trend ngày mới',
  },
  {
    value: '0 13 * * *',
    label: 'Mỗi tối 8h (giờ Việt Nam)',
    description: 'Phù hợp khung giờ vàng buổi tối',
  },
  {
    value: '0 0,13 * * *',
    label: '2 lần mỗi ngày (7h sáng + 8h tối, giờ Việt Nam)',
    description: 'Phủ cả 2 khung giờ vàng',
  },
  {
    value: '0 2 * * 1',
    label: 'Mỗi thứ Hai 9h sáng (giờ Việt Nam)',
    description: 'Bài mở đầu tuần',
  },
  {
    value: '0 2 * * 1,3,5',
    label: 'Thứ 2, 4, 6 lúc 9h sáng (giờ Việt Nam)',
    description: 'Cách ngày, đều đặn',
  },
];

/**
 * Helper lấy label người-đọc-được từ cron string.
 * Nếu cron không match preset, trả về cron raw + warning "Tuỳ chỉnh".
 */
export function getScheduleLabel(cron: string): string {
  const preset = SCHEDULE_PRESETS.find((p) => p.value === cron);
  if (preset) return preset.label;
  return `Tuỳ chỉnh (${cron} UTC)`;
}

/**
 * Helper lấy label người-đọc-được từ content type.
 */
export function getContentTypeLabel(type: string): string {
  const option = CONTENT_TYPES.find((t) => t.value === type);
  return option?.label ?? type;
}

/**
 * Convert VN hour (0-23) sang UTC cron expression daily.
 * VN = UTC + 7h. Nếu VN hour < 7, UTC hour wrap về previous day.
 * 
 * Example: vnHourToUtcCron(7) → '0 0 * * *' (7h sáng VN)
 *          vnHourToUtcCron(20) → '0 13 * * *' (8h tối VN)
 *          vnHourToUtcCron(3) → '0 20 * * *' (3h sáng VN = 20h UTC ngày trước)
 */
export function vnHourToUtcCron(vnHour: number, vnMinute: number = 0): string {
  if (vnHour < 0 || vnHour > 23) {
    throw new Error(`Invalid VN hour: ${vnHour}. Must be 0-23.`);
  }
  if (vnMinute < 0 || vnMinute > 59) {
    throw new Error(`Invalid VN minute: ${vnMinute}. Must be 0-59.`);
  }
  const utcHour = (vnHour - 7 + 24) % 24;
  return `${vnMinute} ${utcHour} * * *`;
}

/**
 * Convert UTC hour (0-23) sang VN hour cho display.
 * UTC + 7h = VN.
 */
export function utcHourToVnHour(utcHour: number): number {
  return (utcHour + 7) % 24;
}