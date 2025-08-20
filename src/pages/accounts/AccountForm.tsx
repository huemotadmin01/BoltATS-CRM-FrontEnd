import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { accountsApi } from '../../api';
import { Account } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  industry: z.string().min(1, 'Industry is required'),
  owner: z.string().min(1, 'Owner is required'),
  notes: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  initialData?: Account;
  onSuccess: () => void;
}

export const AccountForm: React.FC<AccountFormProps> = ({ initialData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      industry: initialData.industry,
      owner: initialData.owner,
      notes: initialData.notes,
    } : {},
  });

  const createMutation = useMutation({
    mutationFn: accountsApi.create,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Account> }) =>
      accountsApi.update(id, data),
    onSuccess,
  });

  const onSubmit = (data: AccountFormData) => {
    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Account Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Industry"
          {...register('industry')}
          error={errors.industry?.message}
        />

        <Input
          label="Account Owner"
          {...register('owner')}
          error={errors.owner?.message}
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any notes about this account..."
          {...register('notes')}
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};