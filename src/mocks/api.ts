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
  ApplicationStage 
} from '../types';
import { db } from './db';
import { MOCK_LATENCY } from '../config';

const delay = () => {
  const ms = Math.random() * (MOCK_LATENCY.max - MOCK_LATENCY.min) + MOCK_LATENCY.min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Jobs API
export const jobsApi = {
  async list(): Promise<JobPosition[]> {
    await delay();
    return db.getAll('jobs');
  },

  async getById(id: string): Promise<JobPosition | null> {
    await delay();
    return db.getById('jobs', id) as JobPosition || null;
  },

  async create(job: Omit<JobPosition, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobPosition> {
    await delay();
    return db.create('jobs', job) as JobPosition;
  },

  async update(id: string, updates: Partial<JobPosition>): Promise<JobPosition | null> {
    await delay();
    return db.update('jobs', id, updates) as JobPosition | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('jobs', id);
  },
};

// Candidates API
export const candidatesApi = {
  async list(): Promise<Candidate[]> {
    await delay();
    return db.getAll('candidates');
  },

  async getById(id: string): Promise<Candidate | null> {
    await delay();
    return db.getById('candidates', id) as Candidate || null;
  },

  async create(candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> {
    await delay();
    return db.create('candidates', candidate) as Candidate;
  },

  async update(id: string, updates: Partial<Candidate>): Promise<Candidate | null> {
    await delay();
    return db.update('candidates', id, updates) as Candidate | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('candidates', id);
  },

  async findDuplicates(email: string): Promise<Candidate[]> {
    await delay();
    return db.findDuplicateCandidates(email);
  },
};

// Applications API
export const applicationsApi = {
  async list(): Promise<Application[]> {
    await delay();
    return db.getAll('applications');
  },

  async getById(id: string): Promise<Application | null> {
    await delay();
    return db.getById('applications', id) as Application || null;
  },

  async create(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    await delay();
    return db.create('applications', application) as Application;
  },

  async update(id: string, updates: Partial<Application>): Promise<Application | null> {
    await delay();
    return db.update('applications', id, updates) as Application | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('applications', id);
  },

  async moveStage(id: string, toStage: ApplicationStage): Promise<Application | null> {
    await delay();
    return db.moveApplicationStage(id, toStage);
  },

  async getByJobId(jobId: string): Promise<Application[]> {
    await delay();
    return db.getAll('applications').filter(app => app.jobId === jobId);
  },

  async getByCandidateId(candidateId: string): Promise<Application[]> {
    await delay();
    return db.getAll('applications').filter(app => app.candidateId === candidateId);
  },
};

// Interviews API
export const interviewsApi = {
  async list(): Promise<Interview[]> {
    await delay();
    return db.getAll('interviews');
  },

  async getById(id: string): Promise<Interview | null> {
    await delay();
    return db.getById('interviews', id) as Interview || null;
  },

  async create(interview: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>): Promise<Interview> {
    await delay();
    return db.create('interviews', interview) as Interview;
  },

  async update(id: string, updates: Partial<Interview>): Promise<Interview | null> {
    await delay();
    return db.update('interviews', id, updates) as Interview | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('interviews', id);
  },
};

// Offers API
export const offersApi = {
  async list(): Promise<Offer[]> {
    await delay();
    return db.getAll('offers');
  },

  async getById(id: string): Promise<Offer | null> {
    await delay();
    return db.getById('offers', id) as Offer || null;
  },

  async create(offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    await delay();
    return db.create('offers', offer) as Offer;
  },

  async update(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    await delay();
    return db.update('offers', id, updates) as Offer | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('offers', id);
  },
};

// Accounts API
export const accountsApi = {
  async list(): Promise<Account[]> {
    await delay();
    return db.getAll('accounts');
  },

  async getById(id: string): Promise<Account | null> {
    await delay();
    return db.getById('accounts', id) as Account || null;
  },

  async create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> {
    await delay();
    return db.create('accounts', account) as Account;
  },

  async update(id: string, updates: Partial<Account>): Promise<Account | null> {
    await delay();
    return db.update('accounts', id, updates) as Account | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('accounts', id);
  },
};

// Contacts API
export const contactsApi = {
  async list(): Promise<Contact[]> {
    await delay();
    return db.getAll('contacts');
  },

  async getById(id: string): Promise<Contact | null> {
    await delay();
    return db.getById('contacts', id) as Contact || null;
  },

  async create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    await delay();
    return db.create('contacts', contact) as Contact;
  },

  async update(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    await delay();
    return db.update('contacts', id, updates) as Contact | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('contacts', id);
  },

  async getByAccountId(accountId: string): Promise<Contact[]> {
    await delay();
    return db.getAll('contacts').filter(contact => contact.accountId === accountId);
  },
};

// Opportunities API
export const opportunitiesApi = {
  async list(): Promise<Opportunity[]> {
    await delay();
    return db.getAll('opportunities');
  },

  async getById(id: string): Promise<Opportunity | null> {
    await delay();
    return db.getById('opportunities', id) as Opportunity || null;
  },

  async create(opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Opportunity> {
    await delay();
    return db.create('opportunities', opportunity) as Opportunity;
  },

  async update(id: string, updates: Partial<Opportunity>): Promise<Opportunity | null> {
    await delay();
    return db.update('opportunities', id, updates) as Opportunity | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('opportunities', id);
  },

  async getByAccountId(accountId: string): Promise<Opportunity[]> {
    await delay();
    return db.getAll('opportunities').filter(opp => opp.accountId === accountId);
  },
};

// Activities API
export const activitiesApi = {
  async list(): Promise<Activity[]> {
    await delay();
    return db.getAll('activities');
  },

  async getById(id: string): Promise<Activity | null> {
    await delay();
    return db.getById('activities', id) as Activity || null;
  },

  async create(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    await delay();
    return db.create('activities', activity) as Activity;
  },

  async update(id: string, updates: Partial<Activity>): Promise<Activity | null> {
    await delay();
    return db.update('activities', id, updates) as Activity | null;
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    return db.delete('activities', id);
  },

  async getByEntity(entityType: string, entityId: string): Promise<Activity[]> {
    await delay();
    return db.getAll('activities').filter(activity => 
      activity.entityType === entityType && activity.entityId === entityId
    );
  },
};

// File upload simulation
export const filesApi = {
  async upload(file: File): Promise<string> {
    await delay();
    // Simulate S3-like URL generation
    const filename = `${Date.now()}-${file.name}`;
    return `https://fake-bucket.s3.amazonaws.com/uploads/${filename}`;
  },
};

// Database utilities
export const dbUtils = {
  async reset(): Promise<void> {
    await delay();
    db.reset();
  },

  async export(): Promise<any> {
    await delay();
    return db.exportData();
  },

  async import(data: any): Promise<void> {
    await delay();
    db.importData(data);
  },
};