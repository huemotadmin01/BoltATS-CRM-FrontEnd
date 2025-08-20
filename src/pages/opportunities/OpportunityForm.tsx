import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { opportunitiesApi, accountsApi } from '../../api';
import { Opportunity, OpportunityStage } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const opportunitySchema = z.object({
  accountId: z.string().min(1, 'Account is required'),
  title: z.string().min(1, 'Title is required'),
  stage: z.enum(['Prospect', 'Qualified', 'Won', 'Lost']),
  value: z.number().min(0, 'Value must be 0 or greater'),
  probability: z.number().min(0).max(100, 'Probability must be between 0 and 100'),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface OpportunityFormProps {
  initialData?: Opportunity;
  onSuccess: () => void;
}

export const OpportunityForm: React.FC<OpportunityFormProps> = ({ initialData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: initialData ? {
      accountId: initialData.accountId,
      title: initialData.title,
      stage: initialData.stage,
      value: initialData.value,
      probability: initialData.probability,
    } : {
      stage: 'Prospect',
      value: 0,
      probability: 50,
    },
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: opportunitiesApi.create,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      opportunitiesApi.update(id, data),
    onSuccess,
  });

  const onSubmit = (data: OpportunityFormData) => {
    const opportunityData = {
      ...data,
      stage: data.stage as OpportunityStage,
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: opportunityData });
    } else {
      createMutation.mutate(opportunityData);
    }
  };

  const accountOptions = accounts.map(account => ({
    value: account.id,
    label: `${account.name} (${account.industry})`,
  }));

  const stageOptions = [
    { value: 'Prospect', label: 'Prospect' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' },
  ];

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Opportunity Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Q1 2024 Enterprise Deal"
      />

      <Select
        label="Account"
        {...register('accountId')}
        error={errors.accountId?.message}
        options={[{ value: '', label: 'Select an account' }, ...accountOptions]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Stage"
          {...register('stage')}
          error={errors.stage?.message}
          options={stageOptions}
        />

        <Input
          label="Value ($)"
          type="number"
          min={0}
          step={1000}
          {...register('value', { valueAsNumber: true })}
          error={errors.value?.message}
        />

        <Input
          label="Probability (%)"
          type="number"
          min={0}
          max={100}
          {...register('probability', { valueAsNumber: true })}
          error={errors.probability?.message}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Update Opportunity' : 'Create Opportunity'}
        </Button>
      </div>
    </form>
  );
};