import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';
import { fetchEnabledWorkflows, markWorkflowTriggered } from '@/lib/cron/queries';
import { isCronInWindow, isOutsideDedupWindow } from '@/lib/cron/should-trigger';

export const runtime = 'nodejs';
export const maxDuration = 30;

function log(stage: string, data: Record<string, unknown>): void {
  console.log(`[cron-runner] ${stage}`, JSON.stringify(data));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    log('error', { reason: 'CRON_SECRET env var not set' });
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    log('auth-fail', { receivedHeader: authHeader?.slice(0, 20) ?? 'null' });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  log('start', { timestamp: now.toISOString() });

  let workflows;
  try {
    workflows = await fetchEnabledWorkflows();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown DB error';
    log('fetch-workflows-error', { error: msg });
    return NextResponse.json({ error: 'Failed to fetch workflows', details: msg }, { status: 500 });
  }

  log('workflows-fetched', { count: workflows.length });

  const triggered: string[] = [];
  const skipped: { id: string; reason: string }[] = [];
  const errors: { id: string; error: string }[] = [];

  for (const wf of workflows) {
    if (!isCronInWindow(wf.schedule_cron, now)) {
      skipped.push({ id: wf.id, reason: 'cron-not-in-window' });
      continue;
    }

    if (!isOutsideDedupWindow(wf.last_run_at, now)) {
      skipped.push({ id: wf.id, reason: 'dedup-window-active' });
      continue;
    }

    try {
      await inngest.send({
        name: 'workflow/run.requested',
        data: { userId: wf.user_id, workflowId: wf.id },
      });

      await markWorkflowTriggered(wf.id);

      triggered.push(wf.id);
      log('triggered', { workflowId: wf.id, cron: wf.schedule_cron });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown trigger error';
      errors.push({ id: wf.id, error: msg });
      log('trigger-error', { workflowId: wf.id, error: msg });
    }
  }

  log('done', {
    checked: workflows.length,
    triggered: triggered.length,
    skipped: skipped.length,
    errors: errors.length,
  });

  return NextResponse.json({
    checked: workflows.length,
    triggered: triggered.length,
    skipped: skipped.length,
    triggered_ids: triggered,
    skipped_summary: skipped,
    errors,
  });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/cron/run-workflows',
    method: 'POST',
    auth: 'Bearer <CRON_SECRET>',
    timestamp: new Date().toISOString(),
  });
}
