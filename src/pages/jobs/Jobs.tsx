// src/pages/jobs/Jobs.tsx
import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { jobsApi } from '../../api';
import type { JobPosition } from '../../types';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { JobForm } from './JobForm';
import { useToast } from '../../hooks/useToast';

export const Jobs: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const { toast } = useToast();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.list,                       // ✅ explicit query function
    select: (res: any) => (Array.isArray(res) ? res : res?.data) ?? [],
    staleTime: 60_000,
  });

  const rows = (data as JobPosition[]) ?? [];

  const statusVariant = (status?: string) => {
    switch (status) {
      case 'Active':
      case 'Published':
        return 'success' as const;
      case 'Draft':
        return 'warning' as const;
      case 'Closed':
      case 'Archived':
        return 'error' as const;
      default:
        return 'secondary' as const;
    }
  };

  const columns = useMemo<Column<JobPosition>[]>(() => [
    {
      id: 'title',
      header: 'Job Title',
      sortable: true,
      cell: (value) => <div className="font-medium text-gray-900">{value as string}</div>,
    },
    { id: 'department', header: 'Department', sortable: true },
    { id: 'location', header: 'Location', sortable: true },
    {
      id: 'employmentType',
      header: 'Type',
      cell: (value) => <Badge variant="secondary">{String(value ?? '')}</Badge>,
    },
    { id: 'openings', header: 'Openings', sortable: true },
    {
      id: 'status',
      header: 'Status',
      cell: (value) => <Badge variant={statusVariant(String(value))}>{String(value)}</Badge>,
    },
  ], []);

  const handleJobCreated = () => {
    refetch();
    setIsCreateModalOpen(false);
    toast.success('Job created successfully');
  };

  const handleJobUpdated = () => {
    refetch();
    setEditingJob(null);
    toast.success('Job updated successfully');
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600">Loading jobs…</div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load jobs: {(error as any)?.message ?? 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage your job openings</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Job
        </Button>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        onRowClick={(job) => setEditingJob(job)}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Job"
        size="lg"
      >
        <JobForm onSuccess={handleJobCreated} />
      </Modal>

      <Modal
        isOpen={!!editingJob}
        onClose={() => setEditingJob(null)}
        title="Edit Job"
        size="lg"
      >
        {editingJob && (
          <JobForm
            initialData={editingJob}
            onSuccess={handleJobUpdated}
          />
        )}
      </Modal>
    </div>
  );
};
