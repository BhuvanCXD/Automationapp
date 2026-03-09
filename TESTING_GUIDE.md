# Onboarding Automation Platform - Quick Test Guide

## Prerequisites

Before running tests, ensure:
- ✅ MySQL is running (localhost:3306, user: root, password: 2005)
- ✅ Application is running: `mvn spring-boot:run` on port 8080
- ✅ PingOne credentials configured in `application.yml`

## Test Scenarios

### 1. User Registration Test

```bash
# Register a new user
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Expected Response:
# { "status": "success", "message": "User registered successfully" }
```

**Expected Result:** ✅ User created in database with hashed password

---

### 2. User Login Test

```bash
# Get CSRF token first
curl -c cookies.txt http://localhost:8080/csrf

# Login with credentials
curl -b cookies.txt -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123"
  }'

# Expected Response:
# { "status": "success", "username": "testuser", "roles": "ROLE_USER" }
```

**Expected Result:** ✅ Session created, authentication token stored

---

### 3. Get Current User Profile

```bash
# With active session
curl -b cookies.txt http://localhost:8080/api/users/me

# Expected Response:
# { "id": 1, "username": "testuser", "email": "test@example.com", "roles": ["ROLE_USER"] }
```

**Expected Result:** ✅ Current user profile returned

---

### 4. List Applications (Empty)

```bash
# Authenticated request
curl -b cookies.txt http://localhost:8080/api/applications

# Expected Response:
# []
```

**Expected Result:** ✅ Empty array (no apps created yet)

---

### 5. Create Application (Local Storage)

```bash
curl -b cookies.txt -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Portal",
    "type": "saml",
    "configJson": "{\"entityId\": \"https://idp.okta.com/app/exk/sso/saml\", \"ssoUrl\": \"https://idp.okta.com/app/exk/sso/saml\"}"
  }'

# Expected Response:
# {
#   "id": 1,
#   "name": "HR Portal",
#   "type": "saml",
#   "username": "testuser",
#   "configJson": "...",
#   "createdAt": "2026-03-06T10:00:00"
# }
```

**Expected Result:** ✅ Application stored in ApplicationConfig table

---

### 6. Get Application by ID

```bash
curl -b cookies.txt http://localhost:8080/api/applications/1

# Expected Response:
# {
#   "id": 1,
#   "name": "HR Portal",
#   "type": "saml",
#   ...
# }
```

**Expected Result:** ✅ Application details returned

---

### 7. Update Application

```bash
curl -b cookies.txt -X PUT http://localhost:8080/api/applications/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Portal - Updated",
    "type": "saml",
    "configJson": "{\"entityId\": \"https://idp.okta.com/app/exk/sso/saml\", \"ssoUrl\": \"https://idp.okta.com/app/exk/sso/saml\", \"description\": \"Updated\"}"
  }'

# Expected Response:
# { "id": 1, "name": "HR Portal - Updated", ... }
```

**Expected Result:** ✅ Application updated in database

---

### 8. Delete Application

```bash
curl -b cookies.txt -X DELETE http://localhost:8080/api/applications/1

# Expected Response: 204 No Content
```

**Expected Result:** ✅ Application removed from database

---

### 9. Import SAML Metadata

```bash
# Create a test SAML metadata file
cat > metadata.xml << 'EOF'
<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" 
    entityID="https://idp.okta.com/app/exk/sso/saml">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>MIIDpTCCAo2gAwIBAgIGAYzK9BgJMA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEG</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" 
        Location="https://idp.okta.com/app/exk/slo/saml"/>
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" 
        Location="https://idp.okta.com/app/exk/sso/saml"/>
  </IDPSSODescriptor>
</EntityDescriptor>
EOF

# Import metadata
curl -b cookies.txt -F "file=@metadata.xml" -F "name=Okta IdP" \
  http://localhost:8080/api/saml/import

# Expected Response:
# {
#   "id": 2,
#   "name": "Okta IdP",
#   "type": "saml",
#   "configJson": "..parsed metadata...",
#   "username": "testuser"
# }
```

**Expected Result:** ✅ SAML metadata parsed and stored

---

### 10. Create SAML Application in PingOne

