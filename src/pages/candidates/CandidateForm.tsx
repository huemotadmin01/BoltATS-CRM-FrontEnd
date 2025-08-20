import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { candidatesApi } from '../../api';
import { Candidate } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  skills: z.string(),
  experienceYears: z.number().min(0, 'Experience must be 0 or greater'),
  currentTitle: z.string().min(1, 'Current title is required'),
  currentCompany: z.string().min(1, 'Current company is required'),
  tags: z.string().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Candidate;
  onSuccess: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ initialData, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      skills: initialData.skills.join(', '),
      experienceYears: initialData.experienceYears,
      currentTitle: initialData.currentTitle,
      currentCompany: initialData.currentCompany,
      tags: initialData.tags.join(', '),
    } : {
      experienceYears: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: candidatesApi.create,
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Candidate> }) =>
      candidatesApi.update(id, data),
    onSuccess,
  });

  const onSubmit = (data: CandidateFormData) => {
    const candidateData = {
      ...data,
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: candidateData });
    } else {
      createMutation.mutate(candidateData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label="Years of Experience"
          type="number"
          min={0}
          {...register('experienceYears', { valueAsNumber: true })}
          error={errors.experienceYears?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Current Title"
          {...register('currentTitle')}
          error={errors.currentTitle?.message}
        />

        <Input
          label="Current Company"
          {...register('currentCompany')}
          error={errors.currentCompany?.message}
        />
      </div>

      <Input
        label="Skills (comma separated)"
        {...register('skills')}
        error={errors.skills?.message}
        placeholder="React, TypeScript, Node.js"
      />

      <Input
        label="Tags (comma separated)"
        {...register('tags')}
        error={errors.tags?.message}
        placeholder="Remote, Senior, JavaScript"
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={isLoading}>
          {initialData ? 'Update Candidate' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  );
};