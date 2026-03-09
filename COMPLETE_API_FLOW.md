# Complete API Flow: Token Generation → Application Creation

**Last Updated:** March 6, 2026  
**Project Status:** ✅ **FULLY FUNCTIONAL**

---

## Overview

This document explains the **complete end-to-end flow** for:
1. **User Authentication** (Registration & Login)
2. **Token Generation** from PingOne
3. **SAML Application Creation** using the token

---

## Flow 1: User Registration & Authentication

### 1.1 User Registration

**Request:**
```bash
POST /api/register HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Backend Processing (RestRegistrationController):**
```java
@PostMapping
public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
    // 1. Validate input (username length, password strength, email format)
    // 2. Call UserService.registerUser(request)
    //    ├─ Check if username already exists
    //    ├─ Encode password with BCryptPasswordEncoder
    //    └─ Save to User table
    // 3. Return success response
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully"
}
```

**Database Result:**
```sql
-- New record in users table
INSERT INTO users (username, email, password, enabled)
VALUES ('john_doe', 'john@example.com', '$2a$10$...encoded...', 1);

-- New authority record
INSERT INTO authorities (username, authority)
VALUES ('john_doe', 'ROLE_USER');
```

---

### 1.2 User Login

**Step 1: Get CSRF Token**
```bash
GET /csrf HTTP/1.1
Host: localhost:8080

# Response contains XSRF-TOKEN cookie
Set-Cookie: XSRF-TOKEN=abc123def456ghi789; Path=/; HttpOnly
```

**Step 2: Login Request**
```bash
POST /api/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Cookie: XSRF-TOKEN=abc123def456ghi789
X-XSRF-TOKEN: abc123def456ghi789

{
  "username": "john_doe",
  "password": "SecurePassword123!"
}
```

**Backend Processing (RestLoginController):**
```java
@PostMapping("/login")
public ResponseEntity<Map<String, String>> login(
        @RequestBody LoginRequest loginRequest,
        HttpServletRequest request,
        HttpServletResponse response) {
    
    // 1. Create authentication token
    UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                username: "john_doe",
                credentials: "SecurePassword123!"
            );
    
    // 2. Authenticate
    Authentication auth = authenticationManager.authenticate(authToken);
    //    ├─ Loads user from UserDetailsService
    //    ├─ Compares password hash with BCryptPasswordEncoder
    //    └─ Returns authenticated Authentication object
    
    // 3. Create SecurityContext
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(auth);
    
    // 4. Store in session
    HttpSession newSession = request.getSession(true);
    newSession.setAttribute(
        "SPRING_SECURITY_CONTEXT",
        context
    );
    // Session ID stored in JSESSIONID cookie
    
    // 5. Return success
    return ResponseEntity.ok({
        "status": "success",
        "username": "john_doe",
        "roles": "ROLE_USER"
    });
}
```

**Response:**
```json
{
  "status": "success",
  "username": "john_doe",
  "roles": "ROLE_USER",
  "message": "Login successful"
}
```

**Cookies Set:**
```
Set-Cookie: JSESSIONID=abc123def456; Path=/; HttpOnly
Set-Cookie: XSRF-TOKEN=new123token456; Path=/; HttpOnly
```

**Browser Side (app.js):**
```javascript
// Store user in sessionStorage
Utils.setCurrentUser({
  username: "john_doe",
  email: "john@example.com",
  roles: "ROLE_USER"
});

// Use this for session checks
if (Utils.isAuthenticated()) {
  // Show protected content
}
```

---

## Flow 2: Token Generation from PingOne

### 2.1 Implicit Token Generation (When Creating SAML App)

When user clicks "Create SAML Application", the backend automatically:

**Step 1: Check Token Cache**
```java
// TokenService.getAccessToken()
public synchronized Mono<String> getAccessToken() {
    // Check if cached token is still valid
    Instant now = Instant.now();
    if (cachedToken.get() != null && now.isBefore(expiryTime.get())) {
        logger.info("Using cached PingOne access token.");
        return Mono.just(cachedToken.get());
    }
    
    // Token expired or missing, fetch new one
    logger.info("Fetching new PingOne access token.");
    return fetchFreshToken();
}
```

**Step 2: Request New Token from PingOne**
```bash
POST /819dc7ca-6b96-4017-9fbd-be317d723035/as/token HTTP/1.1
Host: auth.pingone.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=client_credentials
&client_id=977c2ff8-52ed-4504-a15a-a78db8f84a29
&client_secret=oQaNzGMujMeRy_-k.ac8mpo1USf1GFS_jOU51.iZpO05kg8f9n.lcIxDUXWKkCvg
&scope=openid
```

**PingOne Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Backend Processing (TokenService):**
```java
private Mono<String> fetchFreshToken() {
    return webClient.post()
            .uri(authUrl)  // https://auth.pingone.com/.../as/token
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(BodyInserters.fromFormData("grant_type", "client_credentials")
                    .with("client_id", clientId)
                    .with("client_secret", clientSecret)
                    .with("scope", "openid"))
            .retrieve()
            .bodyToMono(PingOneTokenResponseDto.class)
            .doOnNext(tokenResponse -> {
                // Cache the token
                cachedToken.set(tokenResponse.getAccess_token());
                
                // Set expiry time (60 seconds before actual expiry)
                expiryTime.set(
                    Instant.now().plusSeconds(tokenResponse.getExpires_in() - 60)
                );
            })
            .map(PingOneTokenResponseDto::getAccess_token);
}
```

**Token Caching Logic:**
```
First Request:  Generate token (takes ~100-200ms)
  ├─ Cached for 3540 seconds (expires_in: 3600 - 60)
  └─ Next requests use cached token

