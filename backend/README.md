# Express TypeScript SQLite Docker App

This project is a the backend for a job marketplace, allowing for users to submit available jobs and to bid on those jobs. It is simple Express.js API built with TypeScript that connects to a local SQLite database. The application is containerized using Docker.

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (>= 16.x.x)
- Docker

## Getting Started

### 1. Clone the Repository

git clone https://github.com/jim-koch-atlanta/the-marketplace.git
cd the-marketplace/backend

### 2. Install Dependencies

Install the necessary dependencies:

`npm install`

### 3. Build the Project

Compile the TypeScript code:

`npm run build`

### 4. Run the Application Locally

Run the application:

`npm start`

The application will be running on `http://localhost:3000`.

### 5. Run the Application with Docker

**Build the Docker Image**

Build the Docker image:

`docker build -t the-marketplace-backend .`

**Run the Docker Container**

Run the Docker container:

`docker run -p 3000:3000 the-marketplace-backend`

The application will be running on `http://localhost:3000`.

## API Endpoints

See [backend.yaml](./backend.yaml) for the OpenAPI specification of this service.

## Next Steps

The following next steps should be taken with this project:

1. **General code cleanup.** See `TODO` comments in code.
2. **Idempotence of API endpoints.** The `POST` commands will likely fail on a second attempt.
3. **Switch from direct SQLite to ORM.** For scalability, the DatabaseManager code should utilize an ORM to allow for other database engines like Postgres. This would allow for replication and failover.

## License

This project is licensed under the MIT License.
