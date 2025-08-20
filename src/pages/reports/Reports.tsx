import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Briefcase, DollarSign, Clock, Target } from 'lucide-react';
import { applicationsApi, candidatesApi, jobsApi, opportunitiesApi } from '../../api';

export const Reports: React.FC = () => {
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

  const { data: opportunities = [] } = useQuery({
    queryKey: ['opportunities'],
    queryFn: opportunitiesApi.list,
  });

  // ATS Metrics
  const publishedJobs = jobs.filter(job => job.status === 'Published').length;
  const totalApplications = applications.length;
  const hiredCandidates = applications.filter(app => app.stage === 'Hired').length;
  const averageTimeToHire = 14; // Mock calculation
  
  // Application pipeline stats
  const pipelineStats = [
    { stage: 'New', count: applications.filter(app => app.stage === 'New').length, color: 'bg-blue-500' },
    { stage: 'Screening', count: applications.filter(app => app.stage === 'Screening').length, color: 'bg-yellow-500' },
    { stage: 'Interview', count: applications.filter(app => app.stage === 'Interview').length, color: 'bg-purple-500' },
    { stage: 'Offer', count: applications.filter(app => app.stage === 'Offer').length, color: 'bg-green-500' },
    { stage: 'Hired', count: applications.filter(app => app.stage === 'Hired').length, color: 'bg-emerald-500' },
    { stage: 'Rejected', count: applications.filter(app => app.stage === 'Rejected').length, color: 'bg-red-500' },
  ];

  // CRM Metrics
  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const wonDeals = opportunities.filter(opp => opp.stage === 'Won');
  const wonValue = wonDeals.reduce((sum, opp) => sum + opp.value, 0);
  const conversionRate = opportunities.length > 0 ? (wonDeals.length / opportunities.length) * 100 : 0;

  // Source effectiveness (mock data)
  const sourceData = [
    { source: 'Indeed', applications: 25, hired: 3, rate: 12 },
    { source: 'LinkedIn', applications: 20, hired: 5, rate: 25 },
    { source: 'Referrals', applications: 15, hired: 8, rate: 53 },
    { source: 'Company Website', applications: 18, hired: 2, rate: 11 },
    { source: 'Other', applications: 12, hired: 1, rate: 8 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Track your hiring and sales performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{publishedJobs}</div>
              <div className="text-sm text-gray-500">Active Jobs</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
              <div className="text-sm text-gray-500">Total Applications</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{hiredCandidates}</div>
              <div className="text-sm text-gray-500">Hired</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{averageTimeToHire}</div>
              <div className="text-sm text-gray-500">Days to Hire</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
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
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${wonValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Won Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {conversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Pipeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h3>
          <div className="space-y-4">
            {pipelineStats.map(stat => (
              <div key={stat.stage} className="flex items-center">
                <div className="w-24 text-sm font-medium text-gray-700">{stat.stage}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stat.color} h-2 rounded-full`}
                      style={{ width: `${Math.max((stat.count / Math.max(...pipelineStats.map(s => s.count))) * 100, 5)}%` }}
                    />
                  </div>
                </div>
                <div className="w-8 text-sm font-semibold text-gray-900">{stat.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Effectiveness */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Effectiveness</h3>
          <div className="space-y-4">
            {sourceData.map(source => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{source.source}</div>
                  <div className="text-xs text-gray-500">
                    {source.applications} applications, {source.hired} hired
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{source.rate}%</div>
                  <div className="text-xs text-gray-500">hire rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time to Hire Trend (Mock Chart) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Hire Trend</h3>
        <div className="h-64 flex items-end justify-center space-x-2">
          {[16, 12, 18, 14, 10, 15, 13, 11, 14, 12].map((days, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t"
                style={{ height: `${(days / 20) * 200}px`, width: '24px' }}
              />
              <div className="text-xs text-gray-500 mt-2">W{index + 1}</div>
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Average time to hire over the last 10 weeks
        </div>
      </div>
    </div>
  );
};