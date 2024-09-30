import React, { useState, useEffect } from 'react';
import JobCard from '../job-card/job-card';
import './job-list.module.css';
import { backendUrl, Job } from '../../backend';

export const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[] | null>(null);  // Holds the job data
  const [loading, setLoading] = useState(true);  // Holds loading state

  // Fetch the jobs from the backend when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/jobs?filter=most_recent&limit=5`);
        const data = await response.json();
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Render a loading spinner if the data is still loading
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  // Render the jobs once the data has loaded
  return (
    <div className="job-list">
      {jobs && jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard key={job.id} description={job.description} posterName={job.poster.id} />
        ))
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
};

export default JobList;
