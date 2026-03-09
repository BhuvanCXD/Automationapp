// Dashboard Application Management Script

let currentStep = 1;
let appConfig = {
  name: '',
  type: '',
  protocol: '',
  description: '',
  url: '',
  config: {},
  accessRoles: []
};

function initializeDashboard() {
  loadUserInfo();
  loadApplications();
}

function loadUserInfo() {
  try {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      document.getElementById('userName').textContent = userData.email || userData.username || 'User';
    }
  } catch (error) {
    console.error('Failed to load user info:', error);
  }
}

function loadApplications() {
  const applications = [
    { id: 1, name: 'HR Portal', protocol: 'SAML', provider: 'Okta', status: 'Compliant', created: '2024-01-15' },
    { id: 2, name: 'MarketingApp', protocol: 'OAuth2', provider: 'Azure AD', status: 'Draft', created: '2024-02-01' },
    { id: 3, name: 'Finance API', protocol: 'OIDC', provider: 'Ping Identity', status: 'Compliant', created: '2024-01-20' },
    { id: 4, name: 'Support Portal', protocol: 'SAML', provider: 'Okta', status: 'Non-Compliant', created: '2024-02-10' },
    { id: 5, name: 'Internal Wiki', protocol: 'OAuth2', provider: 'Azure AD', status: 'Compliant', created: '2024-01-25' },
  ];

  displayApplications(applications);
}

function displayApplications(applications) {
  const container = document.getElementById('apps-table-container');
  
  if (applications.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No applications configured yet. Create one to get started.</p>';
    return;
  }

  let html = `
    <table class="table">
      <thead>
        <tr>
          <th>Application Name</th>
          <th>Protocol</th>
          <th>Provider</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  applications.forEach(app => {
    const statusClass = {
      'Compliant': 'status-compliant',
      'Draft': 'status-draft',
      'Non-Compliant': 'status-non-compliant',
      'Disabled': 'status-disabled'
    }[app.status] || 'status-draft';

    html += `
      <tr>
        <td style="font-weight: 600;">${app.name}</td>
        <td>${app.protocol}</td>
        <td>${app.provider}</td>
        <td><span class="table-status ${statusClass}">${app.status}</span></td>
        <td style="color: var(--text-secondary); font-size: 13px;">${app.created}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-icon btn-small" title="Edit" onclick="editApplication(${app.id})">✎</button>
            <button class="btn btn-icon btn-small" title="View Details" onclick="viewApplication(${app.id})">👁‍🗨</button>
            <button class="btn btn-icon btn-small" title="Delete" onclick="deleteApplication(${app.id})" style="color: var(--danger-color);">🗑</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function parseSamlXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');
  // parsing logic...
}

// --- Persistence API helpers (delegate to shared API client) ---
async function fetchApps() {
  return API.getApplications();
}

async function createApp(dto) {
  return API.createApplication(dto);
}

async function updateApp(id, dto) {
  return API.updateApplication(id, dto);
}

async function deleteApp(id) {
  return API.deleteApplication(id);
}

// Example wiring: load apps on dashboard ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const apps = await fetchApps();
    const listEl = document.getElementById('apps-list');
    if (listEl && Array.isArray(apps)) {
      listEl.innerHTML = apps.map(a => `<li data-id="${a.id}">${a.name} (${a.type})</li>`).join('');
    }
  } catch (e) {
    console.warn('Could not load apps', e);
  }
});

// Upload SAML metadata file to server-side import endpoint
async function uploadSamlMetadata(file, name) {
  const fm = new FormData();
  fm.append('file', file);
  if (name) fm.append('name', name);

  const token = API.csrfToken();
  const headers = {};
  if (token) headers['X-XSRF-TOKEN'] = token;

  const res = await fetch(window.location.origin + '/api/saml/import', {
    method: 'POST',
    credentials: 'include',
    headers: headers,
    body: fm
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'SAML import failed');
  }

  return res.json();
}

// wire upload UI
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('saml-upload-btn');
  const fileInput = document.getElementById('saml-file');
  const nameInput = document.getElementById('saml-name');
  const resultEl = document.getElementById('saml-result');
  if (!btn || !fileInput) return;

  btn.addEventListener('click', async () => {
    const files = fileInput.files;
    if (!files || files.length === 0) {
      resultEl.textContent = 'Select an XML metadata file first.';
      return;
    }
    const file = files[0];
    resultEl.textContent = 'Uploading...';
    try {
      const resp = await uploadSamlMetadata(file, nameInput.value.trim());
      resultEl.textContent = JSON.stringify(resp, null, 2);
      // refresh apps list
      try { const apps = await fetchApps(); /* optional UI update omitted for brevity */ } catch(e){}
    } catch (err) {
      resultEl.textContent = 'Error: ' + (err.message || err);
    }
  });
});

