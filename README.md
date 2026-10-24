# ProjectHub — Backend API

A RESTful backend for a student project submission and mentor review portal, built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## Overview

The ProjectHub backend manages user authentication, role-based authorization, student project submissions, and mentor reviews.

Students can register, authenticate, and submit project details. Mentors can retrieve submissions, filter them by status on the frontend, and approve or reject submissions with optional feedback.

The backend exposes REST API endpoints consumed by a separately maintained Next.js frontend.

## Features

- Student registration and authentication
- Password hashing with bcryptjs
- JWT-based authentication
- HTTP-only authentication cookie
- Bearer token authentication fallback
- Role-based access control for students and mentors
- Input validation using Zod
- PostgreSQL database integration
- Prisma ORM with PostgreSQL adapter
- One project submission per student
- Submission status management
- Mentor review decisions and feedback
- Review timestamps and reviewer tracking
- Security middleware using Helmet
- CORS configuration
- Rate limiting

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT)
- **Password hashing:** bcryptjs
- **Security:** Helmet, CORS, express-rate-limit
- **Environment configuration:** dotenv

## Architecture

The backend is maintained independently from the frontend.

```text
Next.js Frontend
       |
       | HTTP / REST API
       v
Express.js API
       |
       ├── Authentication & Authorization
       ├── Input Validation
       ├── Student Submissions
       └── Mentor Reviews
                |
                v
         Prisma ORM / Adapter
                |
                v
           PostgreSQL
```

## Project Structure

```text
ph-web-instructor-backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── prisma.config.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── ...
├── .env
├── .gitignore
├── package.json
└── README.md
```

The exact source directory structure may vary with the implementation. Keep this tree aligned with the actual repository.

## Prerequisites

- Node.js 24 or a compatible supported version
- npm
- PostgreSQL
- A database and database user with appropriate permissions

## Environment Variables

Create a `.env` file in the backend project root.

```env
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5432/DB_NAME?schema=public"

JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"

SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-with-a-strong-admin-password"

SEED_MENTOR_EMAIL="mentor@example.com"
SEED_MENTOR_PASSWORD="replace-with-a-strong-mentor-password"
```

### Variable Reference

| Variable               | Required                                             | Description                                              |
| ---------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| `DATABASE_URL`         | Yes                                                  | PostgreSQL connection string used by Prisma              |
| `JWT_SECRET`           | Yes                                                  | Secret used to sign and verify JWT authentication tokens |
| `JWT_EXPIRES_IN`       | Yes, if required by the authentication configuration | JWT expiration duration. For example, `1d` means one day |
| `SEED_ADMIN_EMAIL`     | For seeding                                          | Email address of the initial administrator account       |
| `SEED_ADMIN_PASSWORD`  | For seeding                                          | Password for the initial administrator account           |
| `SEED_MENTOR_EMAIL`    | For seeding                                          | Email address of the initial mentor account              |
| `SEED_MENTOR_PASSWORD` | For seeding                                          | Password for the initial mentor account                  |

### Configuration Notes

- Replace the database connection placeholders with your PostgreSQL credentials and database name.
- Generate a strong, random value for `JWT_SECRET`.
- Use strong, unique passwords for the seeded administrator and mentor accounts.
- Keep all seed credentials private. Never commit the actual `.env` file to version control.
- Add only placeholder values to `.env.example`.
- The environment variable names must match those used in the backend's authentication and seed implementation.

## Installation

Navigate to the backend project:

```bash
cd ph-web-instructor-backend
npm install
```

Create the `.env` file and configure the database connection.

## Database Setup

Ensure PostgreSQL is running and the target database exists.

Apply Prisma migrations:

```bash
npx prisma migrate dev
```

If the project has a configured seed script for the initial mentor and administrator accounts, run the seed command configured for the project. For a standard Prisma seed setup, this is commonly:

```bash
npx prisma db seed
```

Use the command supported by your installed Prisma configuration. Do not commit or publish seeded account passwords.

## Database Migration and Seeding

ProjectHub uses PostgreSQL with Prisma ORM.

### Step 1: Configure the Database

