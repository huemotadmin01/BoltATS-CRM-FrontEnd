import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { activitiesApi } from '../../api';
import { ActivityType, EntityType } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const activitySchema = z.object({
  entityType: z.enum(['candidate', 'job', 'application', 'account', 'opportunity']),
  entityId: z.string().min(1, 'Entity ID is required'),
  type: z.enum(['task', 'call', 'email', 'meeting']),
  subject: z.string().min(1, 'Subject is required'),
  dueAt: z.string().optional(),
  assignee: z.string().min(1, 'Assignee is required'),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  onSuccess: () => void;
}

export const ActivityForm: React.FC<ActivityFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: 'task',
      assignee: 'Current User',
    },
  });

  const createMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess,
  });

  const onSubmit = (data: ActivityFormData) => {
    const activityData = {
      ...data,
      entityType: data.entityType as EntityType,
      type: data.type as ActivityType,
      dueAt: data.dueAt || undefined,
    };

    createMutation.mutate(activityData);
  };

  const entityTypeOptions = [
    { value: 'candidate', label: 'Candidate' },
    { value: 'job', label: 'Job' },
    { value: 'application', label: 'Application' },
    { value: 'account', label: 'Account' },
    { value: 'opportunity', label: 'Opportunity' },
  ];

  const typeOptions = [
    { value: 'task', label: 'Task' },
    { value: 'call', label: 'Call' },
    { value: 'email', label: 'Email' },
    { value: 'meeting', label: 'Meeting' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Subject"
        {...register('subject')}
        error={errors.subject?.message}
        placeholder="Follow up with candidate"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Activity Type"
          {...register('type')}
          error={errors.type?.message}
          options={typeOptions}
        />

        <Input
          label="Assignee"
          {...register('assignee')}
          error={errors.assignee?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Related to"
          {...register('entityType')}
          error={errors.entityType?.message}
          options={entityTypeOptions}
        />

        <Input
          label="Entity ID"
          {...register('entityId')}
          error={errors.entityId?.message}
          placeholder="Enter ID or reference"
        />
      </div>

      <Input
        label="Due Date"
        type="datetime-local"
        {...register('dueAt')}
        error={errors.dueAt?.message}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={createMutation.isPending}>
          Create Activity
        </Button>
      </div>
    </form>
  );
};