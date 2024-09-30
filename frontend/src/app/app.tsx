// eslint-disable-next-line @typescript-eslint/no-unused-vars
import JobList from '../../src/components/job-list/job-list';
import styles from './app.module.less';

import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <h1>Most Recent Jobs</h1>
      <JobList />
    </div>
  );
}

export default App;