function navigateTo(view) {
  // Hide all views
  document.querySelectorAll('.view-content').forEach(el => {
    el.classList.add('hidden');
  });

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active');
  });

  // Show selected view
  const viewElement = document.getElementById(`view-${view}`);
  if (viewElement) {
    viewElement.classList.remove('hidden');
  }

  // Update active nav item
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.textContent.includes(view === 'applications' ? 'Applications' : 
        view === 'create-app' ? 'Create' : 'Settings')) {
      item.classList.add('active');
    }
  });

  // Reset form when creating new app
  if (view === 'create-app') {
    resetCreateAppForm();
  }
}

function resetCreateAppForm() {
  currentStep = 1;
  appConfig = {
    name: '',
    type: '',
    protocol: '',
    description: '',
    url: '',
    config: {},
    accessRoles: []
  };
  
  document.getElementById('appName').value = '';
  document.getElementById('appType').value = '';
  document.getElementById('appDescription').value = '';
  document.getElementById('appUrl').value = '';
  document.getElementById('selectedProtocol').value = '';

  // Reset stepper
  document.querySelectorAll('.step').forEach(el => {
    el.classList.remove('active', 'completed');
  });
  document.getElementById('step-1').classList.add('active');

  // Show step 1, hide others
  document.getElementById('step-1-content').classList.remove('hidden');
  document.getElementById('step-2-content').classList.add('hidden');
  document.getElementById('step-3-content').classList.add('hidden');
  document.getElementById('step-4-content').classList.add('hidden');
}

function selectProtocol(protocol) {
  const options = document.querySelectorAll('.protocol-option');
  options.forEach(opt => opt.classList.remove('selected'));

  event.target.closest('.protocol-option').classList.add('selected');
  document.getElementById('selectedProtocol').value = protocol;
  appConfig.protocol = protocol;
}

