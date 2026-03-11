# Onboarding Automation Workflow

A Spring Boot & Vanilla JavaScript full-stack application for orchestrating Application Onboarding via the **PingOne API**. This system provides a dark-themed UI to deploy OAuth 2.0, OIDC, and SAML applications into your PingOne environment and stores the application metadata into a local database.

## 🚀 Tech Stack
- **Backend**: Java 17, Spring Boot 3.x, Spring WebFlux (WebClient), Spring Data JPA, H2 In-Memory Database
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN), Lucide Icons
- **Integrations**: PingOne REST API (`/v1/environments/...`)

---

## ⚙️ Prerequisites
Before running this project, ensure you have the following installed:
1. **Java Development Kit (JDK) 17** or higher 
2. **Apache Maven** (for building and running)

---

## 🛠️ Configuration

The project is configured using `src/main/resources/application.properties`. 
Before running the project, update the PingOne credentials with your actual PingOne environment details:

```properties
# PingOne API Settings
pingone.api.base-url=https://api.pingone.com/v1
pingone.api.token-url=https://auth.pingone.com/<ENV-ID>/as/token
pingone.api.client-id=<YOUR-PINGONE-APP-CLIENT-ID>
pingone.api.client-secret=<YOUR-PINGONE-APP-CLIENT-SECRET>
pingone.api.environment-id=<YOUR-ENV-ID>
```

> **Note:** The database handles automatic creation using an in-memory SQL database (H2). Data is not preserved after shutting down the application.

---

## 🏃 Build & Run Instructions

### Starting the Server
Open your terminal in the root directory (`Onboarding_Automation`) and run:
```bash
mvn clean install
mvn spring-boot:run
```

Once you see `Started OnboardingAutomationApplication in X seconds`, the server is running!

### Accessing the Web UI
Open your browser and navigate to:
👉 **[http://localhost:8080/](http://localhost:8080/)**

---

## 📖 How to Use the Application

### 1. Registration & Login
Since the application uses an in-memory database, your user accounts will reset upon restarting the server.
1. When you first visit `http://localhost:8080/`, you'll be redirected to `/login.html`.
2. Click **Create an account** to register a new user. 
3. After registering, log in with your new credentials.

### 2. Dashboard Navigation
- **Home**: View all applications you have provisioned.
- **Create New App**: Opens the onboarding wizard.
- **My Profile**: View and update your user details.

### 3. Creating an Application
1. Click **Create New App** from the sidebar.
2. **Step 1:** Enter the application name and select the protocol (`SAML` or `OIDC / OAuth 2.0`).
3. **Step 2:** Fill out the configuration fields. 
   - *For SAML:* Ensure the `Entity ID` is globally unique within your PingOne environment.
4. **Step 3:** Assign Access (`ALL_USERS` or enter a specific `GROUP`).
5. **Step 4:** Review your configuration and click **Deploy Application**.

The backend will provision the app directly into PingOne and then save all metadata attributes natively into the local H2 Database.

---

## 🗄️ Database Console
The application uses an H2 in-memory database to store User details and Provisioned Assets locally. You can view the raw tables using the web console:

1. Open **[http://localhost:8080/h2-console](http://localhost:8080/h2-console)**
2. Make sure the properties match:
   - **JDBC URL**: `jdbc:h2:mem:onboarding_db`
   - **User Name**: `sa`
   - **Password**: *(leave blank)*
3. Click **Connect** to query the `USERS` and `ASSETS` tables.
