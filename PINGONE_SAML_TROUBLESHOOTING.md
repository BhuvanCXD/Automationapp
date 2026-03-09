# ⚠️ TROUBLESHOOTING: Application Not Created in PingOne Dashboard

**Issue:** Applications are not appearing in PingOne dashboard after POST to `/api/saml/create`

**Root Cause:** PingOne API requires specific field formats and structure that don't match current DTO

---

## Problem Analysis

### Current Request Format (INCORRECT)
```json
{
  "enabled": true,
  "name": "HR Portal",
  "type": "NATIVE_APP",
  "protocol": "saml",
  "spEntityId": "https://app.example.com",
  "acsUrls": ["https://app.example.com/acs"],
  "assertionDuration": 3600,
  "subjectNameIdFormat": "email"
}
```

### What PingOne Expects (CORRECT)
For SAML applications, PingOne expects:
```json
{
  "name": "HR Portal",
  "enabled": true,
  "type": "NATIVE_APP",
  "protocol": "SAML",
  "samlOptions": {
    "acsUrls": ["https://app.example.com/acs"],
    "spEntityId": "https://app.example.com",
    "assertionDuration": 3600,
    "nameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
  }
}
```

**Key Differences:**
1. ❌ `protocol` should be uppercase: `"SAML"` not `"saml"`
2. ❌ SAML-specific fields wrapped in `samlOptions` object
3. ❌ `subjectNameIdFormat` should use URN format (not just "email")
4. ❌ Missing nested structure in request DTO

---

## Solution

### Step 1: Update SamlAppRequestDto

The DTO should match PingOne's expected structure:

```java
public class SamlAppRequestDto {
    private String name;
    private boolean enabled;
    private String type;           // e.g., "NATIVE_APP"
    private String protocol;       // e.g., "SAML" (uppercase!)
    
    // SAML-specific options
    private SamlOptions samlOptions;
    
    // Getters/setters...
}

public class SamlOptions {
    private List<String> acsUrls;
    private String spEntityId;
    private int assertionDuration;
    private String nameIdFormat;   // URN format
    
    // Getters/setters...
}
```

### Step 2: Correct Protocol Format

Always use **uppercase** for protocol:
- ✅ "SAML"
- ❌ "saml"

### Step 3: Use Correct NameID Format

Map user-friendly names to PingOne URN formats:
- "email" → "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
- "persistent" → "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"
- "transient" → "urn:oasis:names:tc:SAML:2.0:nameid-format:transient"

---

## Verification Checklist

Before creating SAML app, verify:

```bash
# 1. Check token is valid
curl -X GET http://localhost:8080/api/users/me \
  -b cookies.txt

# 2. Check request format
curl -b cookies.txt -X POST http://localhost:8080/api/saml/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Portal",
    "enabled": true,
    "type": "NATIVE_APP",
    "protocol": "SAML",
    "samlOptions": {
      "acsUrls": ["https://app.example.com/acs"],
      "spEntityId": "https://app.example.com",
      "assertionDuration": 3600,
      "nameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    }
  }' -v

# 3. Check logs for PingOne response
tail -f app.log | grep -i "pingone\|error\|saml"

# 4. Verify in PingOne dashboard
# Log in to PingOne → Environments → Applications
```

---

## Common Errors & Solutions

### Error 1: "Invalid field: protocol"
```
Message: Protocol must be SAML, OIDC, or OAUTH2
Cause: Using lowercase "saml" instead of "SAML"
Solution: Change protocol to uppercase "SAML"
```

### Error 2: "Missing required field: acsUrls"
```
Message: ACS URLs are required for SAML applications
Cause: acsUrls not in samlOptions wrapper
Solution: Wrap SAML fields in samlOptions object
```

### Error 3: "Invalid NameID format"
```
Message: nameIdFormat must be a valid URN
Cause: Using "email" instead of URN
Solution: Convert to full URN: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
```

### Error 4: "401 Unauthorized"
```
Message: Bearer token invalid or expired
Cause: Token expired or invalid
Solution: Get fresh token from /csrf → /login
```

### Error 5: "Application created but not visible in dashboard"
```
Possible Causes:
- Application is in draft state (check "enabled" field)
- Wrong PingOne environment in credentials
- PingOne dashboard needs refresh
Solution: Verify enabled=true, check environment-id matches
```

---

## Quick Test Request

```bash
# 1. Register & Login first
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123"}'

curl -c cookies.txt http://localhost:8080/csrf

curl -b cookies.txt -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'

# 2. Create SAML App with CORRECT format
curl -b cookies.txt -X POST http://localhost:8080/api/saml/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test SAML App",
    "enabled": true,
    "type": "NATIVE_APP",
    "protocol": "SAML",
    "samlOptions": {
      "acsUrls": ["https://localhost:8080/saml/acs"],
      "spEntityId": "https://localhost:8080",
      "assertionDuration": 3600,
      "nameIdFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
    }
  }' -v

# 3. Check response
# Look for: "applicationId", "samlMetadata", "idpConfiguration"
# These indicate successful creation in PingOne
```

---

## Next Steps

1. ✅ Update SamlAppRequestDto to use SamlOptions wrapper
2. ✅ Update PingOneApiClient request mapping
3. ✅ Update SAMLController validation
4. ✅ Update frontend dashboard.js form submission
5. ✅ Test with corrected request format
6. ✅ Verify in PingOne dashboard

---

