export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  skills: string[];
  openings: number;
  status: 'Draft' | 'Published' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experienceYears: number;
  currentTitle: string;
  currentCompany: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStage = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface StageHistory {
  from: ApplicationStage;
  to: ApplicationStage;
  at: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  stage: ApplicationStage;
  stageHistory: StageHistory[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduleISO: string;
  panel: string[];
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  applicationId: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  variables: {
    ctc: number;
    joiningDate: string;
  };
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  industry: string;
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage = 'Prospect' | 'Qualified' | 'Won' | 'Lost';

export interface Opportunity {
  id: string;
  accountId: string;
  title: string;
  stage: OpportunityStage;
  value: number;
  probability: number;
  createdAt: string;
  updatedAt: string;
}

export type EntityType = 'candidate' | 'job' | 'application' | 'account' | 'opportunity';
export type ActivityType = 'task' | 'call' | 'email' | 'meeting';

export interface Activity {
  id: string;
  entityType: EntityType;
  entityId: string;
  type: ActivityType;
  subject: string;
  dueAt?: string;
  doneAt?: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Recruiter' | 'Sales';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}