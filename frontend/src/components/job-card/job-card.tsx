import React from 'react';
import './job-card.module.css';

interface JobProps {
  description: string;
  posterName: string;
}

export const JobCard: React.FC<JobProps> = ({ description, posterName }) => {
  return (
    <div className="job-card">
      <h3 className="job-description">{description}</h3>
      <p className="poster-id">Posted by: {posterName}</p>
      <button className="more-button">More</button>
    </div>
  );
};

export default JobCard;
