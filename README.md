# AI-Powered Support Ticket Triage System

An AI-powered customer support ticket management and triage application built with **ASP.NET Core Web API, React, TypeScript, and Google Gemini**.

The application allows support teams to manage customer support tickets and use AI to generate ticket classifications, priority assessments, suggested responses, and recommended actions.

It incorporates an agent-based workflow that can retrieve ticket details and search a knowledge base to provide context-aware triage recommendations. AI-generated recommendations are stored for human review, with support for approval and rejection workflows.

## Project Status

**Version 1.0 – Initial Release**

This is an ongoing personal development project intended to demonstrate full-stack software engineering and AI integration.

The current version implements the core ticket management and AI-powered triage workflow, including frontend integration and human review capabilities.

Further testing, security enhancements, bug fixes, performance improvements, and additional functionality are planned for future releases.

## Features

### Support Ticket Management

- Create and manage support tickets.
- View ticket summaries and details.
- Search and filter support tickets.
- Monitor ticket information through a dashboard.

### AI-Powered Ticket Triage

- Analyze customer support tickets using Google Gemini.
- Automatically categorize incoming support requests.
- Generate priority assessments.
- Produce suggested customer responses.
- Recommend appropriate support actions.

### Agent-Based Workflow

- Integrate AI function calling with application-side tools.
- Retrieve relevant ticket details when required.
- Search a knowledge base for relevant support information.
- Use retrieved information to support AI-generated recommendations.

### Human-in-the-Loop Review

- Store AI-generated triage recommendations.
- Support approval and rejection of recommendations.
- Require human review before treating AI recommendations as approved actions.

## Technology Stack

| Area                   | Technologies                                        |
| ---------------------- | --------------------------------------------------- |
| Frontend               | React 18, TypeScript, Vite, Tailwind CSS            |
| UI and API Integration | Axios                                               |
| Backend                | ASP.NET Core Web API, .NET 10                       |
| Architecture           | Layered application structure, Dependency Injection |
| Data Access            | Entity Framework Core                               |
| Database               | SQLite                                              |
| AI Integration         | Google Gemini API                                   |
| API Documentation      | Swagger / OpenAPI                                   |
| Version Control        | Git and GitHub                                      |

## Architecture Overview

The application separates the frontend, backend API, application services, data access, and AI integration responsibilities.

```text
                 React Frontend
                       |
                       | HTTP / REST API
                       |
              ASP.NET Core Web API
                       |
              Application Services
                       |
          +------------+------------+
          |                         |
     Ticket Services           Triage Services
          |                         |
          |                 AI Agent Workflow
          |                         |
          |                +--------+--------+
          |                |                 |
          |           Gemini API       Agent Tools
          |                                  |
          |                          +-------+-------+
          |                          |               |
          |                    Ticket Details   Knowledge Base
          |                       Retrieval        Search
          |                                  |
          +----------------+-----------------+
                           |
                    Entity Framework Core
                           |
                         SQLite
```

AI-generated recommendations are returned to the application and stored for subsequent human review.

## Prerequisites

Install the following before running the application:

- .NET 10 SDK
- Node.js 18 or later
- npm
- Google Gemini API key
- Git

## Getting Started

Clone the repository:

```bash
git clone https://github.com/PubuduBandara-Dev/Ai-Ticket-Support-Agent.git
cd ai-support-ticket-triage
```

The backend and frontend should be started separately during local development.

### 1. Configure the Gemini API Key

The backend uses .NET User Secrets to store the Gemini API key during local development.

Run:

```bash
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GEMINI_API_KEY" --project Backend/SupportAiAgent.Api/SupportAiAgent.Api.csproj
```

Replace `YOUR_GEMINI_API_KEY` with your own API key.

**Security note:** Never commit API keys, passwords, or other sensitive configuration values to source control.

### 2. Start the Backend

From the repository root:

```bash
dotnet restore Backend/SupportAiAgent.Api/SupportAiAgent.Api.csproj
```

Run the API:

```bash
dotnet run --project Backend/SupportAiAgent.Api/SupportAiAgent.Api.csproj --launch-profile http
```

The API is expected to run at:

```text
http://localhost:5121
```

Swagger UI (during development):

```text
http://localhost:5121/swagger
```

Check the actual launch profile configuration if your local port differs.

### 3. Start the Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:5173
```

The Vite development proxy forwards API requests to the local backend.

### 4. Build the Frontend

To verify the frontend production build:

```bash
cd Frontend
npm run build
```

## Configuration

### Backend Configuration

The backend reads Gemini configuration through .NET configuration providers.

| Configuration   | Description             |
| --------------- | ----------------------- |
| `Gemini:ApiKey` | Google Gemini API key   |
| `Gemini:Model`  | Gemini model identifier |

Use .NET User Secrets for local development and environment variables or an appropriate secrets manager for deployment.

### Frontend Configuration

The frontend uses the Vite development proxy by default.

An optional `Frontend/.env.example` file documents the `VITE_API_BASE_URL` setting.

Keep environment-specific values outside committed source files. Never expose private API keys or backend credentials through frontend environment variables.

## Project Structure

```text
.
├── Backend/
│   └── SupportAiAgent.Api/
│       ├── Controllers/
│       ├── Application/
│       │   ├── Abstractions/
│       │   └── DTOs/
│       ├── Services/
│       ├── Models/
│       ├── Data/
│       ├── Plugins/
│       └── SupportAiAgent.Api.csproj
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.ts
│
├── SupportAiAgent.slnx
├── README.md
└── .gitignore
```

## API Overview

The following endpoints are implemented in the ticket and triage controllers.

### Ticket Management

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/tickets`      | Retrieve support tickets |
| GET    | `/api/tickets/{id}` | Retrieve a ticket by ID  |
| POST   | `/api/tickets`      | Create a support ticket  |

### AI Triage and Review

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/triage/{ticketId}`   | Run AI triage for a ticket      |
| POST   | `/api/triage/{id}/approve` | Approve a triage recommendation |
| POST   | `/api/triage/{id}/reject`  | Reject a triage recommendation  |

For request and response details, refer to the Swagger/OpenAPI documentation available when running the backend in development mode.

## Current Limitations and Future Improvements

The current release focuses on demonstrating the core application workflow. Some areas are planned for further development:

- Add an API endpoint to retrieve previously generated triage results.
- Improve persistence and synchronization of triage results across browsers and devices.
- Expand automated unit and integration test coverage.
- Improve validation and handling of unexpected AI responses.
- Enhance AI agent reliability and tool execution verification.
- Introduce additional security and performance improvements.
- Explore cloud deployment and scalable hosting options.

## Screenshots

Application screenshots will be added as the project documentation is finalized.

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── tickets.png
    ├── ticket-details.png
    └── ai-triage-results.png
```

## Disclaimer

This project is developed for personal learning, experimentation, and portfolio demonstration purposes.

AI-generated classifications, recommendations, and responses are suggestions and should be reviewed by a human before being used in real customer support operations.
