import cors from 'cors';
import express, { Request, Response } from 'express';
import { DatabaseManager } from './DatabaseManager';
import { Job, Bid, User } from './types';

export class RestApi {
    private expressApi = express();

    constructor(private dbManager: DatabaseManager) {
        this.expressApi.use(cors({
            origin: ['http://localhost:8080', 'http://frontend:8080'],
        }));
        this.expressApi.use(express.json()); // Middleware to parse JSON request bodies
        this.routes();
    }

    // Start the Express server
    public listen(port: number) {
        this.expressApi.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }

    // Define API routes
    public routes() {
        // Create a new job
        this.expressApi.post('/api/jobs', this.createJob.bind(this));

        // Get all jobs (with optional filtering)
        this.expressApi.get('/api/jobs', this.getAllJobs.bind(this));

        // Get details of a specific job by ID
        this.expressApi.get('/api/jobs/:id', this.getJobById.bind(this));

        // Place a new bid on a job
        this.expressApi.post('/api/jobs/:id/bids', this.placeBid.bind(this));

        // Create a new user
        this.expressApi.post('/api/users', this.createUser.bind(this));
    }

    // POST /api/users: Create a new user
    public async createUser(req: Request, res: Response) {
        try {
            const { id, name, emailAddress, phoneNumber } = req.body;
            
            const user: User = {
                id,
                name,
                contactInfo: {
                    emailAddress,
                    phoneNumber
                }
            };

            await this.dbManager.insertUser(user);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(`Error creating job: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/jobs: Create a new job
    public async createJob(req: Request, res: Response) {
        try {
            const { id, description, requirements, posterId, auctionStartDate, auctionEndDate } = req.body;
            
            const job: Job = {
                id,
                description,
                requirements,
                poster: { id: posterId, name: '', contactInfo: { emailAddress: '' } }, // Only id is needed
                auctionStartDate: new Date(auctionStartDate),
                auctionEndDate: new Date(auctionEndDate)
            };

            await this.dbManager.insertJob(job);
            res.status(201).json({ message: 'Job created successfully' });
        } catch (error) {
            console.error(`Error creating job: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/jobs: Get all job postings (with optional filters)
    public async getAllJobs(req: Request, res: Response) {
        try {
            const { filter, limit } = req.query;

            let jobs: Job[] = [];

            // Filter by most recent or most active
            if (filter === 'most_recent') {
                const numberOfJobs = limit ? parseInt(limit as string) : 10;
                jobs = await this.dbManager.getMostRecentJobs(numberOfJobs);
            } else if (filter === 'most_active') {
                const numberOfJobs = limit ? parseInt(limit as string) : 10;
                jobs = await this.dbManager.getMostActiveJobs(numberOfJobs);
            } else {
                jobs = await this.dbManager.getJobs(); // Get all jobs
            }

            res.json(jobs);
        } catch (error) {
            console.error(`Error retrieving jobs: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/jobs/:id: Get details of a specific job
    public async getJobById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const job = await this.dbManager.getJobById(id);

            if (job) {
                res.json(job);
            } else {
                res.status(404).json({ error: 'Job not found' });
            }
        } catch (error) {
            console.error(`Error retrieving job by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/jobs/:id/bids: Place a new bid on a job
    public async placeBid(req: Request, res: Response) {
        try {
            const { id: jobId } = req.params;
            const { bidId, amount, bidderId } = req.body;

            const job = await this.dbManager.getJobById(jobId);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            const bid: Bid = {
                id: bidId,
                jobId,
                amount,
                bidder: { id: bidderId, name: '', contactInfo: { emailAddress: '' } }
            };

            await this.dbManager.insertBid(bid);
            res.status(201).json({ message: 'Bid placed successfully' });
        } catch (error) {
            console.error(`Error placing bid: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
