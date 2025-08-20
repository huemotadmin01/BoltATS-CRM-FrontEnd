import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, Building, Calendar, FileText, Activity } from 'lucide-react';
import { Candidate } from '../../types';
import { applicationsApi } from '../../api';
import { Drawer } from '../../components/ui/Drawer';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';

interface CandidateDetailProps {
  candidate: Candidate;
  onClose: () => void;
}

export const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate, onClose }) => {
  const { data: applications = [] } = useQuery({
    queryKey: ['applications', candidate.id],
    queryFn: () => applicationsApi.getByCandidateId(candidate.id),
  });

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Candidate Profile"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {candidate.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                <p className="text-gray-600">{candidate.currentTitle} at {candidate.currentCompany}</p>
                <p className="text-sm text-gray-500">{candidate.experienceYears} years of experience</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Mail size={16} className="mr-2" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Phone size={16} className="mr-2" />
                Call
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(skill => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>

          {candidate.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">{candidate.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-600">{candidate.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Current Company</div>
                      <div className="text-gray-600">{candidate.currentCompany}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Added</div>
                      <div className="text-gray-600">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No applications found
                </div>
              ) : (
                applications.map(application => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Application #{application.id.slice(-8)}</h4>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          application.stage === 'Hired' ? 'success' :
                          application.stage === 'Rejected' ? 'error' :
                          'secondary'
                        }
                      >
                        {application.stage}
                      </Badge>
                    </div>
                    {application.notes && (
                      <p className="mt-2 text-sm text-gray-600">{application.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 text-gray-300" />
              No activities found
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              No files uploaded
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Drawer>
  );
};