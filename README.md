

# CRM System API

A production-style CRM backend built with ASP.NET Core, demonstrating layered architecture, JWT authentication, and role-based authorization.

Built as a hands-on learning project to go deep on the .NET backend stack — from EF Core migrations to repository pattern, DTOs, and full JWT-based auth — alongside an existing Python/FastAPI background.

---

## Features

- Full CRUD for Customers, Interactions, and Opportunities
- Layered architecture: Repository Pattern + DTOs + Mappers
- JWT-based authentication with role-based authorization (Admin / SalesRep)
- EF Core with SQL Server, code-first migrations
- Swagger / OpenAPI documentation with built-in token testing
- Clean separation between database models and API-facing DTOs (no leaked internal fields, no circular reference issues)

---

## Tech stack

- ASP.NET Core 8 (Web API)
- Entity Framework Core 8
- ASP.NET Core Identity + JWT Bearer authentication
- SQL Server (LocalDB for local development)
- Swagger / Swashbuckle

---

## Architecture

```
Client (Swagger / app)
        |
        v
JWT Authentication  --  validates token, checks role
        |
        v
Controllers  --  Customer, Interaction, Opportunity, Auth
        |
        v
DTOs + Mappers  --  shape data in and out
        |
        v
Repositories  --  query logic per entity
        |
        v
CrmDbContext (EF Core)  --  IdentityDbContext-based
        |
        v
SQL Server (CRMSystemDb)
```

Each layer only talks to the one directly below it — controllers never touch EF Core directly, and repositories never know about DTOs. Mappers are the single bridge between the database models and the API-facing shapes.

---

## Getting started

### Prerequisites

- .NET 8 SDK
- SQL Server or SQL Server LocalDB

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/CRMSystem.API.git
   cd CRMSystem.API
   ```

2. Update the connection string in `appsettings.json` if your SQL Server instance name differs:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=CRMSystemDb;Trusted_Connection=True;MultipleActiveResultSets=true"
   }
   ```

3. Apply migrations to create the database:
   ```bash
   dotnet ef database update
   ```

4. Run the project:
   ```bash
   dotnet run
   ```

5. Open Swagger UI in your browser:
   ```
   https://localhost:{port}/swagger
   ```

---

## Authentication flow

1. `POST /api/auth/register` to create a user (returns a JWT token immediately)
2. `POST /api/auth/login` to authenticate an existing user (returns a fresh JWT token)
3. In Swagger, click the **Authorize** button and enter:
   ```
   Bearer <your-token-here>
   ```
4. All protected endpoints will now work with that token attached

---

## API endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |

### Customers
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/customer` | List all customers | Authenticated |
| GET | `/api/customer/{id}` | Get customer by ID | Authenticated |
| GET | `/api/customer/email/{email}` | Get customer by email | Authenticated |
| GET | `/api/customer/status/{status}` | Filter customers by status | Authenticated |
| GET | `/api/customer/with-history` | Get customers with nested interactions/opportunities | Authenticated |
| POST | `/api/customer` | Create a customer | Authenticated |
| PUT | `/api/customer/{id}` | Update a customer | Authenticated |
| DELETE | `/api/customer/{id}` | Delete a customer | Admin only |

### Interactions
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/interaction` | List all interactions | Authenticated |
| GET | `/api/interaction/{id}` | Get interaction by ID | Authenticated |
| GET | `/api/interaction/customer/{customerId}` | Get interactions for a customer | Authenticated |
| GET | `/api/interaction/pending` | Get pending interactions | Authenticated |
| POST | `/api/interaction` | Create an interaction | Authenticated |
| PUT | `/api/interaction/{id}` | Update an interaction | Authenticated |
| DELETE | `/api/interaction/{id}` | Delete an interaction | Authenticated |

### Opportunities
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/opportunity` | List all opportunities | Authenticated |
| GET | `/api/opportunity/{id}` | Get opportunity by ID | Authenticated |
| GET | `/api/opportunity/customer/{customerId}` | Get opportunities for a customer | Authenticated |
| GET | `/api/opportunity/stage/{stage}` | Filter opportunities by stage | Authenticated |
| POST | `/api/opportunity` | Create an opportunity | Authenticated |
| PUT | `/api/opportunity/{id}` | Update an opportunity | Authenticated |
| DELETE | `/api/opportunity/{id}` | Delete an opportunity | Authenticated |

---

## Project structure

```
CRMSystem.API/
├── Controllers/     -> Customer, Interaction, Opportunity, Auth
├── Models/          -> Customer, Interaction, Opportunity, ApplicationUser
├── Data/            -> CrmDbContext (IdentityDbContext-based)
├── Migrations/      -> EF Core code-first migrations
├── Repositories/     -> Generic + entity-specific repositories
├── DTOs/            -> Create / Response / Standalone / WithHistory shapes
├── Mappers/         -> Manual Entity <-> DTO conversion
└── Program.cs        -> Service registration, middleware pipeline
```

---
## Dashboard :

<img width="1362" height="763" alt="dashboard" src="https://github.com/user-attachments/assets/1b4792cb-b197-41ff-9c96-853ab62516d6" />

## Customers :
<img width="1355" height="768" alt="cust" src="https://github.com/user-attachments/assets/6df0a653-7b68-464a-a08f-93715aa26d5a" />

##Add Customers :
<img width="1361" height="767" alt="afteraddingcust" src="https://github.com/user-attachments/assets/c16384ad-bdba-4a94-a50d-eaa7dc6ed7c5" />

---
## Security notes

- Passwords are hashed via ASP.NET Core Identity's `UserManager` — never stored in plain text
- JWT tokens are signed using HMAC-SHA256
- Endpoint access is enforced with `[Authorize]` and `[Authorize(Roles = "Admin")]`
- DTOs prevent circular reference issues and avoid leaking internal EF Core model details to API consumers
- The connection string and JWT key in `appsettings.json` are local development placeholders — in a production deployment these would be moved to environment variables, User Secrets, or a secrets manager

---

## Possible next steps

- Refresh tokens (current JWT expires after 60 minutes with no renewal)
- Global exception handling middleware for consistent error responses
- Pagination on list endpoints
- Automatic Admin user seeding on first run
- Unit tests for repositories and controllers

---

## Author

Built by Hanzella as a hands-on learning project to build backend/API development skills in ASP.NET Core, alongside existing Python/FastAPI and AI automation work.
