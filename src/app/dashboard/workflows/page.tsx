import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowCard } from '@/components/workflows/workflow-card';
import { WorkflowEmptyState } from '@/components/workflows/workflow-empty-state';
import { getCurrentUserWorkflows } from '@/lib/workflows/queries';

export default async function WorkflowsPage() {
  const workflows = await getCurrentUserWorkflows();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Workflows</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Lịch tự động viết bài cho brand của bạn
          </p>
        </div>

        {workflows.length > 0 && (
          <Button asChild className="bg-pink-600 text-white hover:bg-pink-700">
            <Link href="/dashboard/workflows/new">
              <Plus className="mr-2 h-4 w-4" />
              Tạo workflow
            </Link>
          </Button>
        )}
      </div>

      {workflows.length === 0 ? (
        <WorkflowEmptyState />
      ) : (
        <div className="space-y-3">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      )}
    </div>
  );
}
