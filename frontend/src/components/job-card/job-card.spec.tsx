import { render } from '@testing-library/react';

import JobCard from './job-card';

describe('Job', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JobCard description='Test Job' posterName='Jim' />);
    expect(baseElement).toBeTruthy();
  });
});
