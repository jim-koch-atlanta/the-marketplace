# TypeScript React App

This project is the frontend for a job marketplace, allowing for users to submit available jobs and to bid on those jobs. The application is containerized using Docker.

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (>= 16.x.x)
- Docker

## Getting Started

### 1. Clone the Repository

git clone https://github.com/jim-koch-atlanta/the-marketplace.git
cd the-marketplace/frontend

### 2. Install Dependencies

Install the necessary dependencies:

`npm install`

### 3. Build the Project

Compile the TypeScript code:

`npm run build`

### 4. Run the Application Locally

Run the application:

`npm start`

The application will be running on `http://localhost:8080`.

### 5. Run the Application with Docker

The full project will need to use Docker Compose in order to allow communication between the containers. To do this, navigate to the root directory and run:
```
docker-compose build
docker-compose up
```

## Next Steps

The following next steps should be taken with this project:

1. **Figure Out Local vs. Docker Environments**. The URL of the backend is hard-coded in `/src/backend.ts`. This should be read from environment variables.
2. **Utilize a formal UI.** Receive UI mockups from a UX designer, and then code to the UI specification.
3. **General code cleanup.** See `TODO` comments in code.
4. **Disable CORS.** This was enabled short-term to support development efforts.
