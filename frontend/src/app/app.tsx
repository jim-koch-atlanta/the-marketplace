// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import React, {useState} from 'react';

import { Job, createDefaultUser } from '../backend';
import JobList from '../../src/components/job-list/job-list';
import JobDetailsPanel from '../../src/components/job-details/job-details';

export function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Track selected job

  const handleJobSelect = (job: any) => {
    setSelectedJob(job); // Set the selected job when "More" is clicked
  };

  createDefaultUser();

  return (
    <div className="job-list-container">
      <div className="job-list-item">
        <JobList title="Most Recent Jobs" filter="most_recent" onJobSelected={handleJobSelect} />
      </div>
      <div className="job-list-item">
        <JobList title="Most Active Jobs" filter="most_active" onJobSelected={handleJobSelect} />
      </div>

      {/* Job Details Panel */}
      {selectedJob &&
        <JobDetailsPanel selectedJob={selectedJob} />
      }      
    </div>
  );
}

export default App;
