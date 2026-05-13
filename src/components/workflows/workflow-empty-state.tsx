import Link from 'next/link';
import { Workflow, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkflowEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
        <Workflow className="h-7 w-7 text-pink-600" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-zinc-900">
        Chưa có workflow nào
      </h3>

      <p className="mb-6 max-w-md text-sm text-zinc-600">
        Tạo workflow đầu tiên để Auto-Content Factory tự động viết bài cho brand của bạn theo lịch định kỳ.
      </p>

      <Button asChild className="bg-pink-600 text-white hover:bg-pink-700">
        <Link href="/dashboard/workflows/new">
          <Sparkles className="mr-2 h-4 w-4" />
          Tạo workflow đầu tiên
        </Link>
      </Button>
    </div>
  );
}
