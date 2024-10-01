// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import React, { useState } from 'react';

import { Job, createDefaultUser } from '../backend';
import JobList from '../../src/components/job-list/job-list';
import JobDetailsPanel from '../../src/components/job-details/job-details';
import CreateJobModal from '../../src/components/create-job-modal/create-job-modal';

export function App() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Track selected job
  const [isCreateJobModalOpen, setCreateJobModalOpen] = useState(false);

  const handleJobSelect = (job: any) => {
    setSelectedJob(job); // Set the selected job when "More" is clicked
  };

  const openCreateJobModal = () => {
    setCreateJobModalOpen(true);
  };

  const closeCreateJobModal = () => {
    setCreateJobModalOpen(false);
  };

  createDefaultUser();

  return (
    <div>
      <button className="create-job-button" onClick={openCreateJobModal}>Create Job</button> {/* Create Job button */}

      {/* Render the CreateJobModal if it's open */}
      {isCreateJobModalOpen && (
        <CreateJobModal onClose={closeCreateJobModal} />
      )}
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
    </div>
  );
}

export default App;
