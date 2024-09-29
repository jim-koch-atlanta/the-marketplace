import { DatabaseManager } from './DatabaseManager';
import { User, Job, Bid } from './types';

describe('DatabaseManager', () => {
    let dbManager: DatabaseManager;

    beforeAll(async () => {
        // Initialize an in-memory SQLite database.
        dbManager = new DatabaseManager(':memory:');
        await dbManager.initialize();
    });

    afterEach(async () => {
        await dbManager.getDatabase().exec('DELETE FROM users;');
        await dbManager.getDatabase().exec('DELETE FROM jobs;');
        await dbManager.getDatabase().exec('DELETE FROM bids;');
    });

    it('should insert a user and retrieve it', async () => {
        const user: User = {
            id: 'user123',
            name: 'John Doe',
            contactInfo: {
                emailAddress: 'john@example.com',
                phoneNumber: '1234567890'
            }
        };

        await dbManager.insertUser(user);

        // Manually query the database and validate the insertion.
        const result = await dbManager.getDatabase().get('SELECT * FROM users WHERE id = ?', user.id);
        expect(result).toEqual({
            id: user.id,
            name: user.name,
            emailAddress: user.contactInfo.emailAddress,
            phoneNumber: user.contactInfo.phoneNumber
        });
    });

    it('should insert a job and retrieve it', async () => {
        const user: User = {
            id: 'user123',
            name: 'John Doe',
            contactInfo: {
                emailAddress: 'john@example.com',
                phoneNumber: '1234567890'
            }
        };

        await dbManager.insertUser(user);

        // Set the auction to start today and end tomorrow.
        const auctionStartDate = new Date();
        const auctionEndDate = new Date();
        auctionEndDate.setDate(auctionStartDate.getDate() + 1);

        const job: Job = {
            id: 'job123',
            description: 'Software Engineer',
            requirements: ['JavaScript', 'TypeScript'],
            poster: user,
            auctionStartDate: auctionStartDate,
            auctionEndDate: auctionEndDate
        };

        await dbManager.insertJob(job);

        // Retrieve the job and validate the insertion.
        const retrievedJobs = await dbManager.getJobsById(job.id);
        expect(retrievedJobs).toHaveLength(1);
        const retrievedJob = retrievedJobs[0];

        expect(retrievedJob).toMatchObject(job);
    });

    it('should insert a bid and retrieve most active jobs', async () => {
        const user: User = {
            id: 'user123',
            name: 'John Doe',
            contactInfo: {
                emailAddress: 'john@example.com',
                phoneNumber: '1234567890'
            }
        };

        await dbManager.insertUser(user);

        // Set the auction to start today and end tomorrow.
        const auctionStartDate = new Date();
        const auctionEndDate = new Date();
        auctionEndDate.setDate(auctionStartDate.getDate() + 1);

        const job: Job = {
            id: 'job123',
            description: 'Software Engineer',
            requirements: ['JavaScript', 'TypeScript'],
            poster: user,
            auctionStartDate: auctionStartDate,
            auctionEndDate: auctionEndDate
        };

        await dbManager.insertJob(job);

        const bid: Bid = {
            id: 'bid123',
            jobId: job.id,
            amount: '500',
            bidder: user,
        };

        await dbManager.insertBid(bid);

        // Retrieve the most active jobs and validate.
        const mostActiveJobs = await dbManager.getMostActiveJobs(1);
        expect(mostActiveJobs).toHaveLength(1);

        const activeJob = mostActiveJobs[0];
        expect(activeJob.id).toBe(job.id);
    });
});
