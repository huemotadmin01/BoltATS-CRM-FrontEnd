import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, DollarSign, TrendingUp } from 'lucide-react';
import { opportunitiesApi, accountsApi } from '../../api';
import { Opportunity, OpportunityStage, Account } from '../../types';
import { KanbanBoard } from '../../components/ui/KanbanBoard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { OpportunityForm } from './OpportunityForm';
import { useToast } from '../../hooks/useToast';

const opportunityStages: { id: OpportunityStage; title: string; color: string }[] = [
  { id: 'Prospect', title: 'Prospects', color: 'blue' },
  { id: 'Qualified', title: 'Qualified', color: 'yellow' },
  { id: 'Won', title: 'Won', color: 'green' },
  { id: 'Lost', title: 'Lost', color: 'red' },
];

export const Opportunities: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: opportunities = [] } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.list,
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.list,
  });

  const updateOpportunityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      opportunitiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity updated successfully');
    },
    onError: () => {
      toast.error('Failed to update opportunity');
    },
  });

  const accountMap = useMemo(() => {
    const map = new Map<string, Account>();
    accounts.forEach(account => map.set(account.id, account));
    return map;
  }, [accounts]);

  const kanbanColumns = opportunityStages.map(stage => ({
    id: stage.id,
    title: stage.title,
    color: stage.color,
  }));

  const kanbanCards = opportunities.map(opportunity => {
    const account = accountMap.get(opportunity.accountId);

    return {
      id: opportunity.id,
      title: opportunity.title,
      columnId: opportunity.stage,
      content: (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">
            {account?.name || 'Unknown Account'}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-green-600">
              ${opportunity.value.toLocaleString()}
            </div>
            <Badge variant="outline" size="sm">
              {opportunity.probability}%
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            Created {new Date(opportunity.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    };
  });

  const handleCardMove = (cardId: string, fromColumn: string, toColumn: string) => {
    if (fromColumn !== toColumn) {
      updateOpportunityMutation.mutate({
        id: cardId,
        data: { stage: toColumn as OpportunityStage },
      });
    }
  };

  const handleCardClick = (card: any) => {
    const opportunity = opportunities.find(opp => opp.id === card.id);
    if (opportunity) {
      setEditingOpportunity(opportunity);
    }
  };

  const handleOpportunityCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    setIsCreateModalOpen(false);
    toast.success('Opportunity created successfully');
  };

  const handleOpportunityUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    setEditingOpportunity(null);
    toast.success('Opportunity updated successfully');
  };

  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const qualifiedValue = opportunities
    .filter(opp => opp.stage === 'Qualified')
    .reduce((sum, opp) => sum + opp.value, 0);
  const wonValue = opportunities
    .filter(opp => opp.stage === 'Won')
    .reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600">Track your sales opportunities</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Opportunity
        </Button>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalPipelineValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Pipeline</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${qualifiedValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Qualified Pipeline</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${wonValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Won This Period</div>
            </div>
          </div>
        </div>
      </div>

      <KanbanBoard
        columns={kanbanColumns}
        cards={kanbanCards}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
        renderCard={(card) => (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">{card.title}</h4>
            {card.content}
          </div>
        )}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Opportunity"
        size="lg"
      >
        <OpportunityForm onSuccess={handleOpportunityCreated} />
      </Modal>

      <Modal
        isOpen={!!editingOpportunity}
        onClose={() => setEditingOpportunity(null)}
        title="Edit Opportunity"
        size="lg"
      >
        {editingOpportunity && (
          <OpportunityForm
            initialData={editingOpportunity}
            onSuccess={handleOpportunityUpdated}
          />
        )}
      </Modal>
    </div>
  );
};