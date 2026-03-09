# 🚀 QUICK TEST - Copy & Paste Ready Commands

**Time Required:** 5 minutes  
**Result:** Application created in PingOne dashboard ✅

---

## Windows PowerShell Commands (Copy & Paste)

### Step 1: Start Application
```powershell
cd "D:\CyberXDelta\Onboarding_Automation\Onboarding_Automation"
mvn spring-boot:run
```
⏸️ **Wait for:** "Started Onboarding_Automation in X seconds"

---

### Step 2: Open New PowerShell Window & Register User
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "TestPass123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/register" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

✅ **Expected Response:** `{"status":"success","message":"User registered successfully"}`

---

### Step 3: Get CSRF Token & Login
```powershell
# Get CSRF token (saves to file)
$response = Invoke-WebRequest -Uri "http://localhost:8080/csrf" `
    -SessionVariable "session" `
    -UseBasicParsing

# Login
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    username = "testuser"
    password = "TestPass123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/login" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -WebSession $session `
    -UseBasicParsing

Write-Host $loginResponse.Content
```

✅ **Expected Response:** `{"status":"success","username":"testuser","roles":"ROLE_USER"}`

---

### Step 4: Create SAML Application (THE MAIN TEST)
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    name = "HR Portal"
    enabled = $true
    type = "NATIVE_APP"
    protocol = "SAML"
    samlOptions = @{
        acsUrls = @("https://localhost:8080/saml/acs")
        spEntityId = "https://localhost:8080"
        assertionDuration = 3600
        nameIdFormat = "email"
    }
} | ConvertTo-Json -Depth 10

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/saml/create" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -WebSession $session `
    -UseBasicParsing

Write-Host $response.Content | ConvertFrom-Json | ConvertTo-Json
```

✅ **CRITICAL CHECK:** Response should contain `"applicationId"` field

---

### Step 5: Extract Application ID
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/saml/create" `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -WebSession $session `
    -UseBasicParsing | ConvertFrom-Json

$appId = $response.applicationId
Write-Host "Application ID: $appId"

if ($appId) {
    Write-Host "✅ SUCCESS! Application created in PingOne"
} else {
    Write-Host "❌ FAILED! No application ID returned"
}
```

---

## cURL Commands (For Bash/Git Bash)

### All-in-One Test Script
```bash
#!/bin/bash

BASE_URL="http://localhost:8080"
USERNAME="testuser"
PASSWORD="TestPass123"
EMAIL="test@example.com"

echo "=== STEP 1: Register User ==="
curl -X POST $BASE_URL/api/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }"

echo -e "\n\n=== STEP 2: Get CSRF Token & Login ==="
curl -c cookies.txt $BASE_URL/csrf

curl -b cookies.txt -X POST $BASE_URL/api/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"$PASSWORD\"
  }"

echo -e "\n\n=== STEP 3: Create SAML App (MAIN TEST) ==="
RESPONSE=$(curl -b cookies.txt -X POST $BASE_URL/api/saml/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Portal",
    "enabled": true,
    "type": "NATIVE_APP",
    "protocol": "SAML",
    "samlOptions": {
      "acsUrls": ["https://localhost:8080/saml/acs"],
      "spEntityId": "https://localhost:8080",
      "assertionDuration": 3600,
      "nameIdFormat": "email"
    }
  }')

echo $RESPONSE | jq .

APP_ID=$(echo $RESPONSE | jq -r '.applicationId // empty')

echo -e "\n=== RESULT ==="
if [ -n "$APP_ID" ]; then
  echo "✅ SUCCESS! Application created with ID: $APP_ID"
else
  echo "❌ FAILED! No application ID in response"
  echo "Check logs: tail -f app.log"
fi
```

---

## Log Check Commands

### Watch Application Logs in Real-Time
```bash
tail -f app.log | grep -i "saml\|pingone\|created\|error"
```

### Look for Success Messages
```bash
grep "Application created in PingOne with ID" app.log
```

### Check for Errors
```bash
grep "ERROR\|Exception" app.log | tail -20
```

---

## Expected Log Output (Success)

```
INFO  - Creating SAML application in PingOne.
INFO  - Target API URL: https://api.pingone.com/v1/environments/819dc7ca-6b96-4017-9fbd-be317d723035/applications
INFO  - Request: name=HR Portal, type=NATIVE_APP, protocol=SAML
INFO  - SAML Options: spEntityId=https://localhost:8080, acsUrls=[https://localhost:8080/saml/acs], assertionDuration=3600
INFO  - PingOne API response received (length: 1234 bytes)
INFO  - Parsing PingOne response...
INFO  - Application created in PingOne with ID: c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a
INFO  - SAML metadata extracted from response
INFO  - IDP configuration extracted from response
INFO  - Successfully parsed PingOne response
```

---

## Success Criteria

### ✅ All Good If You See:

1. **Registration Response**
   ```
   {"status":"success","message":"User registered successfully"}
   ```

2. **Login Response**
   ```
   {"status":"success","username":"testuser","roles":"ROLE_USER"}
   ```

3. **SAML Creation Response**
   ```
   {
     "applicationId": "c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a",
     "samlMetadata": "{...}",
     "idpConfiguration": "{...}"
   }
   ```

4. **In Logs**
   ```
   Application created in PingOne with ID: c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a
   ```

5. **In PingOne Dashboard**
   - Application appears in list
   - Status shows "Enabled"

---

## Troubleshooting

### If Step 3 Returns No applicationId
```bash
# Check logs for error details
grep "ERROR\|PingOne" app.log | tail -50

# Common issues:
# 1. Protocol not "SAML" (uppercase)
# 2. samlOptions not wrapped
# 3. PingOne credentials invalid
# 4. Token expired
```

### If Port 8080 Already in Use
```powershell
# Windows: Find and kill process
Get-NetTCPConnection -LocalPort 8080 | Stop-Process -Force

# Or use different port
java -Dserver.port=8081 -jar target/...jar
```

### If CORS or Cookie Issues
```bash
# Ensure cookies are persisted
# curl: Use -c and -b flags
# PowerShell: Use -WebSession parameter
```

---

## Quick Reference Card

| Step | Command | Expected Result |
|------|---------|-----------------|
| 1 | Register user | `status: success` |
| 2 | Login | `status: success` |
| 3 | Create SAML | `applicationId: ...` |
| 4 | Check logs | "Application created in PingOne" |
| 5 | PingOne dashboard | App visible & enabled |

---

## Full Success Checklist

- [ ] Application started successfully (no errors)
- [ ] User registered (step 1)
- [ ] User logged in (step 2)
- [ ] SAML app created with ID (step 3)
- [ ] Logs show success message (step 4)
- [ ] App visible in PingOne dashboard (step 5)

✅ **If all checked:** ISSUE RESOLVED! 🎉

---

## Need Help?

1. **Quick Reference:** ACTION_PLAN.md
2. **Detailed Troubleshooting:** PINGONE_SAML_TROUBLESHOOTING.md
3. **Technical Details:** SAML_CREATION_FIX.md

---

**Ready? Start with "Step 1: Start Application" above!** 🚀

---

