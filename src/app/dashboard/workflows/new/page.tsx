import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUserBrand } from '@/lib/brands/queries';
import { WorkflowForm } from './workflow-form';

export default async function NewWorkflowPage() {
  const brand = await getCurrentUserBrand();

  if (!brand) {
    redirect('/onboarding');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link href="/dashboard/workflows">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>

        <h1 className="text-2xl font-bold text-zinc-900">Tạo workflow mới</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Workflow sẽ tự động viết bài cho brand{' '}
          <span className="font-medium text-zinc-900">
            {brand.brand_voice_guide?.brand_basics?.name ?? 'của bạn'}
          </span>{' '}
          theo lịch định kỳ.
        </p>
      </div>

      <WorkflowForm />
    </div>
  );
}
