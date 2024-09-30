const REACT_APP_BACKEND_URL = 'http://localhost:3000/api'

export const backendUrl = REACT_APP_BACKEND_URL;

export interface Job {
  id: string;
  description: string;
  poster: {
    id: string;
    name: string;
    contactInfo: {
      emailAddress: string;
    };
  };
  auctionStartDate: string;
  auctionEndDate: string;
};