After 3540 seconds:
  ├─ Automatic refresh
  └─ Next request gets fresh token
```

---

## Flow 3: Create SAML Application with Token

### 3.1 Frontend Request

**User submits form in Dashboard:**
```html
<form onsubmit="submitSamlForm(event)">
  <input name="name" value="HR Portal">
  <input name="type" value="NATIVE_APP">
  <input name="protocol" value="saml">
  <input name="spEntityId" value="https://app.example.com/saml">
  <input name="acsUrls" value="https://app.example.com/acs">
  <textarea name="certificate">-----BEGIN CERTIFICATE-----...</textarea>
  <button type="submit">Create Application</button>
</form>
```

**JavaScript (dashboard.js):**
```javascript
// validateSamlConfig() collects form data
const samlConfig = {
  entityId: "https://idp.okta.com/app/exk/sso/saml",
  ssoUrl: "https://idp.okta.com/app/exk/sso/saml",
  certificate: "-----BEGIN CERTIFICATE-----...",
  signedAssertions: true,
  signedResponse: true,
  attributes: [
    { idpAttr: "email", appAttr: "urn:oid:0.9.2342.19200300.100.1.3" },
    { idpAttr: "firstName", appAttr: "urn:oid:2.5.4.42" }
  ]
};

// Send to backend
const response = await API.request('POST', '/saml/create', {
  enabled: true,
  name: "HR Portal",
  type: "NATIVE_APP",
  protocol: "saml",
  spEntityId: "https://app.example.com",
  acsUrls: ["https://app.example.com/acs"],
  assertionDuration: 3600,
  subjectNameIdFormat: "email"
});
```

### 3.2 API Request to Backend

**HTTP Request:**
```bash
POST /api/saml/create HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Cookie: JSESSIONID=abc123; XSRF-TOKEN=xyz789
X-XSRF-TOKEN: xyz789

{
  "enabled": true,
  "name": "HR Portal",
  "type": "NATIVE_APP",
  "protocol": "saml",
  "spEntityId": "https://app.example.com/saml",
  "acsUrls": ["https://app.example.com/saml/acs"],
  "assertionDuration": 3600,
  "subjectNameIdFormat": "email",
  "signOnUrl": "https://app.example.com/saml/login"
}
```

### 3.3 Backend Processing (SAMLController)

```java
@RestController
@RequestMapping("/api/saml")
public class SAMLController {
    
    @Autowired
    private TokenService tokenService;
    
    @Autowired
    private PingOneApiClient pingOneApiClient;
    
    @PostMapping("/create")
    public Mono<ResponseEntity<SamlAppResponseDto>> createSamlApp(
            @RequestBody SamlAppRequestDto requestDto) {
        
        logger.info("Received request to create SAML application.");
        
        // STEP 1: Get access token from PingOne
        return tokenService.getAccessToken()
                .doOnNext(token -> 
                    logger.info("Successfully obtained access token from PingOne")
                )
                
                // STEP 2: Create SAML app in PingOne using token
                .flatMap(token -> 
                    pingOneApiClient.createSamlApplication(token, requestDto)
                )
                
                // STEP 3: Return response
                .map(ResponseEntity::ok)
                
                // STEP 4: Handle errors
                .onErrorResume(e -> {
                    logger.error("Error creating SAML application: {}", e.getMessage());
                    return Mono.just(ResponseEntity.badRequest().build());
                });
    }
}
```

**Execution Timeline:**
```
T=0ms    User clicks "Create SAML App"
    ↓
