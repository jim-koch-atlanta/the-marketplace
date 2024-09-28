# Express TypeScript SQLite Docker App

This project is a simple Express.js API built with TypeScript that connects to a local SQLite database. The application is containerized using Docker.

## Prerequisites

Ensure you have the following installed on your machine:
- Node.js (>= 16.x.x)
- Docker

## Getting Started

### 1. Clone the Repository

git clone https://github.com/your-repo/express-ts-sqlite-docker.git
cd express-ts-sqlite-docker

### 2. Install Dependencies

Install the necessary dependencies:

`npm install`

### 3. Build the Project

Compile the TypeScript code:

`npm run build`

### 4. Run the Application Locally

Run the application:

`npm start`

The application will be running on `http://localhost:3001`.

### 5. Run the Application with Docker

**Build the Docker Image**

Build the Docker image:

`docker build -t marketplace-takehome .`

**Run the Docker Container**

Run the Docker container:

`docker run -p 3001:3001 marketplace-takehome`

The application will be running on `http://localhost:3001`.

## API Endpoints

### Get Users

- URL: `/users`
- Method: GET
- Response: List of users

### Add User

- URL: `/users`
- Method: POST
- Body:
  `{
  "id": number,
  "name": string
  }`
- Response: `{"message": "User added"}`

### Delete User

- URL: `/users/:id`
- Method: DELETE
- Response: `{"message": "User deleted"}`

## Example Usage

### Get Users

`curl http://localhost:3001/users`

### Add User

`curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "name": "Jane Doe"}' http://localhost:3001/users`

### Delete User

`curl -X DELETE http://localhost:3001/users/2`

## License

This project is licensed under the MIT License.
