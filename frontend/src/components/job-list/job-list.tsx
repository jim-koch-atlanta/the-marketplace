import React, { useState, useEffect } from 'react';
import JobCard from '../job-card/job-card';
import './job-list.module.css';
import { backendUrl, Job } from '../../backend';

interface JobListProps {
  title: string;
  filter: string;
  onJobSelected: any;
}

export const JobList: React.FC<JobListProps> = (props: JobListProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const url = `http://localhost:3000/api/jobs?filter=${props.filter}&limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, [props.filter]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-list">
      <h2>{props.title}</h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onJobSelect={props.onJobSelected} />
      ))}
    </div>
  );
};

export default JobList;