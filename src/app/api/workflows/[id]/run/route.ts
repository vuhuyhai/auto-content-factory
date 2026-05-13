import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWorkflowById } from '@/lib/workflows/queries';
import { inngest } from '@/inngest/client';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workflowId } = await context.params;

  // Step 1: Auth check (giữ ở trigger, nhanh)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Step 2: Verify workflow ownership via RLS (giữ ở trigger, nhanh)
  let workflow;
  try {
    workflow = await getWorkflowById(workflowId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Workflow not found' },
      { status: 404 }
    );
  }

  if (!workflow) {
    return NextResponse.json(
      { error: 'Workflow not found or no permission' },
      { status: 404 }
    );
  }

  // Step 3: Enqueue Inngest job - background execution (Step 3-8 cũ move sang Inngest function)
  const { ids } = await inngest.send({
    name: 'workflow/run.requested',
    data: {
      workflowId,
      userId: user.id,
    },
  });

  return NextResponse.json({
    success: true,
    job_id: ids[0],
    message: 'Đã enqueue. Content sẽ lưu vào DB sau 1-2 phút.',
  });
}
