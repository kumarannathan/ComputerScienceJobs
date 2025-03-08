'use client';

import { useState } from 'react';
import { Job } from '../utils/airtable';
import JobCard from './JobCard';

interface JobListProps {
  initialJobs: Job[];
}

type SortField = 'salary' | 'datePosted';
type SortOrder = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  order: SortOrder;
  label: string;
}

const sortOptions: SortOption[] = [
  { field: 'datePosted', order: 'desc', label: 'Newest First' },
  { field: 'datePosted', order: 'asc', label: 'Oldest First' },
  { field: 'salary', order: 'desc', label: 'Highest Salary First' },
  { field: 'salary', order: 'asc', label: 'Lowest Salary First' },
];

export default function JobList({ initialJobs }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('datePosted');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 100;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
    
    const filtered = initialJobs.filter(job => 
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
    );
    setFilteredJobs(sortJobs(filtered, sortField, sortOrder));
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page on new sort
    setFilteredJobs(sortJobs(filteredJobs, field, order));
  };

  const sortJobs = (jobs: Job[], field: SortField, order: SortOrder): Job[] => {
    return [...jobs].sort((a, b) => {
      if (field === 'salary') {
        const salaryA = parseSalary(a.salary);
        const salaryB = parseSalary(b.salary);
        return order === 'asc' ? salaryA - salaryB : salaryB - salaryA;
      } else {
        const dateA = new Date(a.datePosted).getTime();
        const dateB = new Date(b.datePosted).getTime();
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
  };

  const parseSalary = (salary: string | undefined): number => {
    if (!salary) return 0;
    
    // Extract all numbers from the salary string
    const numbers = salary.match(/\d+/g);
    if (!numbers) return 0;
    
    // If there's a range, take the higher number
    const salaryNumbers = numbers.map(num => parseInt(num, 10));
    return Math.max(...salaryNumbers);
  };

  const getCurrentPageJobs = () => {
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container job-list">
      {/* Search and Sort Bar */}
      <div className="search-sort-container">
        <input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          onChange={handleSort}
          value={`${sortField}-${sortOrder}`}
          className="sort-select"
        >
          {sortOptions.map((option) => (
            <option 
              key={`${option.field}-${option.order}`} 
              value={`${option.field}-${option.order}`}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        Showing {Math.min(jobsPerPage, filteredJobs.length - (currentPage - 1) * jobsPerPage)} jobs 
        {filteredJobs.length > jobsPerPage && ` (page ${currentPage} of ${totalPages})`}
      </div>

      {/* Job Cards */}
      <div className="jobs-container">
        {/* Column Headers */}
        <div className="jobs-header">
          <div>Title</div>
          <div>Company</div>
          <div>Location</div>
          <div>Salary</div>
          <div>Posted</div>
          <div></div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          getCurrentPageJobs().map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="no-jobs">
            No jobs found matching your search criteria
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 