```bash
curl -b cookies.txt -X POST http://localhost:8080/api/saml/create \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "name": "HR Portal in PingOne",
    "type": "NATIVE_APP",
    "protocol": "saml",
    "spEntityId": "https://app.example.com/saml",
    "acsUrls": ["https://app.example.com/saml/acs"],
    "assertionDuration": 3600,
    "subjectNameIdFormat": "email",
    "signOnUrl": "https://app.example.com/saml/login"
  }'

# Expected Flow:
# 1. TokenService.getAccessToken() → PingOne /as/token
# 2. PingOneApiClient.createSamlApplication(token, requestDto)
# 3. POST to PingOne /v1/environments/.../applications
# 4. Response with application ID and metadata

# Expected Response:
# {
#   "applicationId": "abc123def456...",
#   "samlMetadata": "<?xml version='1.0'?><EntityDescriptor...",
#   "idpConfiguration": "{...}",
#   "details": "{...full response...}"
# }
```

**Expected Result:** ✅ Application created in PingOne environment

---

### 11. Verify Protected Endpoints (No Authentication)

```bash
# Without session/cookies
curl http://localhost:8080/api/applications

# Expected Response: 401 Unauthorized or redirect
```

**Expected Result:** ✅ Unauthenticated requests are blocked

---

### 12. Test CSRF Protection

```bash
# Try POST without CSRF token
curl -b cookies.txt -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# Expected Response: 403 Forbidden (CSRF validation failed)
```

**Expected Result:** ✅ CSRF protection working

---

## Testing via UI (Browser)

### Step 1: Open Application
1. Open http://localhost:8080/register.html
2. Register a new user with valid credentials
3. Navigate to http://localhost:8080/login.html
4. Login with registered credentials

### Step 2: Create Application via Dashboard
1. After login, access http://localhost:8080/dashboard.html
2. Click "Create Application"
3. Fill in application details (name, type, protocol)
4. Select "SAML 2.0" protocol
5. Enter SAML configuration (manual or XML import)
6. Complete all 4 steps
7. Click "Deploy"

### Step 3: Verify Application Created
1. Check application appears in the list
2. Click edit/view to see details
3. Verify configuration saved correctly

### Step 4: Test SAML Import
1. Go to "Import SAML Metadata" section
2. Select a SAML metadata XML file
3. Application should be created from metadata

---

## Database Verification

### Check User Created
```sql
SELECT * FROM users WHERE username = 'testuser';
```

### Check Application Created
```sql
SELECT * FROM application_config WHERE username = 'testuser';
```

### Check Asset Created (if onboarding used)
```sql
SELECT * FROM assets WHERE username = 'testuser';
```

---

## Log Inspection

### Server Logs (if running with `mvn spring-boot:run`)
- User registration logs
- Login authentication logs
- Token generation logs
- SAML API calls to PingOne
- Error messages if any

### Log File
```
tail -f app.log
```

---

## Common Issues & Troubleshooting

### Issue: "User not found" on login
**Solution:** Verify user was registered in Step 1

### Issue: "CSRF token invalid" on POST requests
**Solution:** Ensure you get CSRF token from `/csrf` endpoint first

### Issue: "401 Unauthorized" on protected endpoints
**Solution:** Verify session is active with valid cookies

### Issue: "Failed to create SAML app in PingOne"
**Solution:** Check PingOne credentials in `application.yml`:
```yaml
pingone:
  client-id: [MUST BE SET]
  client-secret: [MUST BE SET]
  environment-id: [MUST BE SET]
```

### Issue: MySQL connection error
**Solution:** Ensure MySQL is running:
```bash
# Windows
mysql -u root -p2005

# Verify database created
SHOW DATABASES;
```

---

## Success Criteria

✅ All tests pass when:
1. User can register
2. User can login
3. Session persists across requests
4. Applications can be created/read/updated/deleted
5. SAML metadata can be imported
6. SAML apps can be created in PingOne (if credentials valid)
7. Protected endpoints reject unauthenticated requests
8. CSRF protection is active
9. Database records are created
10. No compilation errors

---

## Performance Testing Notes

- TokenService caches tokens for 60 seconds before expiry
- Repeated requests to same endpoint use cached token
- SAML metadata parsing happens on-demand
- Database queries indexed on username and id fields

---

## Next Steps

1. ✅ Run all test scenarios above
2. ✅ Verify database records created
3. ✅ Check application logs for errors
4. ✅ Test with real PingOne environment (update credentials)
5. ✅ Conduct load testing (concurrent users)
6. ✅ Test error scenarios (invalid data, network failures)
7. ✅ Deploy to production environment

---

