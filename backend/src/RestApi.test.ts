import request from 'supertest';
import express from 'express';
import { RestApi } from './RestApi'; // Adjust the path to where RestApi is located
import { DatabaseManager } from './DatabaseManager'; // Adjust the path
import { Job, Bid } from './types'; // Adjust the path

// Mock the DatabaseManager
jest.mock('./DatabaseManager');

// Mock jobs that will be used by the unit tests.
const mockJob1: Job =
{
    id: 'job1',
    description: 'Test Job 1',
    requirements: ['JavaScript', 'React'],
    poster: { id: 'user1', name: 'John', contactInfo: { emailAddress: 'john@example.com' } },
    auctionStartDate: new Date(),
    auctionEndDate: new Date(),
};

const mockJob2: Job = 
{
    id: 'job2',
    description: 'Test Job 2',
    requirements: ['TypeScript', 'Node.js'],
    poster: { id: 'user2', name: 'Jane', contactInfo: { emailAddress: 'jane@example.com' } },
    auctionStartDate: new Date(),
    auctionEndDate: new Date(),
};

const mockJobs: Job[] = [
    mockJob1,
    mockJob2
];

describe('RestApi', () => {
    let expressApi: express.Express;
    let dbManager: jest.Mocked<DatabaseManager>;

    beforeEach(() => {
        // Create a mocked instance of DatabaseManager.
        dbManager = new DatabaseManager(':memory:') as jest.Mocked<DatabaseManager>;

        // Initialize RestApi with the mocked dbManager.
        const api = new RestApi(dbManager);
        expressApi = api['expressApi'];
    });

    afterEach(() => {
        // Between tests, clear any mock history.
        jest.clearAllMocks();
    });

    // POST /api/jobs
    it('should create a new job', async () => {
        dbManager.insertJob.mockResolvedValueOnce();

        // Set the auction to start today and end tomorrow.
        const auctionStartDate = new Date();
        const auctionEndDate = new Date();
        auctionEndDate.setDate(auctionStartDate.getDate() + 1);
        
        const newJob = {
            id: 'job1',
            description: 'Test Job',
            requirements: ['JavaScript', 'Node.js'],
            posterId: 'user1',
            auctionStartDate: auctionStartDate,
            auctionEndDate: auctionEndDate,
        };

        const response = await request(expressApi)
            .post('/api/jobs')
            .send(newJob);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Job created successfully');
        expect(dbManager.insertJob).toHaveBeenCalledWith(expect.objectContaining({
            id: newJob.id,
            description: newJob.description,
            requirements: newJob.requirements,
            poster: expect.objectContaining({ id: newJob.posterId }),
            auctionStartDate: newJob.auctionStartDate,
            auctionEndDate: newJob.auctionEndDate,
        }));
    });

    // GET /api/jobs
    it('should return all jobs', async () => {
        dbManager.getJobs.mockResolvedValueOnce(mockJobs);

        const response = await request(expressApi).get('/api/jobs');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
        expect(dbManager.getJobs).toHaveBeenCalled();
    });

    it('should handle errors when retrieving jobs', async () => {
        // Mock dbManager.getJobs to throw an exception
        dbManager.getJobs.mockRejectedValueOnce(new Error('Database error'));
    
        const response = await request(expressApi).get('/api/jobs');
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error' });
        expect(dbManager.getJobs).toHaveBeenCalled();
    });

    // GET /api/jobs/:id
    it('should return a job by ID', async () => {
        dbManager.getJobById.mockResolvedValueOnce(mockJob1);

        const response = await request(expressApi).get('/api/jobs/job1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJob1);
        expect(dbManager.getJobById).toHaveBeenCalledWith('job1');
    });

    it('should handle errors when retrieving a job by ID', async () => {
        // Mock dbManager.getJobById to throw an exception
        dbManager.getJobById.mockRejectedValueOnce(new Error('Database error'));
    
        const response = await request(expressApi).get('/api/jobs');
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error' });
        expect(dbManager.getJobById).toHaveBeenCalledWith('job1');
    });

    // POST /api/jobs/:id/bids
    it('should place a bid on a job', async () => {
         // Mock the job retrieval.
        dbManager.getJobById.mockResolvedValueOnce(mockJob1);

        // Mock the bid insertion
        dbManager.insertBid.mockResolvedValueOnce();

        const newBid = {
            bidId: 'bid1',
            amount: '500',
            bidderId: 'user2',
        };

        const response = await request(expressApi)
            .post('/api/jobs/job1/bids')
            .send(newBid);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Bid placed successfully');
        expect(dbManager.insertBid).toHaveBeenCalledWith(expect.objectContaining({
            id: newBid.bidId,
            jobId: 'job1',
            amount: newBid.amount,
            bidder: expect.objectContaining({ id: newBid.bidderId }),
        }));
    });

    it('should fail to place a bid on a non-existent job', async () => {
        // Mock the job retrieval.
        dbManager.getJobById.mockResolvedValueOnce(null);

        const newBid = {
            bidId: 'bid1',
            amount: '500',
            bidderId: 'user2',
        };

        const response = await request(expressApi)
            .post('/api/jobs/job1/bids')
            .send(newBid);

        expect(dbManager.getJobById).toHaveBeenCalledWith('job1');    
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Job not found');
    });

    it('should handle errors when placing a bid on a job', async () => {
        // Mock the job retrieval.
        dbManager.getJobById.mockResolvedValueOnce(mockJob1);

        // Mock dbManager.insertBid to throw an exception
        dbManager.insertBid.mockRejectedValueOnce(new Error('Database error'));

        const newBid = {
            bidId: 'bid1',
            amount: '500',
            bidderId: 'user2',
        };

        const response = await request(expressApi)
            .post('/api/jobs/job1/bids')
            .send(newBid);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Internal server error' });

        expect(dbManager.insertBid).toHaveBeenCalledWith(expect.objectContaining({
            id: newBid.bidId,
            jobId: 'job1',
            amount: newBid.amount,
            bidder: expect.objectContaining({ id: newBid.bidderId }),
        }));
    });

    // GET /api/jobs?filter=most_recent
    it('should return the most recent jobs', async () => {
        // Mock the database method for getting most recent jobs.
        dbManager.getMostRecentJobs.mockResolvedValueOnce(mockJobs);

        // Simulate a GET request to /api/jobs?filter=most_recent.
        const response = await request(expressApi).get('/api/jobs?filter=most_recent');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
        expect(dbManager.getMostRecentJobs).toHaveBeenCalledWith(10); // By default, limit is 10
    });

    // GET /api/jobs?filter=most_active
    it('should return the most active jobs (with the most bids)', async () => {
        // Mock the database method for getting most active jobs
        dbManager.getMostActiveJobs.mockResolvedValueOnce(mockJobs);

        // Simulate a GET request to /api/jobs?filter=most_active
        const response = await request(expressApi).get('/api/jobs?filter=most_active');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
        expect(dbManager.getMostActiveJobs).toHaveBeenCalledWith(10); // By default, limit is 10
    });

    // GET /api/jobs with a limit in the query
    it('should return the correct number of jobs when limit is specified', async () => {
        // Mock the database method for getting most recent jobs with limit.
        dbManager.getMostRecentJobs.mockResolvedValueOnce([ mockJob1 ]);

        // Simulate a GET request to /api/jobs?filter=most_recent&limit=1
        const response = await request(expressApi).get('/api/jobs?filter=most_recent&limit=1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([ mockJob1 ]);
        expect(dbManager.getMostRecentJobs).toHaveBeenCalledWith(1); // Limit is explicitly set to 1
    });
});