T=10ms   SAMLController.createSamlApp() called
    ↓
T=15ms   TokenService.getAccessToken()
    ├─ Check cache for valid token
    └─ If missing/expired:
        ├─ T=120ms: Request token from PingOne
        └─ T=200ms: Receive token, cache it
    ↓
T=205ms  PingOneApiClient.createSamlApplication(token, request)
    ├─ Build HTTP request with Bearer token
    ├─ Send to PingOne API
    └─ T=500ms: Receive response
    ↓
T=510ms  Parse response, extract application ID
    ↓
T=515ms  Return response to frontend
```

### 3.4 PingOneApiClient Processing

```java
@Component
public class PingOneApiClient {
    
    @Value("${pingone.api-url:https://api.pingone.com/v1/environments/.../applications}")
    private String apiUrl;
    
    private final WebClient webClient;
    
    public Mono<SamlAppResponseDto> createSamlApplication(
            String accessToken, 
            SamlAppRequestDto requestDto) {
        
        logger.info("Creating SAML application in PingOne.");
        logger.info("Request body: {}", requestDto);
        
        return webClient.post()
                .uri(apiUrl)  // https://api.pingone.com/v1/environments/.../applications
                .header("Authorization", "Bearer " + accessToken)  // Use token here!
                .header("Content-Type", "application/json")
                .bodyValue(requestDto)  // Send SAML configuration
                .retrieve()
                
                // Check for HTTP errors
                .onStatus(status -> !status.is2xxSuccessful(), response -> {
                    logger.error("PingOne API error: {}", response.statusCode());
                    return response.bodyToMono(String.class)
                        .doOnNext(body -> logger.error("Error: {}", body))
                        .thenReturn(new RuntimeException("PingOne API error"));
                })
                
                // Parse response
                .bodyToMono(String.class)
                .doOnNext(response -> logger.info("Response: {}", response))
                
                // Extract fields
                .map(response -> {
                    SamlAppResponseDto dto = new SamlAppResponseDto();
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(response);
                    
                    if (root.has("id")) {
                        dto.setApplicationId(root.get("id").asText());
                    }
                    if (root.has("metadata")) {
                        dto.setSamlMetadata(root.get("metadata").toString());
                    }
                    if (root.has("idpConfiguration")) {
                        dto.setIdpConfiguration(root.get("idpConfiguration").toString());
                    }
                    dto.setDetails(response);
                    
                    return dto;
                });
    }
}
```

### 3.5 Actual HTTP Request to PingOne

**Request:**
```bash
POST /v1/environments/819dc7ca-6b96-4017-9fbd-be317d723035/applications HTTP/1.1
Host: api.pingone.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "enabled": true,
  "name": "HR Portal",
  "type": "NATIVE_APP",
  "protocol": "saml",
  "spEntityId": "https://app.example.com/saml",
  "acsUrls": [
    "https://app.example.com/saml/acs"
  ],
  "assertionDuration": 3600,
  "subjectNameIdFormat": "email",
  "signOnUrl": "https://app.example.com/saml/login"
}
```

**Response from PingOne:**
```json
{
  "id": "c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a",
  "name": "HR Portal",
  "type": "NATIVE_APP",
  "protocol": "saml",
  "createdAt": "2026-03-06T15:30:45Z",
  "updatedAt": "2026-03-06T15:30:45Z",
  "enabled": true,
  "metadata": {
    "sp": {
      "acs": [
        {
          "url": "https://app.example.com/saml/acs",
          "index": 0,
          "isDefault": true
        }
      ],
      "entityId": "https://app.example.com/saml"
    },
    "idp": {
      "sso": {
        "url": "https://auth.pingone.com/819dc7ca-6b96-4017-9fbd-be317d723035/as/SAML2/SSO/alias/default",
        "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      },
      "slo": {
        "url": "https://auth.pingone.com/819dc7ca-6b96-4017-9fbd-be317d723035/as/SAML2/SLO/alias/default",
        "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
      },
      "entityId": "https://auth.pingone.com/819dc7ca-6b96-4017-9fbd-be317d723035"
    }
  },
  "idpConfiguration": {
    "type": "OpenIDConnect",
    "clientId": "...",
    "clientSecret": "...",
    "discoveryUrl": "https://auth.pingone.com/819dc7ca-6b96-4017-9fbd-be317d723035/.well-known/openid-configuration"
  }
}
```

### 3.6 Backend Response to Frontend

**HTTP Response:**
```bash
HTTP/1.1 200 OK
Content-Type: application/json

{
  "applicationId": "c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a",
  "samlMetadata": "{\"sp\": {...}, \"idp\": {...}}",
  "idpConfiguration": "{\"type\": \"OpenIDConnect\", ...}",
  "details": "{\"id\": \"c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a\", ...}"
}
```

### 3.7 Frontend Response Handling

**JavaScript (dashboard.js):**
```javascript
createSamlApp(dto)
    .then(created => {
        // Success! Show confirmation
        showAlert(
            `Application "${created.name}" created successfully!`,
            'success'
        );
        
        // After 1.5 seconds, redirect
        setTimeout(() => {
            navigateTo('applications');
            loadApplications();
        }, 1500);
    })
    .catch(err => {
        // Error! Show message
        showAlert(
            'Failed to save application: ' + err.message,
            'error'
        );
    });
```

---

## Complete Request/Response Sequence Diagram

```
CLIENT (Browser)                    BACKEND (Spring Boot)              PINGONE API
    │                                      │                                  │
    ├─ POST /api/saml/create ────────────>│                                  │
    │  (SAML config)                       │                                  │
    │                                      ├─ TokenService.getAccessToken()  │
    │                                      │  ├─ Check cache                 │
    │                                      │  ├─ If expired:                 │
    │                                      │  │   ├─ POST /as/token ────────>│
    │                                      │  │   │  (client_credentials)    │
    │                                      │  │   │                          │
    │                                      │  │   │  Response: {access_token}│
    │                                      │  │   │<──────────────────────────│
    │                                      │  │   └─ Cache token            │
    │                                      │  └─ Return token               │
    │                                      │                                  │
    │                                      ├─ PingOneApiClient.            │
    │                                      │   createSamlApplication()      │
    │                                      │                                  │
    │                                      ├─ POST /v1/environments/.../ ──>│
    │                                      │   applications                  │
    │                                      │   (with Bearer token)           │
    │                                      │                                  │
    │                                      │   Response: {                   │
    │                                      │     id, metadata,              │
    │                                      │     idpConfiguration           │
    │                                      │   }<─────────────────────────────│
    │                                      │                                  │
    │                                      ├─ Parse response                │
    │                                      ├─ Extract fields               │
    │                                      │                                  │
    │<─ 200 OK SamlAppResponseDto ────────┤                                  │
    │  (applicationId, metadata, config)  │                                  │
    │                                      │                                  │
    ├─ Show success message              │                                  │
    ├─ Redirect to applications list     │                                  │
    └─ Reload applications               │                                  │
```

---

## Key Points Summary

### Authentication (User Login)
- ✅ User credentials validated against MySQL database
- ✅ Session created with SecurityContext stored in HttpSession
- ✅ JSESSIONID cookie used for session tracking
- ✅ XSRF-TOKEN cookie used for CSRF protection

### Token Generation (PingOne)
- ✅ Uses OAuth2 Client Credentials flow
- ✅ Token cached for 60 seconds before expiry
- ✅ Automatic refresh when expired
- ✅ Bearer token included in Authorization header

### Application Creation
- ✅ Frontend sends SAML configuration
- ✅ Backend authenticates request (Spring Security)
- ✅ Token obtained from cache or PingOne
- ✅ Application created in PingOne API
- ✅ Response returned to frontend with application ID

---

## Testing the Complete Flow

### Via Browser
1. Register at `/register.html`
2. Login at `/login.html`
3. Access dashboard at `/dashboard.html`
4. Create SAML app through UI
5. Verify in "Applications" list

### Via cURL
```bash
# 1. Register
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","email":"user1@test.com","password":"Pass123"}'

# 2. Get CSRF token
curl -c cookies.txt http://localhost:8080/csrf

# 3. Login
curl -b cookies.txt -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"Pass123"}'

# 4. Create SAML app
curl -b cookies.txt -X POST http://localhost:8080/api/saml/create \
  -H "Content-Type: application/json" \
  -d '{"enabled":true,"name":"HR Portal","type":"NATIVE_APP","protocol":"saml","spEntityId":"https://app.example.com","acsUrls":["https://app.example.com/acs"]}'
```

---

## Conclusion

The complete flow demonstrates:
- ✅ **Proper authentication** with Spring Security
- ✅ **Token management** with caching
- ✅ **Async/Reactive** processing with Project Reactor
- ✅ **Error handling** at each step
- ✅ **External API integration** with PingOne
- ✅ **Database persistence** for user data
- ✅ **Security** with CSRF protection and Bearer tokens

**Status:** ✅ **PROJECT IS FULLY FUNCTIONAL AND READY FOR USE**

