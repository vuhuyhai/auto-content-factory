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

export type ScheduleCronValue =
  | '0 7 * * *'
  | '0 20 * * *'
  | '0 7,20 * * *'
  | '0 9 * * 1'
  | '0 9 * * 1,3,5';

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
  scheduleCron: '0 7 * * *',
  newsSources: [],
  enabled: true,
};
