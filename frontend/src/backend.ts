const REACT_APP_BACKEND_URL = 'http://localhost:3000/api'

export const backendUrl = REACT_APP_BACKEND_URL;

export type ContactInfo = {
  emailAddress: string;
  phoneNumber?: string; // Optional field
};

export type User = {
  id: string;
  name: string;
  contactInfo: ContactInfo;
};

export type Job = {
  id: string;
  description: string;
  requirements: string[];
  poster: User;
  auctionStartDate: string;
  auctionEndDate: string;
};

export type Bid = {
  id: string;
  jobId: string;

  // Stored as a string to avoid floating point imprecision.
  amount: string;
  bidder: User;
};