function proceedToConfiguration() {
  // Validate basic info
  const name = document.getElementById('appName').value.trim();
  const type = document.getElementById('appType').value;
  const protocol = document.getElementById('selectedProtocol').value;

  if (!name) {
    showAlert('Please enter an application name', 'error');
    return;
  }

  if (!type) {
    showAlert('Please select an application type', 'error');
    return;
  }

  if (!protocol) {
    showAlert('Please select an authentication protocol', 'error');
    return;
  }

  // Validate Application URL for SAML
  if (protocol === 'saml') {
    const appUrl = document.getElementById('appUrl').value.trim();
    if (!appUrl) {
      showAlert('Application URL is required for SAML applications', 'error');
      return;
    }
    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      showAlert('Application URL cannot use localhost. Please use a valid domain name for SAML applications.', 'error');
      return;
    }
  }

  appConfig.name = name;
  appConfig.type = type;
  appConfig.description = document.getElementById('appDescription').value;
  appConfig.url = document.getElementById('appUrl').value;

  // Show configuration modal based on protocol
  if (protocol === 'oauth-oidc') {
    openModal('oauth-oidc-config');
  } else if (protocol === 'saml') {
    // Pre-populate SAML fields with application URL
    if (appConfig.url) {
      document.getElementById('samlSpEntityId').value = appConfig.url;
      document.getElementById('samlAcsUrl').value = appConfig.url + '/saml/acs';
    }
    openModal('saml-config');
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('collapsed');
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// OAuth2/OIDC Configuration
function validateOAuthConfig() {
  const clientId = document.getElementById('oauthClientId').value.trim();
  const clientSecret = document.getElementById('oauthClientSecret').value.trim();
  const provider = document.getElementById('oauthProvider').value;

  if (!clientId || !clientSecret || !provider) {
    showAlert('Please fill all required OAuth fields', 'error');
    return;
  }

  appConfig.config = {
    provider: provider,
    clientId: clientId,
    clientSecret: clientSecret,
    discoveryUrl: document.getElementById('oauthDiscoveryUrl').value,
    authEndpoint: document.getElementById('oauthAuthEndpoint').value,
    tokenEndpoint: document.getElementById('oauthTokenEndpoint').value,
    redirectUri: document.getElementById('oauthRedirectUri').value,
    scopes: document.getElementById('oauthScopes').value
  };

  closeModal('oauth-oidc-config');
  showAlert('OAuth2/OIDC configuration validated successfully!', 'success');
  proceedToNextStep();
}

// SAML Configuration
function validateSamlConfig() {
  const spEntityId = document.getElementById('samlSpEntityId').value.trim();
  const acsUrl = document.getElementById('samlAcsUrl').value.trim();
  const nameIdFormatValue = document.getElementById('samlNameIdFormat').value.trim();
  const assertionDuration = parseInt(document.getElementById('samlAssertionDuration').value) || 3600;

  // Validate required fields
  if (!spEntityId) {
    showAlert('SP Entity ID is required', 'error');
    return;
  }

  if (!acsUrl) {
    showAlert('Assertion Consumer Service (ACS) URL is required', 'error');
    return;
  }

  // Validate URL formats
  try {
    new URL(spEntityId);
  } catch (e) {
    showAlert('SP Entity ID must be a valid URL', 'error');
    return;
  }

  try {
    new URL(acsUrl);
  } catch (e) {
    showAlert('ACS URL must be a valid URL', 'error');
    return;
  }

  // Validate that URLs are not localhost for production
  if (spEntityId.includes('localhost') || spEntityId.includes('127.0.0.1')) {
    showAlert('SP Entity ID cannot use localhost. Please use a valid domain name.', 'error');
    return;
  }

  if (acsUrl.includes('localhost') || acsUrl.includes('127.0.0.1')) {
    showAlert('ACS URL cannot use localhost. Please use a valid domain name.', 'error');
    return;
  }

  // For PingOne SAML application creation, we need SP configuration
  appConfig.config = {
    // Service Provider details
    spEntityId: spEntityId,
    acsUrl: acsUrl,
    nameIdFormat: nameIdFormatValue || "email",
    assertionDuration: assertionDuration
  };

  closeModal('saml-config');
  showAlert('SAML configuration validated successfully!', 'success');
  proceedToNextStep();
}

function proceedToNextStep() {
  currentStep++;

  if (currentStep > 4) {
    // Save application
    saveApplication();
  } else {
    updateStepper();
    showStepContent(currentStep);
  }
}

// render step content panels
function showStepContent(step) {
  // hide all
  document.getElementById('step-1-content').classList.add('hidden');
  document.getElementById('step-2-content').classList.add('hidden');
  document.getElementById('step-3-content').classList.add('hidden');
  document.getElementById('step-4-content').classList.add('hidden');

  if (step === 2) {
    const container = document.getElementById('step-2-content');
    container.innerHTML = `
      <h3>Configuration Summary</h3>
      <pre style="background:var(--bg-secondary);padding:12px;border-radius:6px;max-height:200px;overflow:auto;">
${JSON.stringify(appConfig.config,null,2)}
      </pre>
      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn btn-secondary" onclick="currentStep=1;updateStepper();showStepContent(1);">← Back</button>
        <button class="btn btn-primary" onclick="proceedToNextStep()">Continue →</button>
      </div>
    `;
    container.classList.remove('hidden');
  } else if (step === 3) {
    const container = document.getElementById('step-3-content');
    container.innerHTML = `
      <h3>Access Control</h3>
      <p>Select roles/groups that will have access to this application.</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <label><input type="checkbox" value="Admin"> Admin</label>
        <label><input type="checkbox" value="User"> User</label>
        <label><input type="checkbox" value="Guest"> Guest</label>
        <label><input type="checkbox" value="Manager"> Manager</label>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:12px;">
        <button class="btn btn-secondary" onclick="currentStep=2;updateStepper();showStepContent(2);">← Back</button>
        <button class="btn btn-primary" onclick="collectAccessRoles()">Continue →</button>
      </div>
    `;
    container.classList.remove('hidden');
  } else if (step === 4) {
    const container = document.getElementById('step-4-content');
    container.innerHTML = `
      <h3>Review & Deploy</h3>
      <p>Please review your application details before deployment.</p>
      <pre style="background:var(--bg-secondary);padding:12px;border-radius:6px;max-height:240px;overflow:auto;">
Name: ${appConfig.name}
Type: ${appConfig.type}
Protocol: ${appConfig.protocol}
Description: ${appConfig.description || '<none>'}
URL: ${appConfig.url || '<none>'}
Config: ${JSON.stringify(appConfig.config)}
Access Roles: ${Array.isArray(appConfig.accessRoles)?appConfig.accessRoles.join(', '):'<none>'}
      </pre>
      <div style="display:flex;justify-content:flex-end;gap:12px;">
        <button class="btn btn-secondary" onclick="currentStep=3;updateStepper();showStepContent(3);">← Back</button>
        <button class="btn btn-success" onclick="proceedToNextStep()">Deploy</button>
      </div>
    `;
    container.classList.remove('hidden');
  }
}

function collectAccessRoles() {
  const checked = Array.from(document.querySelectorAll('#step-3-content input[type="checkbox"]:checked'))
                       .map(cb => cb.value);
  appConfig.accessRoles = checked;
  proceedToNextStep();
}


function updateStepper() {
  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index < currentStep - 1) {
      step.classList.add('completed');
    } else if (index === currentStep - 1) {
      step.classList.add('active');
    }
  });
}

