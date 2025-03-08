import { getAllJobs } from './utils/airtable';
import JobList from './components/JobList';
// import global from './globals.css';

export default async function Home() {
  const jobs = await getAllJobs();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <h1 className="site-title">Computer Science Jobs</h1>
          <p className="site-subtitle">Updated Daily @ 9:00 AM EST</p>
        </div>
      </header>

      {/* Job Listings with Search */}
      <JobList initialJobs={jobs} />
    </main>
  );
} 
