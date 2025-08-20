import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Eye } from 'lucide-react';
import { candidatesApi } from '../../api';
import { Candidate } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { CandidateForm } from './CandidateForm';
import { CandidateDetail } from './CandidateDetail';
import { useToast } from '../../hooks/useToast';

export const Candidates: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();

  const { data: candidates = [], refetch } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.list,
  });

  const columns: Column<Candidate>[] = [
    {
      id: 'name',
      header: 'Name',
      sortable: true,
      cell: (value) => (
        <div className="font-medium text-gray-900">{value as string}</div>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      sortable: true,
      cell: (value) => (
        <div className="text-gray-600">{value as string}</div>
      ),
    },
    {
      id: 'currentTitle',
      header: 'Current Role',
      sortable: true,
    },
    {
      id: 'currentCompany',
      header: 'Company',
      sortable: true,
    },
    {
      id: 'experienceYears',
      header: 'Experience',
      sortable: true,
      cell: (value) => `${value} years`,
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: (value) => (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).slice(0, 3).map(skill => (
            <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
          ))}
          {(value as string[]).length > 3 && (
            <Badge variant="outline" size="sm">+{(value as string[]).length - 3}</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'id',
      header: 'Actions',
      sortable: false,
      cell: (value, row) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewingCandidate(row);
            }}
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleCandidateCreated = () => {
    refetch();
    setIsCreateModalOpen(false);
    toast.success('Candidate created successfully');
  };

  const handleCandidateUpdated = () => {
    refetch();
    setEditingCandidate(null);
    toast.success('Candidate updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Manage your candidate database</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Candidate
        </Button>
      </div>

      <DataTable
        data={candidates}
        columns={columns}
        onRowClick={(candidate) => setEditingCandidate(candidate)}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Candidate"
        size="lg"
      >
        <CandidateForm onSuccess={handleCandidateCreated} />
      </Modal>

      <Modal
        isOpen={!!editingCandidate}
        onClose={() => setEditingCandidate(null)}
        title="Edit Candidate"
        size="lg"
      >
        {editingCandidate && (
          <CandidateForm
            initialData={editingCandidate}
            onSuccess={handleCandidateUpdated}
          />
        )}
      </Modal>

      {viewingCandidate && (
        <CandidateDetail
          candidate={viewingCandidate}
          onClose={() => setViewingCandidate(null)}
        />
      )}
    </div>
  );
};