function saveApplication() {
  // If SAML protocol, create in PingOne via /saml/create endpoint
  if (appConfig.protocol === 'saml') {
    // Build SAML request matching PingOne API spec (top-level fields)
    // For creating an application IN PingOne, send only what PingOne expects
    const samlRequest = {
      name: appConfig.name,
      enabled: true,
      protocol: "SAML",
      description: appConfig.description,
      type: "WEB_APP",  // Required for SAML applications
      // PingOne SAML application needs SP configuration at top level
      spEntityId: appConfig.config.spEntityId,
      acsUrls: [appConfig.config.acsUrl],
      subjectNameIdFormat: appConfig.config.nameIdFormat === "email" ?
        "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" :
        appConfig.config.nameIdFormat,
      assertionDuration: appConfig.config.assertionDuration || 3600,
      signOnUrl: appConfig.config.signOnUrl || null
    };

    console.log('Creating SAML app in PingOne:', samlRequest);

    // POST to /api/saml/create endpoint
    createSamlAppInPingOne(samlRequest)
      .then(response => {
        console.log('SAML app created:', response);
        showAlert(`SAML application "${appConfig.name}" created successfully!`, 'success');
        setTimeout(() => {
          navigateTo('applications');
          loadApplications();
        }, 1500);
      })
      .catch(err => {
        console.error('Failed to create SAML app:', err);
        showAlert('Failed to create SAML application in PingOne: ' + err.message, 'error');
      });
  } else {
    // For non-SAML apps: save locally
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
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `HTTP ${response.status}` };
    }
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

function editApplication(id) {
  showAlert(`Edit functionality for application ${id} coming soon!`, 'info');
}

function viewApplication(id) {
  showAlert(`View details for application ${id} coming soon!`, 'info');
}

function deleteApplication(id) {
  if (confirm('Are you sure you want to delete this application?')) {
    showAlert('Application deleted successfully', 'success');
    loadApplications();
  }
}

function saveSettings() {
  const email = document.getElementById('settingsEmail').value;
  const name = document.getElementById('settingsName').value;
  const org = document.getElementById('settingsOrganization').value;

  if (!name) {
    showAlert('Please enter your display name', 'error');
    return;
  }

  showAlert('Settings saved successfully!', 'success');
}

// Tab button styling
const style = document.createElement('style');
style.textContent = `
  .tab-btn {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-secondary);
    padding: 12px 24px;
    cursor: pointer;
    font-weight: 600;
    transition: var(--transition);
  }

  .tab-btn:hover {
    color: var(--text-primary);
  }

  .tab-btn.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
  }
`;
document.head.appendChild(style);

// Utility function to show alerts
function showAlert(message, type = 'info') {
  const container = document.getElementById('alert-container');
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.cssText = 'display: flex; align-items: center; animation: slideInUp 0.3s ease;';

  const icon = {
    'success': '✓',
    'error': '✕',
    'warning': '⚠',
    'info': 'ℹ'
  }[type] || 'ℹ';

  alertDiv.innerHTML = `
    <span style="font-size: 18px;">${icon}</span>
    <span>${message}</span>
    <button style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: 18px;" onclick="this.parentElement.remove()">×</button>
  `;

  container.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

// Load settings when viewing settings tab
function loadSettings() {
  try {
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      document.getElementById('settingsEmail').value = userData.email || '';
      document.getElementById('settingsName').value = userData.displayName || userData.username || '';
      document.getElementById('settingsOrganization').value = userData.organization || '';
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Drag and drop for file upload
document.addEventListener('DOMContentLoaded', function() {
  const fileUpload = document.querySelector('.file-upload');
  if (fileUpload) {
    fileUpload.addEventListener('dragover', function(e) {
      e.preventDefault();
      fileUpload.style.borderColor = 'var(--primary-color)';
      fileUpload.style.background = 'rgba(59, 130, 246, 0.1)';
    });

    fileUpload.addEventListener('dragleave', function(e) {
      e.preventDefault();
      fileUpload.style.borderColor = '';
      fileUpload.style.background = '';
    });

    fileUpload.addEventListener('drop', function(e) {
      e.preventDefault();
      fileUpload.style.borderColor = '';
      fileUpload.style.background = '';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
          const event = new Event('change');
          event.target = { files: files };
          handleSamlXmlUpload(event);
        } else {
          showAlert('Please upload a valid XML file', 'error');
        }
      }
    });
  }
});
