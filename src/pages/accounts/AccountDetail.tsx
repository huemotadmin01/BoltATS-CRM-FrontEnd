import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, User, FileText, TrendingUp, Phone, Mail } from 'lucide-react';
import { Account } from '../../types';
import { contactsApi, opportunitiesApi } from '../../api';
import { Drawer } from '../../components/ui/Drawer';
import { Badge } from '../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';

interface AccountDetailProps {
  account: Account;
  onClose: () => void;
}

export const AccountDetail: React.FC<AccountDetailProps> = ({ account, onClose }) => {
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts', account.id],
    queryFn: () => contactsApi.getByAccountId(account.id),
  });

  const { data: opportunities = [] } = useQuery({
    queryKey: ['opportunities', account.id],
    queryFn: () => opportunitiesApi.getByAccountId(account.id),
  });

  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title="Account Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{account.name}</h2>
                <p className="text-gray-600">{account.industry}</p>
                <p className="text-sm text-gray-500">Owner: {account.owner}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${totalOpportunityValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Pipeline Value</div>
            </div>
          </div>

          {account.notes && (
            <div className="mt-4 p-4 bg-white rounded border">
              <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600">{account.notes}</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Contacts</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{contacts.length}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Opportunities</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{opportunities.length}</div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Won Deals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {opportunities.filter(opp => opp.stage === 'Won').length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contacts">
          <TabsList>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities ({opportunities.length})</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <div className="space-y-4">
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No contacts found
                </div>
              ) : (
                contacts.map(contact => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Mail size={14} />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Phone size={14} />
                            <span>{contact.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Mail size={14} className="mr-1" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone size={14} className="mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="space-y-4">
              {opportunities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No opportunities found
                </div>
              ) : (
                opportunities.map(opportunity => (
                  <div key={opportunity.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                        <p className="text-lg font-semibold text-green-600 mt-1">
                          ${opportunity.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {opportunity.probability}% probability
                        </p>
                      </div>
                      <Badge
                        variant={
                          opportunity.stage === 'Won' ? 'success' :
                          opportunity.stage === 'Lost' ? 'error' :
                          'secondary'
                        }
                      >
                        {opportunity.stage}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <div className="text-center py-8 text-gray-500">
              No activities found
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Drawer>
  );
};