// eslint-disable-next-line @typescript-eslint/no-unused-vars
import './app.module.css';
import JobList from '../../src/components/job-list/job-list';

export function App() {
  return (
    <div className="job-list-container">
      <div className="job-list-item">
        <JobList title="Most Recent Jobs" filter="most_recent" />
      </div>
      <div className="job-list-item">
        <JobList title="Most Active Jobs" filter="most_active" />
      </div>
    </div>
  );
}

export default App;
