import { CronExpressionParser } from 'cron-parser';

const WINDOW_MS = 5 * 60 * 1000;
const DEDUP_MS = 5 * 60 * 1000;

export function isCronInWindow(cronExpr: string, now: Date = new Date()): boolean {
  try {
    const windowStart = new Date(now.getTime() - WINDOW_MS);

    const interval = CronExpressionParser.parse(cronExpr, {
      currentDate: now,
      tz: 'UTC',
    });

    const prev = interval.prev();
    const prevDate = prev.toDate();

    return prevDate >= windowStart && prevDate <= now;
  } catch {
    return false;
  }
}

export function isOutsideDedupWindow(lastRunAt: string | null, now: Date = new Date()): boolean {
  if (!lastRunAt) return true;

  const lastRun = new Date(lastRunAt);
  if (isNaN(lastRun.getTime())) return true;

  return now.getTime() - lastRun.getTime() >= DEDUP_MS;
}
