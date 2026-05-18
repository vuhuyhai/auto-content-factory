import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWorkflowById } from '@/lib/workflows/queries';
import { workflowToFormData } from '@/lib/workflows/types';
import { WorkflowForm } from '../../new/workflow-form';

interface EditWorkflowPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkflowPage({
  params,
}: EditWorkflowPageProps) {
  const { id } = await params;
  const workflow = await getWorkflowById(id);

  if (!workflow) {
    notFound();
  }

  const initialValues = workflowToFormData(workflow);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/workflows"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          &larr; Quay lại danh sách workflow
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Chỉnh sửa workflow
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Cập nhật tên, lịch chạy và cấu hình. Không thể đổi loại workflow.
        </p>
      </div>

      {workflow.enabled ? (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Workflow này đang bật. Nếu bạn đổi lịch chạy, lần chạy tự động kế
          tiếp sẽ theo lịch mới ngay.
        </div>
      ) : null}

      <WorkflowForm
        mode="edit"
        workflowId={workflow.id}
        initialValues={initialValues}
      />
    </div>
  );
}
