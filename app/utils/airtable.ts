import Airtable from 'airtable';

// Debug logging
console.log('Environment variables check:');
console.log('API Key exists:', !!process.env.AIRTABLE_API_KEY);
console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
console.log('Table Name:', process.env.AIRTABLE_TABLE_NAME);

// Configure Airtable
if (!process.env.AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not configured');
}

if (!process.env.AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not configured');
}

if (!process.env.AIRTABLE_TABLE_NAME) {
  throw new Error('AIRTABLE_TABLE_NAME is not configured');
}

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

// Get the jobs table
const table = base(process.env.AIRTABLE_TABLE_NAME);

// Interface for job data
export interface Job {
  id: string;
  title: string;  // Position Title
  company: string;
  companyIndustry: string[];
  companySize: string;
  location: string;
  datePosted: string;  // Date
  url: string;  // Apply
  qualifications: string;
  salary: string;
  workModel: string;
  isNewGrad: string;
  h1bSponsored: string;
}

// Function to fetch all jobs
export async function getAllJobs(): Promise<Job[]> {
  try {
    const records = await table.select().all();
    return records.map((record) => ({
      id: record.id,
      title: record.get('Position Title') as string,
      company: record.get('Company') as string,
      companyIndustry: record.get('Company Industry') as string[],
      companySize: record.get('Company Size') as string,
      location: record.get('Location') as string,
      datePosted: record.get('Date') as string,
      url: record.get('Apply') as string,
      qualifications: record.get('Qualifications') as string,
      salary: record.get('Salary') as string,
      workModel: record.get('Work Model') as string,
      isNewGrad: record.get('Is New Grad') as string,
      h1bSponsored: record.get('H1b Sponsored') as string,
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

// Function to create a new job
export async function createJob(job: Omit<Job, 'id'>) {
  try {
    const record = await table.create({
      'Position Title': job.title,
      'Company': job.company,
      'Company Industry': job.companyIndustry,
      'Company Size': job.companySize,
      'Location': job.location,
      'Date': job.datePosted,
      'Apply': job.url,
      'Qualifications': job.qualifications,
      'Salary': job.salary,
      'Work Model': job.workModel,
      'Is New Grad': job.isNewGrad,
      'H1b Sponsored': job.h1bSponsored,
    });
    return record;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

// Function to update jobs daily
export async function updateJobs(): Promise<Job[]> {
  try {
    // Get existing jobs
    const existingJobs = await getAllJobs();
    
    // Remove jobs older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const jobsToRemove = existingJobs.filter(job => {
      const postedDate = new Date(job.datePosted);
      return postedDate < thirtyDaysAgo;
    });

    // Delete old jobs
    for (const job of jobsToRemove) {
      await table.destroy(job.id);
    }

    // Fetch new jobs from your sources
    // This is where you would implement your job scraping logic
    // For now, we'll just return the current jobs
    const currentJobs = await getAllJobs();
    
    console.log(`Removed ${jobsToRemove.length} old jobs`);
    console.log(`Current total: ${currentJobs.length} jobs`);
    
    return currentJobs;
  } catch (error) {
    console.error('Error updating jobs:', error);
    throw error;
  }
} 