Ensure PostgreSQL is running and create the database configured in `DATABASE_URL`.

Create the backend `.env` file and provide the required database and authentication variables.

### Step 2: Apply Database Migrations

Run the following command from the backend project root:

```bash
npx prisma migrate dev
```

This applies the project's Prisma migrations and synchronizes the database schema in development.

### Step 3: Configure Seed Credentials

Set the following variables in `.env` before running the seed process:

```env
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_PASSWORD="replace-with-a-strong-admin-password"

SEED_MENTOR_EMAIL="mentor@example.com"
SEED_MENTOR_PASSWORD="replace-with-a-strong-mentor-password"
```

The seed script uses these values to create the initial administrator and mentor accounts.

### Step 4: Run the Seed Script

If the seed command is configured in `prisma.config.ts` or `package.json`, execute the configured command.

For a standard Prisma seed configuration, the command is:

```bash
npx prisma db seed
```

The seed process should create the initial accounts with the appropriate roles:

- **Admin:** `ADMIN`
- **Mentor:** `MENTOR`

Passwords should be hashed before storage. The seed script should not store plaintext passwords in the database.

### Step 5: Verify the Seeded Accounts

After seeding completes:

1. Check the command output for errors.
2. Verify that the administrator and mentor records exist in the database.
3. Sign in using the configured credentials to confirm that authentication works.
4. Confirm that the mentor can access the Mentor Dashboard and that role-based authorization works as expected.

### Important Notes

- Run migrations before seeding.
- Do not share or commit the actual seed passwords.
- Before rerunning the seed command, confirm whether the seed implementation is idempotent and how it handles existing email addresses.
- For production deployments, use the project's production migration procedure and a controlled seeding process. Do not use development migrations against a production database.
- If the seed command is not configured, configure the seed entry point first according to the project's existing Prisma setup.

## Running the API

Start the development server:

```bash
npm run dev
```

The local API base URL is:

`http://localhost:5000/api`

Use the port configured by the backend if it differs from `5000`.

### Available Scripts

| Command             | Purpose                        |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the development server   |
| `npm run typecheck` | Check TypeScript types         |
| `npm run build`     | Compile the backend            |
| `npm run start`     | Start the compiled application |

## API Reference

Base URL for local development:

`http://localhost:5000/api`

All protected endpoints require a valid authentication session. The API uses an HTTP-only `accessToken` cookie, with Bearer token support where configured.

### 1. Authentication APIs

#### Register a Student

`POST /api/auth/signup`

Creates a student account.

Example request:

```json
{
	"name": "Student Name",
	"email": "student@example.com",
	"password": "your-secure-password",
	"confirmPassword": "your-secure-password"
}
```

The password confirmation field must satisfy the backend validation rules.

#### Sign In

`POST /api/auth/login`

Authenticates an existing user.

Example request:

```json
{
	"email": "student@example.com",
	"password": "your-secure-password"
}
```

On successful authentication, the backend establishes the configured authentication session.

#### Sign Out

`POST /api/auth/logout`

Logs out the current user and clears the authentication cookie according to the server's cookie configuration.

#### Get Current User

`GET /api/auth/me`

Returns information about the authenticated user.

### 2. Student Submission APIs

These endpoints are intended for authenticated students.

#### Create a Submission

`POST /api/submissions`

Creates a project submission for the authenticated student.

Example request:

```json
{
	"projectName": "Portfolio Website",
	"repoUrl": "https://github.com/example/portfolio",
	"liveLink": "https://portfolio.example.com",
	"description": "A portfolio website built with modern web technologies."
}
```

A new submission starts with the `PENDING` status. The current data model permits one submission per student.

#### Get My Submission

`GET /api/submissions`

Returns the authenticated student's submission.

Example response shape:

```json
{
	"submission": {
		"id": "submission-uuid",
		"projectName": "Portfolio Website",
		"repoUrl": "https://github.com/example/portfolio",
		"liveLink": "https://portfolio.example.com",
		"description": "A portfolio website built with modern web technologies.",
		"status": "PENDING",
		"submittedAt": "2026-01-01T10:00:00.000Z",
		"reviewedAt": null,
		"reviewNotes": null,
		"reviewer": null
	}
}
```

