import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Bid, Job, User }  from './types';

export class DatabaseManager {
    private db!: Database;

    constructor(private dbFilePath: string) { }

    public async initialize() {
        // Open or create the SQLite database file
        this.db = await open({
            filename: this.dbFilePath,
            driver: sqlite3.Database
        });

        // Check version and create tables if necessary
        const version = await this.checkVersion();
        if (version === 0) {
            console.log(`Creating database v1.`);
            await this.createTablesV1();
        }
    }

    // Getter for the db connection (only for testing purposes)
    public getDatabase(): Database {
        return this.db;
    }

    private async checkVersion(): Promise<number> {
        // Create version table if it doesn't exist
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS version (
                version INTEGER NOT NULL
            );
        `);

        const row = await this.db.get("SELECT version FROM version");

        if (!row) {
            console.log("Version value not found, returning 0.");
            return 0;
        } else {
            console.log(`Database version: ${row.version}`);
            return row.version;
        }
    }

    private async createTablesV1() {
        try {
            // Start the transaction
            await this.db.exec('BEGIN');
    
            // Create the necessary tables
            await this.db.exec(`
                CREATE TABLE users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    emailAddress TEXT NOT NULL,
                    phoneNumber TEXT
                );
                CREATE TABLE jobs (
                    id TEXT PRIMARY KEY,
                    description TEXT NOT NULL,
                    requirements TEXT NOT NULL,
                    posterId TEXT NOT NULL,
                    creationDate TEXT NOT NULL,
                    auctionStartDate TEXT NOT NULL,
                    auctionEndDate TEXT NOT NULL,
                    FOREIGN KEY (posterId) REFERENCES users(id)
                );
                CREATE TABLE bids (
                    id TEXT PRIMARY KEY,
                    jobId TEXT NOT NULL,
                    amount TEXT NOT NULL,
                    bidderId TEXT NOT NULL,
                    FOREIGN KEY (jobId) REFERENCES jobs(id),
                    FOREIGN KEY (bidderId) REFERENCES users(id)
                );
            `);
    
            // Insert the initial version value
            await this.db.run("INSERT INTO version (version) VALUES (1)");
    
            // Commit the transaction if all queries are successful
            await this.db.exec('COMMIT');
            console.log("Tables created successfully and version set to 1.");
        } catch (err) {
            // Rollback the transaction if any query fails
            await this.db.exec('ROLLBACK');
            console.error(`Error creating tables, transaction rolled back: ${JSON.stringify(err)}`);
        }
    }

    public async insertUser(user: User) {
        const { id, name, contactInfo } = user;
        const { emailAddress, phoneNumber } = contactInfo;

        await this.db.run(`
            INSERT INTO users (id, name, emailAddress, phoneNumber)
            VALUES (?, ?, ?, ?)
        `, [id, name, emailAddress, phoneNumber]);

        console.log("User inserted successfully.");
    }

    public async insertJob(job: Job) {
        const { id, description, requirements, poster, auctionStartDate, auctionEndDate } = job;

        await this.db.run(`
            INSERT INTO jobs (id, description, requirements, posterId, creationDate, auctionStartDate, auctionEndDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            id,
            description,
            JSON.stringify(requirements), // Store as a JSON array
            poster.id,
            new Date().toISOString(),
            auctionStartDate.toISOString(),
            auctionEndDate.toISOString(),
        ]);

        console.log("Job inserted successfully.");
    }

    public async insertBid(bid: Bid) {
        const { id, jobId, amount, bidder } = bid;

        await this.db.run(`
            INSERT INTO bids (id, jobId, amount, bidderId)
            VALUES (?, ?, ?, ?)
        `, [id, jobId, amount, bidder.id]);

        console.log("Job bid inserted successfully.");
    }

    private static rowsToJobs(rows: any[]): Job[] {
        // Map the rows to Job objects
        const jobs: Job[] = rows.map((row) => {
            return {
                id: row.jobId,
                description: row.description,
                requirements: JSON.parse(row.requirements), // Convert JSON string to array
                poster: {
                    id: row.posterId,
                    name: row.posterName,
                    contactInfo: {
                        id: row.posterId,
                        name: row.posterName,
                        emailAddress: row.posterEmailAddress,
                        phoneNumber: row.posterPhoneNumber || undefined, // Handle optional phoneNumber
                    },
                },
                auctionStartDate: new Date(row.auctionStartDate),
                auctionEndDate: new Date(row.auctionEndDate),
            };
        });

        return jobs;
    }

    public async getJobs(): Promise<Job[]> {
        const sql = `
            SELECT
                jobs.id as jobId,
                jobs.description as description,
                jobs.requirements as requirements,
                jobs.creationDate as creationDate,
                jobs.auctionStartDate as auctionStartDate,
                jobs.auctionEndDate as auctionEndDate,
                users.id as posterId,
                users.name as posterName,
                users.emailAddress as posterEmailAddress,
                users.phoneNumber as posterPhoneNumber
            FROM jobs
            JOIN users ON jobs.posterId = users.id;
        `;
    
        try {
            const rows = await this.db.all(sql);
    
            // Map the rows to Job objects
            const jobs: Job[] = DatabaseManager.rowsToJobs(rows);
            return jobs;

        } catch (err) {
            console.error(`Error retrieving jobs: ${JSON.stringify(err)}`);
            throw err; // Re-throw the error to handle it in the calling function
        }
    }

    public async getJobsById(jobId: string): Promise<Job[]> {
        const sql = `
            SELECT
                jobs.id as jobId,
                jobs.description as description,
                jobs.requirements as requirements,
                jobs.creationDate as creationDate,
                jobs.auctionStartDate as auctionStartDate,
                jobs.auctionEndDate as auctionEndDate,
                users.id as posterId,
                users.name as posterName,
                users.emailAddress as posterEmailAddress,
                users.phoneNumber as posterPhoneNumber
            FROM jobs
            JOIN users ON jobs.posterId = users.id
            WHERE jobs.id = ?;
        `;
    
        try {
            const rows = await this.db.all(sql, [jobId]);
    
            // Map the rows to Job objects
            const jobs: Job[] = DatabaseManager.rowsToJobs(rows);
            return jobs;
        } catch (err) {
            console.error(`Error retrieving jobs by ID: ${JSON.stringify(err)}`);
            throw err; // Re-throw the error to handle it in the calling function
        }
    }
        
    public async getJobById(jobId: string): Promise<Job | null> {
        const jobs = await this.getJobsById(jobId);
    
        if (jobs.length > 0) {
            return jobs[0]; // Return the first job if any jobs are found
        }
    
        return null; // Return null if no jobs are found
    }

    public async getMostRecentJobs(numberOfJobs: number): Promise<Job[]> {
        const sql = `
            SELECT
                jobs.id as jobId,
                jobs.description as description,
                jobs.requirements as requirements,
                jobs.creationDate as creationDate,
                jobs.auctionStartDate as auctionStartDate,
                jobs.auctionEndDate as auctionEndDate,
                users.id as posterId,
                users.name as posterName,
                users.emailAddress as posterEmailAddress,
                users.phoneNumber as posterPhoneNumber
            FROM jobs
            JOIN users ON jobs.posterId = users.id
            ORDER BY jobs.creationDate DESC
            LIMIT ?;
        `;
    
        try {
            const rows = await this.db.all(sql, [numberOfJobs]);
    
            // Map the rows to Job objects
            const jobs: Job[] = DatabaseManager.rowsToJobs(rows);
            return jobs;
        } catch (err) {
            console.error(`Error retrieving most recent jobs: ${JSON.stringify(err)}`);
            throw err; // Re-throw the error to handle it in the calling function
        }
    }

    public async getMostActiveJobs(numberOfJobs: number): Promise<Job[]> {
        const sql = `
            SELECT
                jobs.id as jobId,
                jobs.description as description,
                jobs.requirements as requirements,
                jobs.creationDate as creationDate,
                jobs.auctionStartDate as auctionStartDate,
                jobs.auctionEndDate as auctionEndDate,
                users.id as posterId,
                users.name as posterName,
                users.emailAddress as posterEmailAddress,
                users.phoneNumber as posterPhoneNumber,
                COUNT(bids.id) as bidCount
            FROM jobs
            JOIN users ON jobs.posterId = users.id
            LEFT JOIN bids ON jobs.id = bids.jobId
            GROUP BY jobs.id, jobs.description, jobs.requirements, jobs.creationDate, jobs.auctionStartDate, jobs.auctionEndDate, users.id, users.name, users.emailAddress, users.phoneNumber
            ORDER BY bidCount DESC
            LIMIT ?;
        `;
    
        try {
            const rows = await this.db.all(sql, [numberOfJobs]);
    
            // Map the rows to Job objects
            const jobs: Job[] = DatabaseManager.rowsToJobs(rows);
            return jobs;
        } catch (err) {
            console.error(`Error retrieving most active jobs: ${JSON.stringify(err)}`);
            throw err; // Re-throw the error to handle it in the calling function
        }
    }
}
