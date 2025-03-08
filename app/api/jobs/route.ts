import { NextResponse } from 'next/server';
import { getAllJobs, updateJobs } from '../../utils/airtable';
import cron from 'node-cron';

// Track the last update time
let lastUpdateTime = new Date();

// Schedule job updates every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Running daily job update at 9 AM');
    
    // Perform the job update
    const updatedJobs = await updateJobs();
    
    // Update the last update time
    lastUpdateTime = new Date();
    
    console.log(`Successfully updated ${updatedJobs.length} jobs`);
  } catch (error) {
    console.error('Error in scheduled job update:', error);
  }
});

export async function GET(request: Request) {
  try {
    const jobs = await getAllJobs();
    if (!jobs || jobs.length === 0) {
      console.error('No jobs found or error occurred');
      return NextResponse.json(
        { error: 'No jobs found or error occurred' },
        { status: 500 }
      );
    }
    
    // Include last update time in the response
    return NextResponse.json({ 
      jobs,
      lastUpdateTime: lastUpdateTime.toISOString(),
      totalJobs: jobs.length
    });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 