The `submission` field can be `null` when the student has not submitted a project. The values above are illustrative.

### 3. Mentor Review APIs

These endpoints require an authenticated mentor account.

#### Get Review Statistics

`GET /api/mentor/reviews/stats`

Retrieves submission review statistics for the mentor dashboard.

#### List Submissions

`GET /api/mentor/reviews`

Retrieves student submissions for review, ordered by submission time according to the current implementation.

Example response shape:

```json
{
	"count": 1,
	"submissions": [
		{
			"id": "submission-uuid",
			"projectName": "Portfolio Website",
			"repoUrl": "https://github.com/example/portfolio",
			"liveLink": "https://portfolio.example.com",
			"description": "A portfolio website.",
			"status": "PENDING",
			"submittedAt": "2026-01-01T10:00:00.000Z",
			"user": {
				"id": "student-uuid",
				"name": "Student Name",
				"email": "student@example.com"
			},
			"reviewer": null
		}
	]
}
```

The response is illustrative; actual returned fields depend on the API implementation.

#### Review a Submission

`PATCH /api/mentor/reviews/:id`

Approves or rejects a pending submission.

Example request:

```json
{
	"status": "APPROVED",
	"reviewNotes": "Good work. The project is well structured."
}
```

To reject a submission, set the status to `REJECTED`.

The `reviewNotes` field is optional and may be omitted. Review decisions are restricted to `APPROVED` or `REJECTED`, and only pending submissions can be reviewed.

The backend records review information, including the reviewer and review timestamp.

## API Summary

| Method  | Endpoint                    | Access        |
| ------- | --------------------------- | ------------- |
| `POST`  | `/api/auth/signup`          | Public        |
| `POST`  | `/api/auth/login`           | Public        |
| `POST`  | `/api/auth/logout`          | Authenticated |
| `GET`   | `/api/auth/me`              | Authenticated |
| `POST`  | `/api/submissions`          | Student       |
| `GET`   | `/api/submissions`          | Student       |
| `GET`   | `/api/mentor/reviews/stats` | Mentor        |
| `GET`   | `/api/mentor/reviews`       | Mentor        |
| `PATCH` | `/api/mentor/reviews/:id`   | Mentor        |

## Data Model

The application includes two primary models.

### User

Stores user identity, email, password hash, role, and timestamps.

Supported roles:

- `STUDENT`
- `MENTOR`
- `ADMIN`

Passwords are stored as hashes rather than plaintext.

### Submission

Stores project information, the student relationship, review status, and review metadata.

Supported statuses:

- `PENDING`
- `APPROVED`
- `REJECTED`

Each student can have one submission under the current schema. Review metadata includes the review timestamp, reviewer, and optional feedback.

## Authentication and Authorization

- JWT is used to authenticate users.
- The authentication cookie is configured as HTTP-only.
- Bearer token authentication is supported as a fallback where implemented.
- Protected routes require valid authentication.
- Role-based middleware restricts student and mentor operations.
- Passwords are hashed using bcryptjs.
- Input validation uses Zod.

Frontend route protection should not be considered a security boundary by itself. Authorization must be enforced by the backend.

## Security Considerations

- Keep `.env` out of Git.
- Use a strong, randomly generated JWT secret.
- Configure CORS to allow only trusted frontend origins.
- Configure cookie security, `SameSite`, and HTTPS appropriately for production.
- Apply rate limiting to sensitive endpoints.
- Validate request bodies on the server.
- Do not expose password hashes, tokens, or private credentials in API responses or logs.
- Use HTTPS for production deployments.

## Testing and Verification

Run the available quality checks:

```bash
npm run typecheck
npm run build
```

For manual API testing, use an API client such as Postman or Bruno. Verify registration, login, access control, submission creation, mentor review, and updated submission status.

## Related Project

The Next.js frontend is maintained separately in `ph-web-instructor-frontend`.

Set the frontend's `NEXT_PUBLIC_API_URL` to the deployed or local backend API base URL.

## License

Add the applicable license information here if the project is distributed under a specific license.
