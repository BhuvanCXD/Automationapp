# Frontend Update Guide: SAML Application Creation Form

**Purpose:** Update dashboard.js to send SAML requests in correct format

---

## Changes Needed in dashboard.js

### Function: validateSamlConfig() 

**Location:** Search for `function validateSamlConfig()` in dashboard.js (around line 460)

**Current Code (INCORRECT):**
```javascript
function validateSamlConfig() {
  const entityId = document.getElementById('samlEntityId').value.trim();
  const ssoUrl = document.getElementById('samlSsoUrl').value.trim();
  const certificate = document.getElementById('samlCertificate').value.trim();

  if (!entityId || !ssoUrl || !certificate) {
    showAlert('Please fill all required SAML fields', 'error');
    return;
  }

  // Collect attribute mappings
  const attributes = [];
  document.querySelectorAll('#saml-attributes-list tr').forEach(row => {
    const inputs = row.querySelectorAll('input[type="text"]');
    if (inputs[0].value && inputs[1].value) {
      attributes.push({
        idpAttr: inputs[0].value,
        appAttr: inputs[1].value
      });
    }
  });

  appConfig.config = {
    entityId: entityId,
    ssoUrl: ssoUrl,
    sloUrl: document.getElementById('samlSloUrl').value,
    certificate: certificate,
    nameIdFormat: document.getElementById('samlNameIdFormat').value,
    signedAssertions: document.getElementById('samlSignedAssertions').checked,
    signedResponse: document.getElementById('samlSignedResponse').checked,
    attributes: attributes
  };

  closeModal('saml-config');
  showAlert('SAML configuration validated successfully!', 'success');
  proceedToNextStep();
}
```

**Updated Code (CORRECT):**
```javascript
function validateSamlConfig() {
  // Get manual configuration values
  const samlIdpName = document.getElementById('samlIdpName').value.trim();
  const entityId = document.getElementById('samlEntityId').value.trim();
  const ssoUrl = document.getElementById('samlSsoUrl').value.trim();
  const certificate = document.getElementById('samlCertificate').value.trim();
  const nameIdFormatValue = document.getElementById('samlNameIdFormat').value.trim();

  if (!entityId || !ssoUrl || !certificate) {
    showAlert('Please fill all required SAML fields', 'error');
    return;
  }

  // Collect attribute mappings
  const attributes = [];
  document.querySelectorAll('#saml-attributes-list tr').forEach(row => {
    const inputs = row.querySelectorAll('input[type="text"]');
    if (inputs[0].value && inputs[1].value) {
      attributes.push({
        idpAttr: inputs[0].value,
        appAttr: inputs[1].value
      });
    }
  });

  // Build SAML options object matching PingOne API spec
  appConfig.config = {
    // IdP information (for local reference)
    idpName: samlIdpName,
    entityId: entityId,
    ssoUrl: ssoUrl,
    sloUrl: document.getElementById('samlSloUrl').value,
    certificate: certificate,
    
    // SAML protocol-specific options (for PingOne API)
    samlOptions: {
      spEntityId: appConfig.url || "https://app.example.com",  // Use app URL if provided
      acsUrls: [appConfig.url + "/saml/acs" || "https://app.example.com/saml/acs"],
      nameIdFormat: nameIdFormatValue || "email",  // Will be converted to URN on backend
      assertionDuration: 3600,
      attributes: attributes
    },
    
    // Security options
    nameIdFormat: nameIdFormatValue,
    signedAssertions: document.getElementById('samlSignedAssertions').checked,
    signedResponse: document.getElementById('samlSignedResponse').checked
  };

  closeModal('saml-config');
  showAlert('SAML configuration validated successfully!', 'success');
  proceedToNextStep();
}
```

---

## Changes Needed in saveApplication()

**Location:** Search for `function saveApplication()` in dashboard.js (around line 600)

**Current Code (INCORRECT):**
```javascript
function saveApplication() {
  // build dto for server
  const dto = {
    name: appConfig.name,
    type: appConfig.type,
    configJson: JSON.stringify(appConfig)
  };
  createApp(dto)
    .then(created => {
      showAlert(`Application "${created.name}" created successfully!`, 'success');
      setTimeout(() => {
        navigateTo('applications');
        loadApplications();
      }, 1500);
    })
    .catch(err => {
      showAlert('Failed to save application: ' + err.message, 'error');
    });
}
```

