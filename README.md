# Distributed Rate Limiter

## Overview
This project implements a **high-performance distributed rate limiter** using **TypeScript, Express, Redis, and PostgreSQL**. It follows the **Sliding Window Algorithm** to ensure accurate request limiting and supports API key-based access control with dynamic quotas.

## Features
- **Sliding Window Rate Limiting**: Provides a more accurate request limiting mechanism than fixed windows.
- **API Key Management**: Supports Free and Premium users with different request quotas.
- **Redis for Low-Latency Access**: Stores request timestamps for quick rate-limit checks.
- **PostgreSQL & Prisma for API Key Management**: Securely stores and retrieves API keys with Prisma ORM.
- **Scalable and Modular**: Clean architecture for easy expansion and maintenance.

## Tech Stack
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Caching & Rate Limiting**: Redis

## Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=22.11.0)
- **PostgreSQL(>=16)**
- **Redis**

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/negativeInteger/gadgetapi.git
   cd rate-limiter-service
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ratelimiter"
   REDIS_URL="redis://localhost:6379"
   ```
4. Apply database migrations:
   ```sh
   npx prisma migrate dev
   ```
5. Start the server:
   ```sh
   npm run server
   ```

## API Endpoints
### 1. **Generate API Key**
- **Endpoint**: `POST /api/keys`
- **Description**: Generates an API key for a user.
- **Payload:**
  ```json
  {
    "owner": "username",
    "plan": "FREE" | "PREMIUM"
  }
  ```
- **Response:**
  ```json
  {
    "id": "uuid",
    "key": "64-char-api-key",
    "owner": "someone",
    "plan": "FREE",
    "rateLimit": 100,
    "createdAt": "2025-03-11T19:07:48.539Z"
  }
  ```

### 2. **Fetch All API Keys**
- **Endpoint**: `GET /api/keys`
- **Description**: Retrieves all API keys.
- **Response:**
  ```json
  [{
    "id": "uuid",
    "key": "64-char-api-key",
    "owner": "someone",
    "plan": "FREE",
    "rateLimit": 100,
    "createdAt": "2025-03-11T19:07:48.539Z"
  },
  {
    "id": "uuid",
    "key": "64-char-api-key",
    "owner": "other",
    "plan": "PREMIUM",
    "rateLimit": 1000,
    "createdAt": "2025-03-11T19:08:30.237Z"
  }]
  ```
### 3. **Delete API Key**
- **Endpoint**: `DELETE /api/keys/:id`
- **Description**: Deletes an API key by ID.
- **Response:**
  ```json
  {
    "message": "API Key deleted"
  }
  ```
### 4. **Rate-Limited Protected Route**
- **Endpoint**: `GET /api/protected`
- **Headers**:
  ```json
  {
    "x-api-key": "your-api-key"
  }
  ```
- **Response (Success)**:
  ```json
  {
    "message": "Request Successful"
  }
  ```
- **Response (Rate Limit Exceeded)**:
  ```json
  {
    "error": "Rate limit exceeded. Try again later"
  }
  ```

## How It Works
1. The API key is validated against PostgreSQL.
2. The Redis key `ratelimit:<apiKey>` is used to track request timestamps.
3. Older timestamps (beyond 60s) are removed.
4. If requests in the last 60s exceed the limit, the request is blocked.
5. If under the limit, the request is recorded and allowed.


