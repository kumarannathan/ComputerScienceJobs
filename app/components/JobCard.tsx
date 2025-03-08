import { Job } from '../utils/airtable';

interface JobCardProps {
  job: Job;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatSalary(salary: string | undefined) {
  if (!salary) return 'Not specified';
  
  // Extract all numbers from the salary string
  const numbers = salary.match(/\d+/g);
  if (!numbers) return salary;

  // Convert numbers to integers
  const salaryNumbers = numbers.map(num => parseInt(num, 10));
  
  // Format the numbers as currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  // If there are two numbers, it's probably a range
  if (salaryNumbers.length >= 2) {
    const min = Math.min(...salaryNumbers);
    const max = Math.max(...salaryNumbers);
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  
  // Single number
  return formatter.format(salaryNumbers[0]);
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="job-card">
      <div className="job-title">{job.title}</div>
      <div className="job-company">{job.company}</div>
      <div className="job-location">{job.location}</div>
      <div className="job-salary">{formatSalary(job.salary)}</div>
      <div className="job-date">{formatDate(job.datePosted)}</div>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="apply-button"
      >
        Apply
      </a>
    </div>
  );
} 