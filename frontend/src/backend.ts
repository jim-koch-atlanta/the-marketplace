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

// TODO: Utilize IAM / OAuth to support an actual user.
const axios = require('axios');

// Define your default user payload
export const defaultUser = {
  id: 'default-user-id',
  name: 'Jim Koch',
  emailAddress: 'jimkoch@gmail.com',
};

// Function to create the default user on startup
export const createDefaultUser = async () => {
  try {
    // Make the POST request to the /api/users endpoint
    const url = `${backendUrl}/users`;
    const response = await axios.post(url, defaultUser);
    console.log('Default user created:', response.data);
  } catch (error) {
    console.error(`Error creating default user:, ${JSON.stringify(error)}`);
  }
};
