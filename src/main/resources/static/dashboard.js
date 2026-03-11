/**
 * Dashboard Logic — Cyber X Delta
 * Handles: App list, View Details Modal, Delete, Wizard, Profile
 */

const WizardState = {
  step: 1,
  data: {
    applicationName: '',
    protocol: 'OIDC',
    identityProvider: 'PingOne',
    accessType: 'ALL_USERS',
    groupName: '',
    // OIDC / OAuth2
    discoveryUrl: '',
    clientId: '',
    clientSecret: '',
    scopes: 'openid profile email',
    grantTypes: 'authorization_code',
    redirectUri: '',
    postLogoutRedirectUri: '',
    // SAML
    entityId: '',
    acsUrl: '',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  }
};

// ─── Bootstrap ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (!Utils.isAuthenticated()) {
    window.location.href = '/login.html';
    return;
  }
  setView('list');
});

// ─── Navigation ────────────────────────────────────────────────────────────

function setView(view) {
  // Hide all sections
  document.querySelectorAll('section[id^="view-"]').forEach(s => s.classList.add('hidden'));

  // De-activate all nav items
  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.remove('bg-[#f4f4f5]', 'text-black', 'font-semibold', 'shadow-md', 'shadow-white/5', 'active');
    i.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
  });

  const section = document.getElementById('view-' + view);
  if (section) section.classList.remove('hidden');

  const nav = document.getElementById('nav-' + view);
  if (nav) {
    nav.classList.add('bg-[#f4f4f5]', 'text-black', 'font-semibold', 'shadow-md', 'shadow-white/5', 'active');
    nav.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
  }

  if (view === 'create') renderWizardStep(1);
  else if (view === 'list') loadAssets();
  else if (view === 'profile') loadProfile();
}

// ─── Asset List ────────────────────────────────────────────────────────────

