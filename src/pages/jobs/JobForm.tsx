import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { jobsApi } from '../../api';
import { JobPosition } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
  skills: z.string(),
  openings: z.number().min(1, 'At least 1 opening required'),
  status: z.enum(['Draft', 'Published', 'Closed']),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobFormProps {
  initialData?: JobPosition;
  onSuccess: () => void;
}

export const JobForm: React.FC<JobFormProps> = ({ initialData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      department: initialData.department,
      location: initialData.location,
      employmentType: initialData.employmentType,
      skills: initialData.skills.join(', '),
      openings: initialData.openings,
      status: initialData.status,
    } : {
      employmentType: 'Full-time',
      status: 'Draft',
      openings: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: jobsApi.create,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JobPosition> }) =>
      jobsApi.update(id, data),
    onSuccess,
  });

  const onSubmit = (data: JobFormData) => {
    const jobData = {
      ...data,
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: jobData });
    } else {
      createMutation.mutate(jobData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Job Title"
        {...register('title')}
        error={errors.title?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Department"
          {...register('department')}
          error={errors.department?.message}
        />

        <Input
          label="Location"
          {...register('location')}
          error={errors.location?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Employment Type"
          {...register('employmentType')}
          error={errors.employmentType?.message}
          options={[
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
          ]}
        />

        <Input
          label="Number of Openings"
          type="number"
          min={1}
          {...register('openings', { valueAsNumber: true })}
          error={errors.openings?.message}
        />

        <Select
          label="Status"
          {...register('status')}
          error={errors.status?.message}
          options={[
            { value: 'Draft', label: 'Draft' },
            { value: 'Published', label: 'Published' },
            { value: 'Closed', label: 'Closed' },
          ]}
        />
      </div>

      <Input
        label="Required Skills (comma separated)"
        {...register('skills')}
        error={errors.skills?.message}
        placeholder="React, TypeScript, Node.js"
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
};