import { render } from '@testing-library/react';

import JobList from './job-list';

describe('JobList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JobList />);
    expect(baseElement).toBeTruthy();
  });
});
