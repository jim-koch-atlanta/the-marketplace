import React from 'react';
import './job-card.module.css';
import { Job } from 'src/backend';

interface JobProps {
  job: Job;
  onJobSelect: any;
}

export const JobCard: React.FC<JobProps> = ({ job, onJobSelect }) => {
  return (
    <div className="job-card">
      <h3 className="job-description">{job.description}</h3>
      <p className="poster-id">Posted by: {job.poster.name}</p>
      <button className="more-button" onClick={() => onJobSelect(job)}>More Info</button> {/* Call onJobSelect when the button is clicked */}
    </div>
  );
};

export default JobCard;
