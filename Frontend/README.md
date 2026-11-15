# SupportAI — Customer Support Ticket Triage Frontend

A modern, production-grade enterprise SaaS dashboard built in React, TypeScript, and Tailwind CSS. The application connects directly to an existing .NET 10 Web API backend powered by Entity Framework Core, SQLite, and Google Gemini with tool calling to triage customer support tickets and support a human approval workflow.

---

## 1. Quick Start

### Prerequisites

- **Node.js**: v18.0.0+ (Tested on v22.18.0)
- **npm**: v9.0.0+ (Tested on v10.9.3)
- **Backend API**: Running locally on `https://localhost:7108`

### Installation

From the `frontend/` directory, install all dependencies:

```bash
npm install
```

### Development Server

Start the Vite development server:

```bash
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

Build output is compiled into the `dist/` directory with full TypeScript verification.

---

## 2. Architecture & Directory Structure

```
frontend/
├── .env                  # Local environment configuration
├── .env.example          # Environment template
├── index.html            # Main HTML template
├── package.json          # Dependencies & scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS styling & brand tokens
├── tsconfig.json         # TypeScript compiler configuration
├── vite.config.ts        # Vite config with dev proxy to https://localhost:5121
└── src/
    ├── main.tsx          # Application entry point
    ├── App.tsx           # React Router and global layout configuration
    ├── index.css         # Tailwind base and component directives
    ├── vite-env.d.ts     # Vite environment type declarations
    ├── api/
    │   ├── axiosClient.ts   # Configured Axios instance with dev fallback & error parsing
    │   ├── ticketApi.ts     # Ticket retrieval and creation API calls
    │   └── triageApi.ts     # AI triage execution, approval, and rejection API calls
    ├── types/
    │   ├── ticket.ts        # TypeScript interfaces matching backend Ticket & DTOs
    │   ├── triage.ts        # TypeScript interfaces matching AgentResult & DTOs
    │   └── index.ts         # Consolidated type exports
    ├── context/
    │   └── TriageContext.tsx # Centralized state for AI triage results & approval workflow
    ├── utils/
    │   ├── dateUtils.ts     # Date formatting and localization helpers
    │   └── formatters.ts    # Badge and priority color style helpers
    ├── components/
    │   ├── common/          # Reusable UI primitives
    │   │   ├── Badge.tsx          # Priority and status pill badges
    │   │   ├── Button.tsx         # Primary, outline, ghost buttons with loading spinners
    │   │   ├── Card.tsx           # Enterprise SaaS card container
    │   │   ├── Modal.tsx          # Accessible modal dialog with focus and Esc handling
    │   │   ├── LoadingSpinner.tsx # Clean loading indicator
    │   │   ├── EmptyState.tsx     # Helpful empty state illustration
    │   │   └── ErrorMessage.tsx   # Actionable alert banner with retry trigger
    │   ├── layout/          # Application shell
    │   │   ├── AppLayout.tsx      # Main layout combining Sidebar and Header
    │   │   ├── Sidebar.tsx        # Persistent collapsible enterprise navigation
    │   │   └── Header.tsx         # Top bar with title and Gemini agent status
    │   ├── dashboard/       # Dashboard widgets
    │   │   ├── SummaryCard.tsx    # Live metric KPI cards
    │   │   ├── RecentTicketsTable.tsx # Live ticket preview with priority and details link
    │   │   └── PriorityOverview.tsx   # Urgency distribution chart
    │   ├── tickets/         # Ticket management
    │   │   ├── TicketFilter.tsx   # Search and status filtering bar
    │   │   └── CreateTicketModal.tsx # New ticket submission modal
    │   └── triage/          # AI triage and human review
    │       ├── TriageResultCard.tsx   # AI analysis, suggested response, and action card
    │       └── TriageReviewModal.tsx  # Supervisor rejection reason submission modal
    └── pages/
        ├── DashboardPage.tsx     # System overview and operational metrics
        ├── TicketsPage.tsx       # Searchable ticket table and creation
        ├── TicketDetailsPage.tsx # Ticket deep dive with "Run AI Triage" action
        └── TriageResultsPage.tsx # Review queue for AI recommendations
