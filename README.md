# CyberX Delta — IAM Self-Service Application Onboarding Portal

A **Spring Boot 3** web application that lets internal teams self-service onboard their applications into **PingOne** (Identity-as-a-Service). It handles user registration & login, then provides a guided multi-step wizard to provision OIDC or SAML applications directly via the PingOne Management API.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration](#configuration)
5. [Database](#database)
6. [Security & Authentication](#security--authentication)
7. [REST API Reference](#rest-api-reference)
8. [Frontend Pages](#frontend-pages)
9. [PingOne Integration](#pingone-integration)
10. [Running the Application](#running-the-application)
11. [Running Tests](#running-tests)

---

## Architecture Overview

```
Browser (HTML/JS)
      │
      │  HTTP (cookie-based session + XSRF-TOKEN)
      ▼
┌─────────────────────────────────────────┐
│         Spring Boot Application          │
│                                         │
│  Controllers   ───►  Services  ──►  DB  │
│  (REST + SPA)         │         (MySQL) │
│                       │                 │
│                       └──► PingOne API  │
└─────────────────────────────────────────┘
```

- **Frontend**: Plain HTML + Vanilla JS (no frameworks). Static files served directly by Spring Boot.
- **Backend**: Spring Boot 3 REST API. Cookie-based session authentication (no JWT).
- **Database**: MySQL — stores users and provisioned asset metadata.
- **PingOne**: External IAM SaaS. Applications are provisioned via the PingOne Management REST API using OAuth 2.0 client credentials.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.x |
| Security | Spring Security 6 |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8 |
| HTTP Client | Spring WebFlux WebClient (reactive) |
| Templating | None — static HTML/JS |
| Build | Maven Wrapper (`mvnw`) |
| Logging | SLF4J + Logback, with Correlation IDs |

---

## Project Structure

```
src/main/
├── java/com/cyberxdelta/Onboarding_Automation/
│   ├── config/
│   │   ├── SecurityConfig.java         # Spring Security rules, CSRF, session management
│   │   ├── PingOneConfig.java          # PingOne API credentials (@ConfigurationProperties)
│   │   ├── WebClientConfig.java        # Reactive WebClient bean for PingOne HTTP calls
│   │   ├── RestTemplateConfig.java     # RestTemplate bean
│   │   ├── PasswordEncoderConfig.java  # BCryptPasswordEncoder bean
│   │   └── DataInitializer.java        # Seeds a default admin user on first startup
│   │
│   ├── controller/
│   │   ├── SpaController.java          # Forwards /login, /register, /dashboard → HTML files
│   │   ├── RestLoginController.java    # POST /api/login  — JSON login with session persistence
│   │   ├── RestRegistrationController.java  # POST /api/register
│   │   ├── RestOnboardingController.java    # POST /api/onboard — triggers PingOne provisioning
│   │   ├── ApplicationConfigController.java # CRUD for application configs
│   │   ├── ProfileController.java      # GET /api/users/me, user profile
│   │   ├── UserController.java         # Admin user management
│   │   ├── AssetController.java        # GET /api/assets — list provisioned apps
│   │   ├── SAMLImportController.java   # POST /api/saml/import — import SAML metadata XML
│   │   └── CsrfController.java         # GET /csrf — exposes CSRF token to JS
│   │
│   ├── service/
│   │   ├── UserService.java                    # Register, get profile, list users
│   │   ├── OnboardingOrchestrationService.java # Orchestrates token fetch → PingOne provision
│   │   ├── PingOneTokenService.java            # OAuth2 client_credentials token with in-memory cache
│   │   ├── PingOneProvisioningService.java     # POSTs application payload to PingOne API
│   │   ├── ApplicationConfigService.java       # CRUD logic for ApplicationConfig records
│   │   └── SAMLMetadataService.java            # Parses SAML metadata XML
│   │
│   ├── entity/
│   │   ├── User.java                # users table — username, email, password (BCrypt), role
│   │   ├── Asset.java               # assets table — provisioned app metadata per user
│   │   └── ApplicationConfig.java   # application_configs table — stored app configurations
│   │
│   ├── dto/
│   │   ├── OnboardingRequestDTO.java        # Onboard wizard payload (name, protocol, URIs…)
│   │   ├── request/RegisterRequest.java     # Registration DTO with Bean Validation
│   │   ├── request/LoginRequest.java        # Login DTO
│   │   └── UserDto.java                     # Public user representation
│   │
│   ├── repository/
│   │   ├── UserRepository.java      # findByUsername, existsByUsername
│   │   ├── AssetRepository.java     # findByUsername
│   │   └── AssetRepository.java     # ...
│   │
│   ├── security/
│   │   ├── CustomUserDetailsService.java  # Loads UserDetails from MySQL via UserRepository
│   │   ├── SecurityConstants.java         # PUBLIC_URLS whitelist
│   │   └── CorrelationIdFilter.java       # Injects X-Correlation-ID into MDC for logging
│   │
│   └── exception/
│       ├── PingOneApiException.java    # Runtime exception for PingOne API errors
│       └── GlobalExceptionHandler.java # @ControllerAdvice — unified error JSON responses
│
└── resources/
    ├── application.properties          # All configuration (DB, PingOne, logging)
    └── static/
        ├── login.html      # Login page
        ├── register.html   # Registration page
        ├── index.html      # Dashboard (lists applications)
        ├── onboard.html    # Multi-step onboarding wizard
        ├── app.js          # Shared API client (API.login, API.register, API.logout…)
        └── style.css       # Global styles
```

---

## Configuration

All configuration lives in `src/main/resources/application.properties`.

### Database

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/onboarding_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

> The database is created automatically if it doesn't exist. JPA is set to `ddl-auto=update` so tables are created/migrated on startup.

### PingOne Credentials

```properties
pingone.api.base-url=https://api.pingone.com/v1
pingone.api.token-url=https://auth.pingone.com/${pingone.environment-id}/as/token
pingone.api.client-id=YOUR_CLIENT_ID
pingone.api.client-secret=YOUR_CLIENT_SECRET
pingone.environment-id=YOUR_ENV_ID
```

These map to `PingOneConfig.java` via `@ConfigurationProperties(prefix = "pingone.api")`.

> ⚠️ **Never commit real credentials to source control.** For production, use environment variables or a secrets manager.

### Logging

Logs are written to both the console and `app.log`. Each request gets a Correlation ID injected via `CorrelationIdFilter` and printed in every log line:

```
2026-03-05 06:10:00 [http-nio-8080-exec-1] INFO  c.c.O.service.UserService - [CorrID: abc123] - Registering new user: alice
```

---

## Database

Two main tables are managed by JPA/Hibernate:

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | BIGINT (PK) | Auto-generated |
| `username` | VARCHAR (unique) | Login identifier |
| `password` | VARCHAR | BCrypt hashed |
| `email` | VARCHAR (unique) | |
| `first_name` | VARCHAR | Optional |
| `last_name` | VARCHAR | Optional |
| `role` | VARCHAR | Default: `ROLE_USER` |
| `created_at` | DATETIME | Set on `@PrePersist` |

### `assets`

Stores a record for each application successfully provisioned to PingOne. Linked to the user who submitted the request.

| Column | Notes |
|---|---|
| `application_name` | Name of the provisioned application |
| `protocol` | `OIDC` or `SAML` |
| `identity_provider` | e.g. `PingOne`, `Okta`, `AzureAD` |
| `redirect_uri` | OIDC callback URL |
| `access_type` | `ALL_USERS` or `GROUP` |
| `group_name` | Set when `access_type = GROUP` |
| `username` | The portal user who provisioned it |

---

## Security & Authentication

Authentication is **cookie-based session** (no JWT). Spring Security 6 manages the `JSESSIONID` session cookie.

### CSRF Protection

Spring Security's `CookieCsrfTokenRepository` sets an `XSRF-TOKEN` cookie readable by JavaScript. The frontend reads this cookie and sends it back as the `X-XSRF-TOKEN` request header on every mutating request (POST/PUT/DELETE).

> **Important (Spring Security 6):** `CsrfTokenRequestAttributeHandler` (plain, no XOR) is configured explicitly. Without this, the default XOR handler breaks cookie-based CSRF for SPAs.

### Public Endpoints (No Auth Required)

| URL | Purpose |
|---|---|
| `GET /login`, `/login.html` | Login page |
| `GET /register`, `/register.html` | Registration page |
| `GET /csrf` | Fetch CSRF token |
| `POST /api/login` | JSON login endpoint |
| `POST /api/register` | Create a new account |
| `POST /logout` | Spring Security full logout |

### Protected Endpoints

All `GET /api/**` and `POST /api/**` paths (except those above) require the `ROLE_USER` role.

### Login Flow

1. JS calls `GET /csrf` → Spring sets `XSRF-TOKEN` cookie.
2. JS calls `POST /api/login` with `{ username, password }` and `X-XSRF-TOKEN` header.
3. `RestLoginController` authenticates via `AuthenticationManager`, invalidates the old session (session-fixation protection), creates a new session, and saves the `SecurityContext` to `SPRING_SECURITY_CONTEXT_KEY` in the session.
4. The browser now holds a valid `JSESSIONID` cookie for all subsequent requests.

### Logout Flow

1. JS calls `POST /logout` with `X-XSRF-TOKEN` header.
2. Spring Security invalidates the session, deletes `JSESSIONID`, and returns `{"status":"success"}`.
3. JS clears `sessionStorage` and redirects to `/login.html`.

---

## REST API Reference

### Auth

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/login` | No | Login with username + password. Returns session cookie. |
| `POST` | `/api/register` | No | Create a new user account. |
| `POST` | `/logout` | No | Invalidate session and clear cookies. |
| `GET` | `/csrf` | No | Returns CSRF token (also sets `XSRF-TOKEN` cookie). |

#### `POST /api/login`
**Request Body:**
```json
{ "username": "alice", "password": "mypassword" }
```
**Success Response (200):**
```json
{ "status": "success", "username": "alice", "roles": "ROLE_USER", "message": "Login successful" }
```
**Failure Response (401):**
```json
{ "status": "error", "message": "Invalid username or password" }
```

#### `POST /api/register`
**Request Body:**
```json
{
  "username": "alice",
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice@example.com",
  "password": "mypassword8"
}
```
**Validation Rules:**
- `username`: 3–20 characters, required
- `password`: minimum 8 characters, required
- `email`: valid email format, required

**Success Response (200):**
```json
{ "status": "success", "message": "User registered successfully" }
```

---

### Onboarding

| Method | URL | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/onboard` | Yes (`ROLE_USER`) | Provision an application to PingOne. |

#### `POST /api/onboard`
**Request Body:**
```json
{
  "applicationName": "Finance Dashboard",
  "identityProvider": "PingOne",
  "protocol": "OIDC",
  "accessType": "ALL_USERS",
  "redirectUri": "https://finance.internal/callback",
  "postLogoutRedirectUri": "https://finance.internal/logout",
  "scopes": "openid profile email",
  "grantTypes": "authorization_code refresh_token"
}
```
For **SAML** protocol:
```json
{
  "applicationName": "HR Portal",
  "protocol": "SAML",
  "entityId": "urn:example:hrportal",
  "acsUrl": "https://hr.internal/saml/acs",
  "accessType": "GROUP",
  "groupName": "hr-team"
}
```
**Success Response (200):**
```json
{ "status": "success", "message": "Application onboarded successfully" }
```

---

### Users & Assets

| Method | URL | Description |
|---|---|---|
| `GET` | `/api/users/me` | Current logged-in user profile |
| `GET` | `/api/users` | List all users (admin) |
| `GET` | `/api/assets` | List all provisioned assets |

---

## Frontend Pages

| URL | File | Description |
|---|---|---|
| `/login.html` | `login.html` | Username + password login form |
| `/register.html` | `register.html` | New account registration form |
| `/index.html` | `index.html` | Dashboard — lists all applications for the user |
| `/onboard.html` | `onboard.html` | Multi-step wizard to provision a new application |

All pages share `app.js` which provides:
- **`API`** — fetch wrapper with automatic CSRF token injection and error handling (`API.login()`, `API.register()`, `API.logout()`, `API.getApplications()`, etc.)
- **`Utils`** — helpers for alerts, modals, date formatting, and session-based auth check (`Utils.isAuthenticated()`, `Utils.redirectIfNotAuthenticated()`)

---

## PingOne Integration

The integration uses PingOne's **Management API** with the **Client Credentials** OAuth 2.0 flow.

### Token Lifecycle (`PingOneTokenService`)

- Fetches a bearer token via `POST {token-url}` with `grant_type=client_credentials`.
- Caches the token in an `AtomicReference` with a 1-minute expiry buffer — so a new token is fetched before the current one expires.
- Thread-safe; reactive (`Mono<String>`).

### Application Provisioning (`PingOneProvisioningService`)

- `POST /environments/{envId}/applications` with the application payload.
- Retries up to 3 times (exponential backoff starting at 2 seconds) on network errors or `5xx` responses.
- Does **not** retry on `4xx` client errors.

### Payload Construction (`OnboardingOrchestrationService`)

Maps the UI wizard fields to the PingOne API payload format:

| Protocol | PingOne `protocol` value | Key fields |
|---|---|---|
| OIDC | `OPENID_CONNECT` | `redirectUris[]`, `grantTypes[]`, `scopes[]`, `postLogoutRedirectUri` |
| SAML | `SAML` | `samlOptions.entityId`, `samlOptions.acsUrl` |

---

## Running the Application

### Prerequisites

- Java 17+
- MySQL 8 running locally on port 3306
- (Optional) Valid PingOne credentials for end-to-end onboarding tests

### Steps

```powershell
# 1. Clone the repository and navigate to the project root
cd d:\CyberXDelta\Onboarding_Automation\Onboarding_Automation

# 2. Update database password in application.properties
#    spring.datasource.password=YOUR_MYSQL_PASSWORD

# 3. Start the application
.\mvnw spring-boot:run

# 4. Open in browser
# http://localhost:8080/register.html  — create an account
# http://localhost:8080/login.html     — log in
# http://localhost:8080/index.html     — dashboard
# http://localhost:8080/onboard.html  — onboard an application
```

The database (`onboarding_db`) and all tables are created automatically on first startup.

---

## Running Tests

```powershell
.\mvnw test
```

Test coverage includes:

| Test Class | What it covers |
|---|---|
| `UserServiceTest` | Register new user (success + duplicate username) |
| `OnboardingOrchestrationServiceTest` | Payload building, token chain, validation |
| `PingOneProvisioningServiceTest` | WebClient mock, retry logic, error handling |
| `PingOneTokenServiceTest` | Token caching, expiry refresh |
| `ApplicationConfigControllerTest` | CRUD controller layer |

Tests use `@SpringBootTest` with `@MockBean` for repository/WebClient isolation and run against an H2 in-memory database (`application-test.properties`).
"# App-Automation" 
