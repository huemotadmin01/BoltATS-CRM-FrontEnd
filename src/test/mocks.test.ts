import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../mocks/db';
import { candidatesApi } from '../mocks/api';

describe('Mock Database', () => {
  beforeEach(() => {
    db.reset();
  });

  it('should create and retrieve a candidate', async () => {
    const candidateData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      skills: ['React', 'TypeScript'],
      experienceYears: 5,
      currentTitle: 'Software Engineer',
      currentCompany: 'Tech Corp',
      tags: ['Senior', 'Remote'],
    };

    const created = await candidatesApi.create(candidateData);
    expect(created).toHaveProperty('id');
    expect(created.name).toBe(candidateData.name);
    expect(created.email).toBe(candidateData.email);

    const retrieved = await candidatesApi.getById(created.id);
    expect(retrieved).toEqual(created);
  });

  it('should detect duplicate candidates by email', async () => {
    const email = 'duplicate@example.com';
    
    await candidatesApi.create({
      name: 'John Doe',
      email,
      phone: '+1-555-0123',
      skills: ['React'],
      experienceYears: 5,
      currentTitle: 'Engineer',
      currentCompany: 'Corp',
      tags: [],
    });

    await candidatesApi.create({
      name: 'Jane Doe',
      email,
      phone: '+1-555-0124',
      skills: ['Vue'],
      experienceYears: 3,
      currentTitle: 'Developer',
      currentCompany: 'Inc',
      tags: [],
    });

    const duplicates = await candidatesApi.findDuplicates(email);
    expect(duplicates).toHaveLength(2);
  });

  it('should update application stage and history', () => {
    // Create application
    const application = db.create('applications', {
      candidateId: 'candidate1',
      jobId: 'job1',
      stage: 'New' as const,
      stageHistory: [{
        from: 'New' as const,
        to: 'New' as const,
        at: new Date().toISOString(),
      }],
      notes: 'Initial application',
    });

    // Move to screening
    const updated = db.moveApplicationStage(application.id, 'Screening');
    
    expect(updated?.stage).toBe('Screening');
    expect(updated?.stageHistory).toHaveLength(2);
    expect(updated?.stageHistory[1].from).toBe('New');
    expect(updated?.stageHistory[1].to).toBe('Screening');
  });
});