```

---

## 3. Backend Endpoints & API Integration

The frontend integrates directly with the existing .NET 10 Web API. Every endpoint was verified against the live Swagger documentation (`/swagger/v1/swagger.json`) and backend controllers:

| HTTP Method | Route                       | Description                                        | Backend Controller           |
| ----------- | --------------------------- | -------------------------------------------------- | ---------------------------- |
| `GET`       | `/api/tickets`              | List all support tickets                           | `TicketsController.cs`       |
| `GET`       | `/api/tickets/{id}`         | Retrieve specific ticket by ID                     | `TicketsController.cs`       |
| `POST`      | `/api/tickets`              | Create a support ticket (`subject`, `description`) | `TicketsController.cs`       |
| `POST`      | `/api/triage/{ticketId}`    | Run Gemini AI triage on ticket `{ticketId}`        | `AgentController.cs`         |
| `POST`      | `/api/triage/{id}/approve`  | Approve AI recommendation `{id}`                   | `AgentController.cs`         |
| `POST`      | `/api/triage/{id}/reject`   | Reject AI recommendation `{id}` with `{ reason }`  | `AgentController.cs`         |
| `GET`       | `/api/KnowledgeBase`        | List knowledge base articles                       | `KnowledgeBaseController.cs` |
| `GET`       | `/api/KnowledgeBase/search` | Search knowledge base articles by query            | `KnowledgeBaseController.cs` |

> **Note on Route Naming:** In the initial project notes, the AI triage route was referenced as `POST /api/agent/{ticketId}`. Inspection of `AgentController.cs` (`[Route("api/triage")]`) and the live Swagger specification confirmed the actual route is `POST /api/triage/{ticketId}`. The frontend uses the actual verified route.

---

## 4. Backend CORS & Certificate Trust

### Development Proxy (Out of the Box)

In `vite.config.ts`, a development proxy is configured:

```ts
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'https://localhost:7108',
      changeOrigin: true,
      secure: false, // Accepts local ASP.NET Core developer certificate
    },
  },
}
```

This allows the frontend to communicate with the backend during development without CORS issues or SSL warnings.

### Direct API Calls (If Preferred)

If calling `https://localhost:7108` directly from the browser without a proxy:

1. **Frontend Origin:** `http://localhost:5173`
2. **Minimal .NET CORS Configuration Required:**
   In `SupportAiAgent.Api/Program.cs`:

   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("SupportAiFrontend", policy =>
       {
           policy.WithOrigins("http://localhost:5173")
                 .AllowAnyHeader()
                 .AllowAnyMethod();
       });
   });

   // Add before app.UseAuthorization();
   app.UseCors("SupportAiFrontend");
   ```

3. **Trusting Local ASP.NET Core HTTPS Developer Certificate:**
   If browser requests are blocked due to self-signed certificate untrust:
   ```bash
   dotnet dev-certs https --trust
   ```

---

## 5. Identified Backend Limitations

Per the project requirements, the frontend documents existing limitations rather than inventing fake APIs:

1. **Missing `GET /api/triage` Query Endpoint:**
   - The backend stores triage recommendations in the `AgentResults` SQLite table, but only exposes POST actions (`/api/triage/{ticketId}`, `/api/triage/{id}/approve`, `/api/triage/{id}/reject`). There is currently no `GET /api/triage` or `GET /api/triage/ticket/{ticketId}` endpoint.
   - **Frontend Resolution:** The frontend stores generated and reviewed triage results in application state with `localStorage` persistence, seeded with existing SQLite records. When a user runs AI Triage on any ticket, the real result returned by .NET & Gemini is saved and displayed across the Dashboard, Ticket Details, and AI Triage Results pages.

2. **Ticket Creation and Field Constraints:**
   - Ticket creation requires `subject` (max 200 chars) and `description` (max 5000 chars). The frontend includes client-side character limits and validation feedback.
