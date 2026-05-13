import type { Workflow } from '@/lib/db/schema';

/**
 * Form data shape cho workflow create/edit form.
 * Field `name` lưu vào config JSONB (không có column trong DB).
 *
 * Các field optional theo type:
 * - news_based: newsSources required
 * - evergreen: topicFocus required
 * - promotional: productLink + offer required
 */
export interface WorkflowFormData {
  name: string;
  type: ContentType;
  scheduleCron: ScheduleCronValue;
  enabled: boolean;
  // Type-specific fields (conditional)
  newsSources?: string[];
  topicFocus?: string;
  productLink?: string;
  offer?: string;
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
 *
 * Discriminated union: type field xác định nhánh nào.
 * Backward compatible: news_based config cũ vẫn parse được (chỉ có name + news_sources).
 */
export type WorkflowConfig =
  | WorkflowConfigNewsBased
  | WorkflowConfigEvergreen
  | WorkflowConfigPromotional;

export interface WorkflowConfigBase {
  name: string;
}

export interface WorkflowConfigNewsBased extends WorkflowConfigBase {
  type?: 'news_based'; // optional cho backward compat (config cũ không có type field)
  news_sources: string[];
}

export interface WorkflowConfigEvergreen extends WorkflowConfigBase {
  type: 'evergreen';
  topic_focus: string;
}

export interface WorkflowConfigPromotional extends WorkflowConfigBase {
  type: 'promotional';
  product_link: string;
  offer: string;
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
  enabled: true,
  newsSources: [],
  topicFocus: '',
  productLink: '',
  offer: '',
};