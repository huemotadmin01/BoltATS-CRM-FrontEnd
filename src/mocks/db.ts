import { 
  JobPosition, 
  Candidate, 
  Application, 
  Interview, 
  Offer, 
  Account, 
  Contact, 
  Opportunity, 
  Activity,
  ApplicationStage,
  OpportunityStage
} from '../types';

const STORAGE_KEY = 'ats-crm-mock-db';

export interface MockDB {
  jobs: JobPosition[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  offers: Offer[];
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
  activities: Activity[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const seedData: MockDB = {
  jobs: [
    {
      id: generateId(),
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      skills: ['React', 'TypeScript', 'Node.js'],
      openings: 2,
      status: 'Published',
      createdAt: new Date(2024, 0, 15).toISOString(),
      updatedAt: new Date(2024, 0, 15).toISOString(),
    },
    {
      id: generateId(),
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      employmentType: 'Full-time',
      skills: ['Product Strategy', 'Analytics', 'SQL'],
      openings: 1,
      status: 'Published',
      createdAt: new Date(2024, 0, 20).toISOString(),
      updatedAt: new Date(2024, 0, 20).toISOString(),
    },
    {
      id: generateId(),
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      employmentType: 'Full-time',
      skills: ['Figma', 'User Research', 'Prototyping'],
      openings: 1,
      status: 'Published',
      createdAt: new Date(2024, 1, 1).toISOString(),
      updatedAt: new Date(2024, 1, 1).toISOString(),
    }
  ],
  candidates: [],
  applications: [],
  interviews: [],
  offers: [],
  accounts: [
    {
      id: generateId(),
      name: 'Acme Corp',
      industry: 'Technology',
      owner: 'John Smith',
      notes: 'Potential client for enterprise solution',
      createdAt: new Date(2024, 0, 10).toISOString(),
      updatedAt: new Date(2024, 0, 10).toISOString(),
    },
    {
      id: generateId(),
      name: 'GlobalTech Inc',
      industry: 'Manufacturing',
      owner: 'Sarah Johnson',
      notes: 'Interested in automation solutions',
      createdAt: new Date(2024, 0, 12).toISOString(),
      updatedAt: new Date(2024, 0, 12).toISOString(),
    }
  ],
  contacts: [],
  opportunities: [],
  activities: [],
};

// Generate more seed data
const skills = ['JavaScript', 'Python', 'Java', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes'];
const companies = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Uber', 'Airbnb', 'Stripe', 'Shopify'];
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

// Generate candidates
for (let i = 0; i < 50; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const candidateSkills = skills.slice(0, Math.floor(Math.random() * 5) + 2);
  
  seedData.candidates.push({
    id: generateId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    skills: candidateSkills,
    experienceYears: Math.floor(Math.random() * 10) + 1,
    currentTitle: 'Software Engineer',
    currentCompany: companies[Math.floor(Math.random() * companies.length)],
    tags: ['JavaScript', 'Remote'],
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
    updatedAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
  });
}

// Generate applications
const stages: ApplicationStage[] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
for (let i = 0; i < 60; i++) {
  const stage = stages[Math.floor(Math.random() * stages.length)];
  const createdAt = new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString();
  
  seedData.applications.push({
    id: generateId(),
    candidateId: seedData.candidates[Math.floor(Math.random() * seedData.candidates.length)].id,
    jobId: seedData.jobs[Math.floor(Math.random() * seedData.jobs.length)].id,
    stage,
    stageHistory: [
      {
        from: 'New' as ApplicationStage,
        to: stage,
        at: createdAt,
      }
    ],
    notes: 'Initial application review pending',
    createdAt,
    updatedAt: createdAt,
  });
}

// Generate contacts for accounts
seedData.accounts.forEach(account => {
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    seedData.contacts.push({
      id: generateId(),
      accountId: account.id,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${account.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      title: ['CEO', 'CTO', 'VP Engineering', 'Director of Product'][Math.floor(Math.random() * 4)],
      createdAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
      updatedAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
    });
  }
});

// Generate opportunities
const opportunityStages: OpportunityStage[] = ['Prospect', 'Qualified', 'Won', 'Lost'];
for (let i = 0; i < 12; i++) {
  seedData.opportunities.push({
    id: generateId(),
    accountId: seedData.accounts[Math.floor(Math.random() * seedData.accounts.length)].id,
    title: `Q${Math.floor(Math.random() * 4) + 1} ${new Date().getFullYear()} Deal`,
    stage: opportunityStages[Math.floor(Math.random() * opportunityStages.length)],
    value: Math.floor(Math.random() * 500000) + 50000,
    probability: Math.floor(Math.random() * 100),
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
    updatedAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
  });
}

// Generate activities
const activityTypes = ['task', 'call', 'email', 'meeting'] as const;
const entityTypes = ['candidate', 'job', 'application', 'account', 'opportunity'] as const;
for (let i = 0; i < 40; i++) {
  const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
  let entityId = '';
  
  switch (entityType) {
    case 'candidate':
      entityId = seedData.candidates[Math.floor(Math.random() * seedData.candidates.length)].id;
      break;
    case 'job':
      entityId = seedData.jobs[Math.floor(Math.random() * seedData.jobs.length)].id;
      break;
    case 'application':
      entityId = seedData.applications[Math.floor(Math.random() * seedData.applications.length)].id;
      break;
    case 'account':
      entityId = seedData.accounts[Math.floor(Math.random() * seedData.accounts.length)].id;
      break;
    case 'opportunity':
      entityId = seedData.opportunities[Math.floor(Math.random() * seedData.opportunities.length)].id;
      break;
  }

  seedData.activities.push({
    id: generateId(),
    entityType,
    entityId,
    type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
    subject: `Follow up on ${entityType}`,
    dueAt: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    doneAt: Math.random() > 0.7 ? new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString() : undefined,
    assignee: firstNames[Math.floor(Math.random() * firstNames.length)],
    createdAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
    updatedAt: new Date(2024, 0, Math.floor(Math.random() * 60) + 1).toISOString(),
  });
}

export class MockDatabase {
  private data: MockDB;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): MockDB {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage, using seed data:', error);
    }
    return { ...seedData };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  // Generic CRUD operations
  getAll<T extends keyof MockDB>(entity: T): MockDB[T] {
    return this.data[entity];
  }

  getById<T extends keyof MockDB>(entity: T, id: string): MockDB[T][number] | undefined {
    return (this.data[entity] as any[]).find((item: any) => item.id === id);
  }

  create<T extends keyof MockDB>(entity: T, item: Omit<MockDB[T][number], 'id' | 'createdAt' | 'updatedAt'>): MockDB[T][number] {
    const now = new Date().toISOString();
    const newItem = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as MockDB[T][number];

    (this.data[entity] as any[]).push(newItem);
    this.saveToStorage();
    return newItem;
  }

  update<T extends keyof MockDB>(entity: T, id: string, updates: Partial<MockDB[T][number]>): MockDB[T][number] | null {
    const items = this.data[entity] as any[];
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    items[index] = updatedItem;
    this.saveToStorage();
    return updatedItem;
  }

  delete<T extends keyof MockDB>(entity: T, id: string): boolean {
    const items = this.data[entity] as any[];
    const index = items.findIndex((item: any) => item.id === id);
    
    if (index === -1) return false;

    items.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Special operations
  moveApplicationStage(applicationId: string, toStage: ApplicationStage): Application | null {
    const application = this.getById('applications', applicationId) as Application;
    if (!application) return null;

    const stageHistory = [...application.stageHistory];
    stageHistory.push({
      from: application.stage,
      to: toStage,
      at: new Date().toISOString(),
    });

    return this.update('applications', applicationId, {
      stage: toStage,
      stageHistory,
    }) as Application;
  }

  findDuplicateCandidates(email: string): Candidate[] {
    return this.data.candidates.filter(candidate => candidate.email === email);
  }

  reset(): void {
    this.data = { ...seedData };
    this.saveToStorage();
  }

  exportData(): MockDB {
    return { ...this.data };
  }

  importData(data: MockDB): void {
    this.data = { ...data };
    this.saveToStorage();
  }
}

export const db = new MockDatabase();