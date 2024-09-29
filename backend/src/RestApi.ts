import express, { Request, Response } from 'express';
import { DatabaseManager } from './DatabaseManager';

export class RestApi {
    private expressApi = express();

    constructor(private dbManager: DatabaseManager) {
    }

    // POST /api/jobs: Create a new job
    public async createJob(req: Request, res: Response) {
    }

    // GET /api/jobs: Get all job postings (with optional filters)
    public async getAllJobs(req: Request, res: Response) {
    }

    // GET /api/jobs/:id: Get details of a specific job
    public async getJobById(req: Request, res: Response) {
    }

    // POST /api/jobs/:id/bids: Place a new bid on a job
    public async placeBid(req: Request, res: Response) {
    }
}

export default RestApi;
