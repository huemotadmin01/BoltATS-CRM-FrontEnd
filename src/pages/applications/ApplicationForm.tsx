import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { applicationsApi, candidatesApi, jobsApi } from '../../api';
import { ApplicationStage } from '../../types';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';

const applicationSchema = z.object({
  candidateId: z.string().min(1, 'Candidate is required'),
  jobId: z.string().min(1, 'Job is required'),
  stage: z.enum(['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSuccess: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      stage: 'New',
    },
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.list,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess,
  });

  const onSubmit = (data: ApplicationFormData) => {
    const applicationData = {
      ...data,
      stage: data.stage as ApplicationStage,
      stageHistory: [
        {
          from: 'New' as ApplicationStage,
          to: data.stage as ApplicationStage,
          at: new Date().toISOString(),
        },
      ],
    };

    createMutation.mutate(applicationData);
  };

  const candidateOptions = candidates.map(candidate => ({
    value: candidate.id,
    label: `${candidate.name} (${candidate.email})`,
  }));

  const jobOptions = jobs.map(job => ({
    value: job.id,
    label: `${job.title} - ${job.department}`,
  }));

  const stageOptions = [
    { value: 'New', label: 'New' },
    { value: 'Screening', label: 'Screening' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Offer', label: 'Offer' },
    { value: 'Hired', label: 'Hired' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Candidate"
          {...register('candidateId')}
          error={errors.candidateId?.message}
          options={[{ value: '', label: 'Select a candidate' }, ...candidateOptions]}
        />

        <Select
          label="Job"
          {...register('jobId')}
          error={errors.jobId?.message}
          options={[{ value: '', label: 'Select a job' }, ...jobOptions]}
        />
      </div>

      <Select
        label="Initial Stage"
        {...register('stage')}
        error={errors.stage?.message}
        options={stageOptions}
      />

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any initial notes..."
          {...register('notes')}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={createMutation.isPending}>
          Create Application
        </Button>
      </div>
    </form>
  );
};