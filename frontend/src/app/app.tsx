// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import JobList from '../../src/components/job-list/job-list';

import React, {useState} from 'react';
import { Job } from 'src/backend';

export function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Track selected job

  const handleJobSelect = (job: any) => {
    setSelectedJob(job); // Set the selected job when "More" is clicked
  };

  return (
    <div className="job-list-container">
      <div className="job-list-item">
        <JobList title="Most Recent Jobs" filter="most_recent" onJobSelected={handleJobSelect} />
      </div>
      <div className="job-list-item">
        <JobList title="Most Active Jobs" filter="most_active" onJobSelected={handleJobSelect} />
      </div>

      {/* Job Details Panel */}
      {selectedJob && (
        <div className="job-details-panel">
          <h2>{selectedJob.description}</h2>
          <p>Posted by: {selectedJob.poster.name}</p>
          <p>Requirements: {JSON.stringify(selectedJob.requirements)}</p>
          {/* Add more job details here as needed */}
        </div>
      )}      
    </div>
  );
}

export default App;
