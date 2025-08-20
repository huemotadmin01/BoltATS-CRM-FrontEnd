import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, CheckCircle, Circle, Calendar, Phone, Mail, MessageSquare } from 'lucide-react';
import { activitiesApi } from '../../api';
import { Activity } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ActivityForm } from './ActivityForm';
import { useToast } from '../../hooks/useToast';
import { format } from 'date-fns';

export const Activities: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: activities = [], refetch } = useQuery({
    queryKey: ['activities'],
    queryFn: activitiesApi.list,
  });

  const handleActivityCreated = () => {
    refetch();
    setIsCreateModalOpen(false);
    toast.success('Activity created successfully');
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      default:
        return MessageSquare;
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return 'text-blue-600';
      case 'email':
        return 'text-green-600';
      case 'meeting':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const aDate = new Date(a.dueAt || a.createdAt);
    const bDate = new Date(b.dueAt || b.createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  const pendingActivities = sortedActivities.filter(activity => !activity.doneAt);
  const completedActivities = sortedActivities.filter(activity => activity.doneAt);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600">Track tasks, calls, emails, and meetings</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={16} className="mr-2" />
          New Activity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Circle className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {pendingActivities.length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {completedActivities.length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {activities.filter(a => a.dueAt && new Date(a.dueAt) <= new Date()).length}
              </div>
              <div className="text-sm text-gray-500">Due Today</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Pending Activities</h3>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {pendingActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending activities
              </div>
            ) : (
              pendingActivities.map(activity => {
                const Icon = getActivityIcon(activity.type);
                const isOverdue = activity.dueAt && new Date(activity.dueAt) < new Date();
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Icon className={`h-5 w-5 mt-0.5 ${getTypeColor(activity.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{activity.subject}</h4>
                        <Badge variant="secondary" size="sm">
                          {activity.type}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="error" size="sm">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Assigned to {activity.assignee}
                      </p>
                      {activity.dueAt && (
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(activity.dueAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 capitalize">
                        {activity.entityType} #{activity.entityId.slice(-8)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle size={16} />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Completed Activities</h3>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {completedActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No completed activities
              </div>
            ) : (
              completedActivities.map(activity => {
                const Icon = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg opacity-75">
                    <Icon className={`h-5 w-5 mt-0.5 ${getTypeColor(activity.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 line-through">
                          {activity.subject}
                        </h4>
                        <Badge variant="success" size="sm">
                          Done
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Completed by {activity.assignee}
                      </p>
                      {activity.doneAt && (
                        <p className="text-sm text-gray-500">
                          Completed: {format(new Date(activity.doneAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 capitalize">
                        {activity.entityType} #{activity.entityId.slice(-8)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Activity"
        size="lg"
      >
        <ActivityForm onSuccess={handleActivityCreated} />
      </Modal>
    </div>
  );
};