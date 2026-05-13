import type { Workflow } from '@/lib/db/schema';

/**
 * Form data shape cho workflow create/edit form.
 * Field `name` lưu vào config JSONB (không có column trong DB).
 */
export interface WorkflowFormData {
  name: string;
  type: ContentType;
  scheduleCron: ScheduleCronValue;
  newsSources?: string[];
  enabled: boolean;
}

export type ContentType = 'news_based' | 'evergreen' | 'promotional';

/**
 * Cron expressions LƯU UTC (industry standard).
 * Display layer convert sang VN time qua getScheduleLabel().
 * 
 * VN = UTC + 7h, nên:
 *   - 7h sáng VN = 0h UTC = '0 0 * * *'
 *   - 8h tối VN  = 13h UTC = '0 13 * * *'
 *   - 9h sáng VN = 2h UTC = '0 2 * * *'
 */
export type ScheduleCronValue =
  | '0 0 * * *'        // 7h sáng VN
  | '0 13 * * *'       // 8h tối VN
  | '0 0,13 * * *'     // 7h + 20h VN
  | '0 2 * * 1'        // Thứ 2 9h sáng VN
  | '0 2 * * 1,3,5';   // Thứ 2/4/6 9h sáng VN

/**
 * Structure của workflow.config JSONB column.
 */
export interface WorkflowConfig {
  name: string;
  news_sources?: string[];
}

/**
 * Workflow row enriched với parsed config (dùng cho UI list).
 */
export interface WorkflowWithConfig extends Workflow {
  config: WorkflowConfig | null;
}

export const DEFAULT_WORKFLOW_FORM_DATA: WorkflowFormData = {
  name: '',
  type: 'news_based',
  scheduleCron: '0 0 * * *',  // Default "Mỗi sáng 7h VN"
  newsSources: [],
  enabled: true,
};