async function loadAssets() {
  const tableBody = document.getElementById('app-table-body');
  if (!tableBody) return;
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="py-10 text-center text-gray-500">
        <div class="flex flex-col items-center gap-2">
          <i data-lucide="loader-2" class="w-6 h-6 animate-spin"></i>
          <span>Loading applications...</span>
        </div>
      </td>
    </tr>`;
  lucide.createIcons();

  try {
    const assets = await API.getAssets();
    renderAssets(assets);
  } catch (error) {
    console.error('Failed to load assets:', error);
    tableBody.innerHTML = `<tr><td colspan="5" class="py-10 text-center text-red-400">Error loading data. ${error.message || ''}</td></tr>`;
  }
}

function renderAssets(assets) {
  const tableBody = document.getElementById('app-table-body');
  if (!tableBody) return;

  if (!assets || assets.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="py-10 text-center text-gray-500">No applications found. Click "Create New App" to begin.</td></tr>`;
    return;
  }

  tableBody.innerHTML = assets.map(asset => `
    <tr class="transition-colors group cursor-pointer hover:bg-white/5" onclick="viewDetails(${asset.id}, event)">
      <td class="py-3 px-6 text-sm font-medium text-gray-200">${asset.applicationName || 'Unnamed'}</td>
      <td class="py-3 px-6 text-sm text-gray-300">
        <span class="px-2 py-0.5 rounded border border-white/5 bg-[#27272a] text-[10px] font-bold uppercase tracking-wider text-gray-400">
          ${asset.protocol || 'OIDC'}
        </span>
      </td>
      <td class="py-3 px-6 text-sm text-gray-300">${asset.identityProvider || 'PingOne'}</td>
      <td class="py-3 px-6">
        <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-[#dcfce7] text-[#15803d]">Active</span>
      </td>
      <td class="py-3 px-6">
        <div class="flex items-center justify-end gap-3 pr-4 opacity-70 group-hover:opacity-100 transition-opacity text-white">
          <button title="View Details" onclick="viewDetails(${asset.id}, event)" class="hover:text-blue-400 transition-colors">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          <button title="Delete" onclick="deleteAsset(${asset.id}, event)" class="hover:text-red-400 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  lucide.createIcons();
}

// ─── View Details Modal ─────────────────────────────────────────────────────

async function viewDetails(id, event) {
  if (event) event.stopPropagation();
  const modal = document.getElementById('details-modal');
  const container = document.getElementById('modal-config-container');
  if (!modal || !container) return;

  container.innerHTML = '<div class="flex items-center gap-2 text-gray-500"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Loading...</div>';
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  lucide.createIcons();

  try {
    const asset = await API.getAsset(id);
    document.getElementById('modal-app-name').textContent = asset.applicationName || 'Application';
    document.getElementById('modal-app-protocol').textContent = (asset.protocol || 'OIDC') + ' 2.0';
    document.getElementById('modal-access-type').textContent = asset.accessType || 'ALL_USERS';
    document.getElementById('modal-group-name').textContent = asset.groupName ? `(Group: ${asset.groupName})` : '';
    document.getElementById('modal-operator').textContent = asset.username || 'admin';
    document.getElementById('modal-date').textContent = new Date(asset.provisionedAt || Date.now()).toLocaleDateString();

    document.getElementById('modal-delete-btn').onclick = (e) => deleteAsset(id, e, true);

    const isSAML = (asset.protocol || '').toUpperCase() === 'SAML';
    const fields = isSAML
      ? { 'Entity ID': asset.entityId, 'ACS URL': asset.acsUrl, 'NameID Format': asset.nameIdFormat }
      : { 'Discovery URL': asset.discoveryUrl, 'Client ID': asset.clientId, 'Redirect URI': asset.redirectUri, 'Scopes': asset.scopes };

    container.innerHTML = Object.entries(fields).map(([label, val]) => `
      <div class="space-y-1">
        <label class="text-[10px] uppercase font-bold text-gray-500 tracking-wider">${label}</label>
        <div class="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-sm text-gray-300 font-mono break-all">${val || 'N/A'}</div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="text-red-400">Error loading details: ${e.message}</div>`;
  }
}

function closeDetails() {
  const modal = document.getElementById('details-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ─── Delete Asset ───────────────────────────────────────────────────────────

async function deleteAsset(id, event, fromModal = false) {
  if (event) event.stopPropagation();
  if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;

  try {
    await API.deleteAsset(id);
    if (fromModal) closeDetails();
    await loadAssets();
  } catch (e) {
    alert('Delete failed: ' + e.message);
  }
}

// ─── Profile ────────────────────────────────────────────────────────────────

async function loadProfile() {
  try {
    const profile = await API.getProfile();
    const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.username;
    document.getElementById('profile-display-name').textContent = displayName;
    document.getElementById('profile-display-role').textContent =
      (profile.role === 'ROLE_ADMIN') ? 'Super Administrator' : 'Security Operator';
    document.getElementById('profile-username').value = profile.username || '';
    document.getElementById('profile-email').value = profile.email || '';
    document.getElementById('profile-firstname').value = profile.firstName || '';
    document.getElementById('profile-lastname').value = profile.lastName || '';
  } catch (e) {
    console.error('Profile load failed', e);
  }
}

async function saveProfile() {
  const data = {
    email: document.getElementById('profile-email').value,
    firstName: document.getElementById('profile-firstname').value,
    lastName: document.getElementById('profile-lastname').value,
  };
  try {
    await API.updateProfile(data);
    alert('Profile updated successfully!');
    loadProfile();
  } catch (e) {
    alert('Update failed: ' + e.message);
  }
}

// ─── Wizard ─────────────────────────────────────────────────────────────────

function renderWizardStep(step) {
  WizardState.step = step;
  const container = document.getElementById('view-create');
  if (!container) return;

  const renderers = { 1: renderStep1, 2: renderStep2, 3: renderStep3, 4: renderStep4 };
  container.innerHTML = (renderers[step] || renderStep1)();
  lucide.createIcons();
}

function renderStep1() {
  return `
    <div class="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in text-white">
      ${renderStepper(1)}
      <div class="flex-1 min-h-0 flex flex-col border border-white/10 rounded-xl shadow-2xl overflow-hidden bg-[#18181b]">
        <div class="p-4 border-b border-white/5 bg-[#222225]">
          <h2 class="text-lg font-bold mb-1">Setup Your Connection</h2>
          <p class="text-xs text-gray-400">Select a provider and protocol for your application</p>
        </div>
        <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-300">Identity Provider</label>
              <select id="identity-provider" class="w-full border border-gray-700 bg-[#27272a] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm">
                <option value="PingOne">PingOne (Integrated)</option>
                <option value="Okta">Okta</option>
                <option value="Auth0">Auth0</option>
                <option value="AzureAD">Azure AD</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-300">Application Name</label>
              <input type="text" id="app-name-input" placeholder="e.g. My Secure App" value="${WizardState.data.applicationName}"
                class="w-full border border-gray-700 bg-[#27272a] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm">
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-base font-bold">Select Authentication Protocol</h3>
            <div class="grid grid-cols-1 gap-3">
              ${renderProtocolCard('SAML', 'SAML', 'Enterprise-grade single sign-on with XML-based authentication.', 'shield', 'bg-blue-500/10 border-blue-500/50')}
              ${renderProtocolCard('OIDC', 'OIDC / OAuth 2.0', 'Modern authentication layer built on OAuth 2.0 with identity tokens.', 'lock', 'bg-emerald-500/10 border-emerald-500/50')}
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-white/5 flex justify-between items-center bg-[#222225]">
          <button onclick="setView('list')" class="font-medium px-4 py-2 text-xs uppercase tracking-wide text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button onclick="wizardNext(1)" class="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            Continue <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function renderStep2() {
  const isSAML = WizardState.data.protocol === 'SAML';
  return `
    <div class="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in text-white">
      ${renderStepper(2)}
      <div class="flex-1 min-h-0 flex flex-col border border-white/10 rounded-xl shadow-2xl overflow-hidden bg-[#18181b]">
        <div class="p-6 border-b border-white/5 bg-[#222225]">
          <h2 class="text-lg font-bold mb-1">${isSAML ? 'SAML' : 'OIDC / OAuth 2.0'} Settings</h2>
          <p class="text-sm text-gray-400">Configure the protocol-specific details for your application.</p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          ${isSAML ? renderSamlFields() : renderOidcFields()}
        </div>
        <div class="p-4 border-t border-white/5 flex justify-between items-center bg-[#222225]">
          <button onclick="renderWizardStep(1)" class="flex items-center gap-2 font-medium px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back
          </button>
          <button onclick="wizardNext(2)" class="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            Continue <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function renderStep3() {
  return `
    <div class="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in text-white">
      ${renderStepper(3)}
      <div class="flex-1 min-h-0 flex flex-col border border-white/10 rounded-xl shadow-2xl overflow-hidden bg-[#18181b]">
        <div class="p-6 border-b border-white/5 bg-[#222225]">
          <h2 class="text-lg font-bold mb-1">Access &amp; Assignment</h2>
          <p class="text-sm text-gray-400">Who should have access to this application?</p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${renderAccessCard('ALL_USERS', 'All Users', 'ShieldCheck', 'All authenticated users will have access.')}
            ${renderAccessCard('GROUP', 'Specific Group', 'Users', 'Only users in the chosen group will have access.')}
            ${renderAccessCard('ADMIN', 'Admin Approval', 'UserCheck', 'Each access request requires manual approval.')}
          </div>
          <div id="group-selection" class="${WizardState.data.accessType === 'GROUP' ? '' : 'hidden'} space-y-4">
            <label class="text-xs font-semibold uppercase tracking-wider text-gray-300">Target Group Name</label>
            <input type="text" id="group-name-input" placeholder="e.g. Engineering" value="${WizardState.data.groupName}"
              class="w-full border border-gray-700 bg-[#27272a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm">
            <div class="flex flex-wrap gap-2">
              <span class="text-[10px] text-gray-500 uppercase font-bold w-full">Common Groups</span>
              ${['DevOps Engineers', 'Security Ops', 'Frontend Team', 'Backend Services', 'QA Automation'].map(g => `
                <button onclick="setGroupName('${g}')" class="px-3 py-1.5 rounded-md border border-white/5 bg-[#222225] text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all">${g}</button>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-white/5 flex justify-between items-center bg-[#222225]">
          <button onclick="renderWizardStep(2)" class="flex items-center gap-2 font-medium px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back
          </button>
          <button onclick="wizardNext(3)" class="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wide bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
            Continue to Review <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    </div>`;
}

function renderStep4() {
  const d = WizardState.data;
  return `
    <div class="h-full w-full flex flex-col p-4 max-w-[98%] mx-auto animate-fade-in text-white">
      ${renderStepper(4)}
      <div class="flex-1 min-h-0 flex flex-col border border-white/10 rounded-xl shadow-2xl overflow-hidden bg-[#18181b]">
        <div class="p-6 border-b border-white/5 bg-[#222225]">
          <h2 class="text-lg font-bold mb-1">Final Review</h2>
          <p class="text-sm text-gray-400">Verify all settings before deploying to PingOne.</p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div class="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[#27272a]/50 border border-white/5">
            <div>
              <span class="text-[10px] uppercase text-gray-500 block mb-1">Application Name</span>
              <span class="font-bold text-lg">${d.applicationName}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase text-gray-500 block mb-1">Protocol</span>
              <span class="font-bold text-lg text-blue-400">${d.protocol === 'SAML' ? 'SAML' : 'OIDC / OAuth 2.0'}</span>
            </div>
            <div class="col-span-2 border-t border-white/5 pt-4">
              <span class="text-[10px] uppercase text-gray-500 block mb-1">Identity Provider</span>
              <span class="font-medium">${d.identityProvider}</span>
            </div>
            <div class="col-span-2 border-t border-white/5 pt-4">
              <span class="text-[10px] uppercase text-gray-500 block mb-1">Access Control</span>
              <span class="font-medium">${d.accessType}${d.groupName ? ' — ' + d.groupName : ''}</span>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-white/5 flex justify-between items-center bg-[#222225]">
          <button onclick="renderWizardStep(3)" class="flex items-center gap-2 font-medium px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i> Back
          </button>
          <button onclick="deployAsset()" id="deploy-btn" class="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wide bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20">
            <i data-lucide="rocket" class="w-4 h-4"></i> Deploy Application
          </button>
        </div>
      </div>
    </div>`;
}

// ─── Wizard Helpers ──────────────────────────────────────────────────────────

function renderStepper(activeStep) {
  const steps = [
    { num: 1, label: 'Provider' },
    { num: 2, label: 'Settings' },
    { num: 3, label: 'Access' },
    { num: 4, label: 'Review' },
  ];
  return `
    <div class="relative w-full max-w-2xl mx-auto mb-8 px-4">
      <div class="absolute top-4 left-4 right-4 h-[1px] -z-10 bg-gray-800"></div>
      <div class="flex justify-between items-start">
        ${steps.map(s => {
          const isCompleted = s.num < activeStep;
          const isActive = s.num === activeStep;
          let cls = isCompleted
            ? 'bg-[#1e293b] border-blue-500/50 text-blue-400'
            : isActive
            ? 'bg-[#1e293b] border-blue-500/30 text-white shadow-blue-900/20'
            : 'bg-[#27272a] border-gray-700 text-gray-400';
          return `
            <div class="relative flex flex-col items-center">
              ${isActive ? '<div class="absolute -inset-4 bg-blue-500/5 rounded-xl border border-blue-500/10 -z-10"></div>' : ''}
              <div class="w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs mb-2 ${cls}">${s.num}</div>
              <span class="text-[10px] font-semibold ${isActive ? 'text-white' : 'text-gray-500'}">${s.label}</span>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderProtocolCard(id, title, desc, icon, activeBorder) {
  const isSelected = WizardState.data.protocol === id;
  const border = isSelected ? activeBorder : 'border-white/5 bg-[#27272a]/50';
  return `
    <button onclick="selectProtocol('${id}')" class="w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-4 ${border} hover:border-white/20">
      <div class="p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-[#3f3f46] text-gray-400'}">
        <i data-lucide="${icon}" class="w-5 h-5"></i>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center mb-0.5">
          <span class="font-bold text-base ${isSelected ? 'text-blue-400' : 'text-white'}">${title}</span>
          <span class="px-2 py-0.5 rounded border border-white/5 bg-[#18181b] text-[10px] font-bold uppercase text-gray-500">
            ${id === 'SAML' ? 'Enterprise' : 'Modern'}
          </span>
        </div>
        <p class="text-xs text-gray-400">${desc}</p>
      </div>
    </button>`;
}

function renderAccessCard(id, title, icon, desc) {
  const isSelected = WizardState.data.accessType === id;
  return `
    <button onclick="selectAccessType('${id}')" class="text-left p-4 rounded-xl border transition-all duration-200 flex flex-col items-start ${isSelected ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-900/10' : 'bg-[#222225] border-white/5 hover:border-white/10'}">
      <i data-lucide="${icon}" class="w-5 h-5 mb-3 ${isSelected ? 'text-blue-400' : 'text-gray-500'}"></i>
      <h4 class="text-sm font-bold mb-2">${title}</h4>
      <p class="text-xs text-gray-400 leading-relaxed">${desc}</p>
    </button>`;
}

function renderSamlFields() {
  return `
    <div class="space-y-6">
      <div class="flex justify-between items-center mb-1">
        <span class="text-[10px] text-gray-500 uppercase font-bold">Manual Configuration</span>
        <input type="file" id="metadata-import-input" class="hidden" accept=".xml" onchange="handleMetadataImport(event)">
        <button onclick="document.getElementById('metadata-import-input').click()" class="text-[10px] text-blue-400 font-bold uppercase hover:text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded">Import XML Metadata</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${renderField('entityId', 'Entity ID / Audience', 'https://sp.example.com/saml/metadata')}
        ${renderField('acsUrl', 'ACS URL', 'https://sp.example.com/saml/acs')}
      </div>
      <div class="space-y-1.5">
        <label class="text-xs font-semibold uppercase tracking-wider text-gray-300">NameID Format</label>
        <select onchange="updateWizardData('nameIdFormat', this.value)" class="w-full border border-gray-700 bg-[#27272a] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm">
          <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" ${WizardState.data.nameIdFormat.includes('emailAddress') ? 'selected' : ''}>Email Address</option>
          <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent" ${WizardState.data.nameIdFormat.includes('persistent') ? 'selected' : ''}>Persistent</option>
          <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient" ${WizardState.data.nameIdFormat.includes('transient') ? 'selected' : ''}>Transient</option>
          <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" ${WizardState.data.nameIdFormat.includes('unspecified') ? 'selected' : ''}>Unspecified</option>
        </select>
      </div>
    </div>`;
}

function renderOidcFields() {
  return `
    <div class="space-y-6">
      ${renderField('discoveryUrl', 'OIDC Discovery Document URL', 'https://example.com/.well-known/openid-configuration')}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${renderField('clientId', 'Client ID', 'Enter Client ID')}
        ${renderField('clientSecret', 'Client Secret', 'Enter Client Secret')}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${renderField('grantTypes', 'Grant Types', 'authorization_code')}
        ${renderField('scopes', 'Scopes', 'openid profile email')}
      </div>
      ${renderField('redirectUri', 'Redirect URI', 'https://app/callback')}
      ${renderField('postLogoutRedirectUri', 'Post-Logout Redirect URI', 'https://app/logout')}
    </div>`;
}

function renderField(key, label, placeholder) {
  return `
    <div class="space-y-1.5">
      <label class="text-xs font-semibold uppercase tracking-wider text-gray-300">${label}</label>
      <input type="text" id="field-${key}" onchange="updateWizardData('${key}', this.value)" placeholder="${placeholder}" value="${WizardState.data[key] || ''}"
        class="w-full border border-gray-700 bg-[#27272a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm placeholder-gray-600">
    </div>`;
}

// ─── Wizard Actions ──────────────────────────────────────────────────────────

function selectProtocol(p) {
  WizardState.data.protocol = p;
  renderWizardStep(1);
}

function selectAccessType(t) {
  WizardState.data.accessType = t;
  const grpSel = document.getElementById('group-selection');
  if (grpSel) grpSel.classList.toggle('hidden', t !== 'GROUP');
  // Re-render to update selection highlights
  renderWizardStep(3);
}

function setGroupName(name) {
  const input = document.getElementById('group-name-input');
  if (input) { input.value = name; WizardState.data.groupName = name; }
}

function updateWizardData(key, val) {
  WizardState.data[key] = val;
}

function wizardNext(current) {
  if (current === 1) {
    const nameInput = document.getElementById('app-name-input');
    if (!nameInput || !nameInput.value.trim()) {
      alert('Application name is required.');
      return;
    }
    WizardState.data.applicationName = nameInput.value.trim();
    WizardState.data.identityProvider = document.getElementById('identity-provider').value;
  }
  if (current === 2) {
    if (WizardState.data.protocol === 'SAML') {
      if (!document.getElementById('field-entityId').value.trim()) { alert('Entity ID is required.'); return; }
      if (!document.getElementById('field-acsUrl').value.trim()) { alert('ACS URL is required.'); return; }
      updateWizardData('entityId', document.getElementById('field-entityId').value);
      updateWizardData('acsUrl', document.getElementById('field-acsUrl').value);
    } else {
      const fields = ['discoveryUrl','clientId','clientSecret','grantTypes','scopes','redirectUri','postLogoutRedirectUri'];
      fields.forEach(k => {
        const el = document.getElementById('field-' + k);
        if (el) updateWizardData(k, el.value);
      });
    }
  }
  if (current === 3) {
    const grp = document.getElementById('group-name-input');
    if (WizardState.data.accessType === 'GROUP' && grp) {
      WizardState.data.groupName = grp.value.trim();
    }
  }
  renderWizardStep(current + 1);
}

async function deployAsset() {
  const btn = document.getElementById('deploy-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Provisioning...'; lucide.createIcons(); }

  try {
    await API.onboardApplication(WizardState.data);
    renderSuccessScreen();
  } catch (e) {
    alert('Onboarding failed: ' + e.message);
    if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="rocket" class="w-4 h-4"></i> Deploy Application'; lucide.createIcons(); }
  }
}

function renderSuccessScreen() {
  const container = document.getElementById('view-create');
  if (!container) return;
  container.innerHTML = `
    <div class="h-full w-full flex flex-col items-center justify-center p-4 max-w-2xl mx-auto animate-fade-in text-white text-center">
      <div class="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <i data-lucide="check-circle-2" class="w-10 h-10 text-green-500"></i>
      </div>
      <h1 class="text-3xl font-bold mb-4 font-outfit">Deployment Successful</h1>
      <p class="text-gray-400 text-lg mb-8 leading-relaxed">
        Application <span class="text-white font-bold">'${WizardState.data.applicationName}'</span> has been deployed to PingOne.
      </p>
      <div class="grid grid-cols-2 gap-4 w-full mb-10">
        <div class="bg-[#18181b] border border-white/5 p-4 rounded-xl">
          <span class="text-[10px] text-gray-500 uppercase font-bold block mb-1">Protocol</span>
          <span class="text-blue-400 font-bold">${WizardState.data.protocol} 2.0</span>
        </div>
        <div class="bg-[#18181b] border border-white/5 p-4 rounded-xl">
          <span class="text-[10px] text-gray-500 uppercase font-bold block mb-1">Provider</span>
          <span class="text-purple-400 font-bold">${WizardState.data.identityProvider}</span>
        </div>
      </div>
      <button onclick="setView('list')" class="px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-xl shadow-white/5">
        Return to Dashboard
      </button>
    </div>`;
  lucide.createIcons();
}

// ─── SAML Metadata Import ────────────────────────────────────────────────────

function handleMetadataImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
      const entityDescriptor = xmlDoc.getElementsByTagNameNS('*', 'EntityDescriptor')[0];
      const entityId = entityDescriptor ? entityDescriptor.getAttribute('entityID') : '';
      const assertionService = xmlDoc.getElementsByTagNameNS('*', 'AssertionConsumerService')[0];
      const acsUrl = assertionService ? assertionService.getAttribute('Location') : '';
      if (entityId) { WizardState.data.entityId = entityId; const el = document.getElementById('field-entityId'); if (el) el.value = entityId; }
      if (acsUrl) { WizardState.data.acsUrl = acsUrl; const el = document.getElementById('field-acsUrl'); if (el) el.value = acsUrl; }
      alert('Metadata imported: ' + (entityId || 'Unknown Entity'));
    } catch (err) {
      alert('Failed to parse SAML metadata.');
    }
  };
  reader.readAsText(file);
}
