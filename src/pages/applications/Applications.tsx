import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MessageSquare, Calendar, User } from 'lucide-react';
import { applicationsApi, candidatesApi, jobsApi } from '../../api';
import { Application, ApplicationStage, Candidate, JobPosition } from '../../types';
import { KanbanBoard } from '../../components/ui/KanbanBoard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ApplicationForm } from './ApplicationForm';
import { useToast } from '../../hooks/useToast';

const applicationStages: { id: ApplicationStage; title: string; color: string }[] = [
  { id: 'New', title: 'New Applications', color: 'blue' },
  { id: 'Screening', title: 'Screening', color: 'yellow' },
  { id: 'Interview', title: 'Interview', color: 'purple' },
  { id: 'Offer', title: 'Offer', color: 'green' },
  { id: 'Hired', title: 'Hired', color: 'emerald' },
  { id: 'Rejected', title: 'Rejected', color: 'red' },
];

export const Applications: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.list,
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates'],
    queryFn: candidatesApi.list,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.list,
  });

  const moveApplicationMutation = useMutation({
    mutationFn: ({ id, toStage }: { id: string; toStage: ApplicationStage }) =>
      applicationsApi.moveStage(id, toStage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application moved successfully');
    },
    onError: () => {
      toast.error('Failed to move application');
    },
  });

  const candidateMap = useMemo(() => {
    const map = new Map<string, Candidate>();
    candidates.forEach(candidate => map.set(candidate.id, candidate));
    return map;
  }, [candidates]);

  const jobMap = useMemo(() => {
    const map = new Map<string, JobPosition>();
    jobs.forEach(job => map.set(job.id, job));
    return map;
  }, [jobs]);

  const kanbanColumns = applicationStages.map(stage => ({
    id: stage.id,
    title: stage.title,
    color: stage.color,
    wipLimit: stage.id === 'Interview' ? 5 : undefined, // Example WIP limit
  }));

  const kanbanCards = applications.map(application => {
    const candidate = candidateMap.get(application.candidateId);
    const job = jobMap.get(application.jobId);

    return {
      id: application.id,
      title: candidate?.name || 'Unknown Candidate',
      columnId: application.stage,
      content: (
        <div className="space-y-2">
          <div className="text-xs text-gray-600">
            {job?.title || 'Unknown Job'}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" size="sm">
              {candidate?.experienceYears}y exp
            </Badge>
            <Badge variant="default" size="sm">
              {candidate?.currentTitle || 'N/A'}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ),
    };
  });

  const handleCardMove = (cardId: string, fromColumn: string, toColumn: string) => {
    if (fromColumn !== toColumn) {
      moveApplicationMutation.mutate({
        id: cardId,
        toStage: toColumn as ApplicationStage,
      });
    }
  };

  const handleCardClick = (card: any) => {
    const application = applications.find(app => app.id === card.id);
    if (application) {
      setSelectedApplication(application);
    }
  };

  const handleApplicationCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['applications'] });
    setIsCreateModalOpen(false);
    toast.success('Application created successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications Pipeline</h1>
          <p className="text-gray-600">Track applications through your hiring process</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Application
        </Button>
      </div>

      <KanbanBoard
        columns={kanbanColumns}
        cards={kanbanCards}
        onCardMove={handleCardMove}
        onCardClick={handleCardClick}
        renderCard={(card) => (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-900">{card.title}</h4>
            {card.content}
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Button variant="ghost" size="sm" className="p-1">
                <MessageSquare size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <Calendar size={14} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <User size={14} />
              </Button>
            </div>
          </div>
        )}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Application"
        size="lg"
      >
        <ApplicationForm onSuccess={handleApplicationCreated} />
      </Modal>

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          candidate={candidateMap.get(selectedApplication.candidateId)}
          job={jobMap.get(selectedApplication.jobId)}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

interface ApplicationDetailModalProps {
  application: Application;
  candidate?: Candidate;
  job?: JobPosition;
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  candidate,
  job,
  onClose,
}) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Application Details"
      size="xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Candidate Information</h3>
              <div className="space-y-2">
                <div><strong>Name:</strong> {candidate?.name}</div>
                <div><strong>Email:</strong> {candidate?.email}</div>
                <div><strong>Phone:</strong> {candidate?.phone}</div>
                <div><strong>Experience:</strong> {candidate?.experienceYears} years</div>
                <div><strong>Current Role:</strong> {candidate?.currentTitle} at {candidate?.currentCompany}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate?.skills.map(skill => (
                  <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Information</h3>
              <div className="space-y-2">
                <div><strong>Title:</strong> {job?.title}</div>
                <div><strong>Department:</strong> {job?.department}</div>
                <div><strong>Location:</strong> {job?.location}</div>
                <div><strong>Type:</strong> {job?.employmentType}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job?.skills.map(skill => (
                  <Badge key={skill} variant="outline" size="sm">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Application Timeline</h3>
          <div className="space-y-2">
            {application.stageHistory.map((history, index) => (
              <div key={index} className="flex items-center space-x-4 text-sm">
                <Badge variant="secondary" size="sm">{history.to}</Badge>
                <span className="text-gray-500">
                  {new Date(history.at).toLocaleDateString()} {new Date(history.at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {application.notes && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-600">{application.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};