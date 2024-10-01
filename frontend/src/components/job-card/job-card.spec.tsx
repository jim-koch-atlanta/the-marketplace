import { render } from '@testing-library/react';

import JobCard from './job-card';
import { Job } from 'src/backend';

describe('Job', () => {
  it('should render successfully', () => {
    const user: User = {
      id: 'user123',
      name: 'John Doe',
      contactInfo: {
          emailAddress: 'john@example.com',
          phoneNumber: '1234567890'
      }
    };

    // Set the auction to start today and end tomorrow.
    const auctionStartDate = new Date();
    const auctionEndDate = new Date();
    auctionEndDate.setDate(auctionStartDate.getDate() + 1);

    const job: Job = {
      id: 'job123',
      description: 'Software Engineer',
      poster: user,
      auctionStartDate: auctionStartDate.toISOString(),
      auctionEndDate: auctionEndDate.toISOString()
    };

    const { baseElement } = render(<JobCard job={job} onJobSelect={null} />);
    expect(baseElement).toBeTruthy();
  });
});
