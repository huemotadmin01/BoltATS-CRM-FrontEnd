import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Eye } from 'lucide-react';
import { accountsApi } from '../../api';
import { Account } from '../../types';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AccountForm } from './AccountForm';
import { AccountDetail } from './AccountDetail';
import { useToast } from '../../hooks/useToast';

export const Accounts: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null);
  const { toast } = useToast();

  const { data: accounts = [], refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.list,
  });

  const columns: Column<Account>[] = [
    {
      id: 'name',
      header: 'Account Name',
      sortable: true,
      cell: (value) => (
        <div className="font-medium text-gray-900">{value as string}</div>
      ),
    },
    {
      id: 'industry',
      header: 'Industry',
      sortable: true,
    },
    {
      id: 'owner',
      header: 'Owner',
      sortable: true,
    },
    {
      id: 'createdAt',
      header: 'Created',
      sortable: true,
      cell: (value) => new Date(value as string).toLocaleDateString(),
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
              setViewingAccount(row);
            }}
          >
            <Eye size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const handleAccountCreated = () => {
    refetch();
    setIsCreateModalOpen(false);
    toast.success('Account created successfully');
  };

  const handleAccountUpdated = () => {
    refetch();
    setEditingAccount(null);
    toast.success('Account updated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage your customer accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Account
        </Button>
      </div>

      <DataTable
        data={accounts}
        columns={columns}
        onRowClick={(account) => setEditingAccount(account)}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Account"
        size="lg"
      >
        <AccountForm onSuccess={handleAccountCreated} />
      </Modal>

      <Modal
        isOpen={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        title="Edit Account"
        size="lg"
      >
        {editingAccount && (
          <AccountForm
            initialData={editingAccount}
            onSuccess={handleAccountUpdated}
          />
        )}
      </Modal>

      {viewingAccount && (
        <AccountDetail
          account={viewingAccount}
          onClose={() => setViewingAccount(null)}
        />
      )}
    </div>
  );
};