**Updated Code (CORRECT - if creating in PingOne):**
```javascript
function saveApplication() {
  // Check if this is a SAML app to be created in PingOne
  if (appConfig.protocol === 'saml') {
    // Build SAML request for PingOne API
    const samlRequest = {
      name: appConfig.name,
      enabled: true,
      type: appConfig.type || "NATIVE_APP",
      protocol: "SAML",  // Uppercase for PingOne
      samlOptions: {
        spEntityId: appConfig.config.samlOptions.spEntityId,
        acsUrls: appConfig.config.samlOptions.acsUrls,
        nameIdFormat: appConfig.config.samlOptions.nameIdFormat,
        assertionDuration: appConfig.config.samlOptions.assertionDuration
      },
      description: appConfig.description
    };

    // Create in PingOne
    createSamlAppInPingOne(samlRequest)
      .then(created => {
        showAlert(`SAML application "${created.name}" created successfully in PingOne!`, 'success');
        setTimeout(() => {
          navigateTo('applications');
          loadApplications();
        }, 1500);
      })
      .catch(err => {
        showAlert('Failed to create SAML application in PingOne: ' + err.message, 'error');
      });
  } else {
    // Save locally (non-SAML)
    const dto = {
      name: appConfig.name,
      type: appConfig.type,
      configJson: JSON.stringify(appConfig)
    };
    createApp(dto)
      .then(created => {
        showAlert(`Application "${created.name}" created successfully!`, 'success');
        setTimeout(() => {
          navigateTo('applications');
          loadApplications();
        }, 1500);
      })
      .catch(err => {
        showAlert('Failed to save application: ' + err.message, 'error');
      });
  }
}

// New function to create SAML app in PingOne
async function createSamlAppInPingOne(samlRequest) {
  const token = API.csrfToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) headers['X-XSRF-TOKEN'] = token;

  const response = await fetch(API.BASE_URL + '/saml/create', {
    method: 'POST',
    credentials: 'include',
    headers: headers,
    body: JSON.stringify(samlRequest)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return await response.json();
}
```

---

## Update API Call in app.js (if needed)

The `API.request()` function should already work. However, ensure SAML endpoint is available:

**Check in app.js (around line 150):**
```javascript
// Should already exist, but verify:
API.createApplication = function(appData) {
  return this.request('POST', '/applications', appData);
};

// Add SAML-specific endpoint if not present:
API.createSamlApplication = function(samlData) {
  return this.request('POST', '/saml/create', samlData);
};
```

---

## Form Fields to Update (dashboard.html)

The form should collect these fields:

```html
<!-- Step 1: Basic Info (existing) -->
<input id="appName" placeholder="e.g., HR Portal">
<select id="appType">
  <option value="NATIVE_APP">Native App</option>
  <option value="WEB_APP">Web App</option>
</select>
<textarea id="appDescription" placeholder="Description"></textarea>
<input id="appUrl" type="url" placeholder="https://app.example.com">

<!-- Step 2: SAML Config (in modal) -->
<input id="samlIdpName" placeholder="e.g., Okta">
<input id="samlEntityId" placeholder="https://idp.example.com/entity">
<input id="samlSsoUrl" placeholder="https://idp.example.com/sso">
<input id="samlSloUrl" placeholder="https://idp.example.com/slo">
<textarea id="samlCertificate" placeholder="Certificate"></textarea>
<select id="samlNameIdFormat">
  <option value="email">EmailAddress</option>
  <option value="persistent">Persistent</option>
  <option value="transient">Transient</option>
  <option value="unspecified">Unspecified</option>
</select>
```

---

## Testing the Updated Code

### Step 1: Register & Login
```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

curl -c cookies.txt http://localhost:8080/csrf

curl -b cookies.txt -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123"
  }'
```

### Step 2: Open Dashboard
- Open browser to http://localhost:8080/dashboard.html
- Should be logged in (user name shown in top-right)

### Step 3: Create SAML App via UI
1. Click "Create Application"
2. Enter app details
3. Select "SAML 2.0" protocol
4. Fill SAML configuration form
5. Complete all 4 steps
6. Click "Deploy"

### Step 4: Check Logs
```bash
tail -f app.log | grep -i "saml\|pingone"
```

Should see:
```
INFO  - Creating SAML application in PingOne.
INFO  - Request: name=HR Portal, type=NATIVE_APP, protocol=SAML
INFO  - Application created in PingOne with ID: ...
```

### Step 5: Verify in PingOne
1. Log in to PingOne console
2. Go to Applications
3. Should see your new application listed

---

## Testing via cURL (Direct API)

```bash
# Create SAML app with correct format
curl -b cookies.txt -X POST http://localhost:8080/api/saml/create \
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
  }' -v
```

**Expected Response:**
```json
{
  "applicationId": "c82e3e6a-d1c3-4f4b-a2f0-8e8f4b2c1d9a",
  "samlMetadata": "{...}",
  "idpConfiguration": "{...}",
  "details": "{...}"
}
```

---

## Summary

| Component | Change | Result |
|-----------|--------|--------|
| validateSamlConfig() | Wrap config in samlOptions | ✅ Correct format sent |
| saveApplication() | Add PingOne-specific logic | ✅ Apps created in PingOne |
| API calls | Use /saml/create endpoint | ✅ Routes to correct backend |

---

**After these changes:**
- ✅ Form data wrapped in correct structure
- ✅ SAML options sent to backend properly
- ✅ Backend creates apps in PingOne successfully
- ✅ Apps visible in PingOne dashboard

---

