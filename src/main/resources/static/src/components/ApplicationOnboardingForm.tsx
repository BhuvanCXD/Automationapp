import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ApplicationOnboardingFormProps {
  onBack: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
}

interface FormData {
  applicationName: string;
  protocol: 'OIDC' | 'SAML' | 'OAuth2';
  identityProvider: string;
  accessType: 'ALL_USERS' | 'GROUP';
  groupName: string;
  
  // OIDC Fields
  redirectUri: string;
  postLogoutRedirectUri: string;
  scopes: string;
  grantTypes: string;
  
  // SAML Fields
  entityId: string;
  acsUrl: string;
}

export const ApplicationOnboardingForm: React.FC<ApplicationOnboardingFormProps> = ({ 
  onBack, 
  onSuccess,
  isDarkMode = true 
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [form, setForm] = useState<FormData>({
    applicationName: '',
    protocol: 'OIDC',
    identityProvider: 'PingOne',
    accessType: 'ALL_USERS',
    groupName: '',
    redirectUri: '',
    postLogoutRedirectUri: '',
    scopes: 'openid,profile,email',
    grantTypes: 'authorization_code,refresh_token',
    entityId: '',
    acsUrl: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value as any
    }));
  };

  const validateStep1 = () => {
    if (!form.applicationName.trim()) {
      setMessage('Application Name is required');
      setIsError(true);
      return false;
    }
    if (form.accessType === 'GROUP' && !form.groupName.trim()) {
      setMessage('Group Name is required when selecting GROUP access');
      setIsError(true);
      return false;
    }
    setIsError(false);
    return true;
  };

  const validateStep2 = () => {
    if (form.protocol === 'SAML') {
      if (!form.entityId.trim()) {
        setMessage('Entity ID is required for SAML');
        setIsError(true);
        return false;
      }
      if (!form.acsUrl.trim()) {
        setMessage('ACS URL is required for SAML');
        setIsError(true);
        return false;
      }
    } else {
      if (!form.redirectUri.trim()) {
        setMessage('Redirect URI is required for OIDC/OAuth2');
        setIsError(true);
        return false;
      }
    }
    setIsError(false);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const payload = {
        applicationName: form.applicationName,
        protocol: form.protocol,
        identityProvider: form.identityProvider,
        accessType: form.accessType,
        groupName: form.groupName || null,
        redirectUri: form.redirectUri || null,
        postLogoutRedirectUri: form.postLogoutRedirectUri || null,
        scopes: form.scopes || null,
        grantTypes: form.grantTypes || null,
        entityId: form.entityId || null,
        acsUrl: form.acsUrl || null,
      };

      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to onboard application');
      }

      setResult(data);
      setMessage('✓ Application onboarded successfully!');
      setIsError(false);
      setStep(3);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'An error occurred');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 rounded-xl shadow-2xl ${isDarkMode ? 'bg-[#18181b] border border-white/10' : 'bg-white border border-gray-200'}`}>
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className={`flex items-center gap-2 mb-4 text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {step === 1 && 'Application Details'}
          {step === 2 && 'Protocol Configuration'}
          {step === 3 && 'Success!'}
        </h2>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
          isError 
            ? isDarkMode ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'bg-red-50 text-red-700 border border-red-200'
            : isDarkMode ? 'bg-green-500/10 text-green-300 border border-green-500/30' : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="text-sm">{message}</span>
        </div>
      )}

      {/* Step 1 - Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Application Name *
            </label>
            <input
              type="text"
              value={form.applicationName}
              onChange={(e) => handleInputChange('applicationName', e.target.value)}
              placeholder="e.g., Jira, Salesforce, ServiceNow"
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Identity Provider *
            </label>
            <select
              value={form.identityProvider}
              onChange={(e) => handleInputChange('identityProvider', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option>PingOne</option>
              <option>Okta</option>
              <option>Azure AD</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Protocol *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['OIDC', 'SAML', 'OAuth2'] as const).map((proto) => (
                <button
                  key={proto}
                  onClick={() => handleInputChange('protocol', proto)}
                  className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                    form.protocol === proto
                      ? isDarkMode ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-500 text-blue-600'
                      : isDarkMode ? 'border-white/10 text-gray-400 hover:border-white/20' : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {proto}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Access Strategy *
            </label>
            <select
              value={form.accessType}
              onChange={(e) => handleInputChange('accessType', e.target.value as 'ALL_USERS' | 'GROUP')}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            >
              <option value="ALL_USERS">All Users</option>
              <option value="GROUP">Specific Group</option>
            </select>
          </div>

          {form.accessType === 'GROUP' && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Group Name *
              </label>
              <input
                type="text"
                value={form.groupName}
                onChange={(e) => handleInputChange('groupName', e.target.value)}
                placeholder="e.g., app-users-grp"
                className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
              />
            </div>
          )}

          <button
            onClick={() => {
              if (validateStep1()) {
                setStep(2);
              }
            }}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Next: Configure Protocol
          </button>
        </div>
      )}

      {/* Step 2 - Protocol Configuration */}
      {step === 2 && (
        <div className="space-y-6">
          {form.protocol === 'SAML' ? (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Entity ID *
                </label>
                <input
                  type="text"
                  value={form.entityId}
                  onChange={(e) => handleInputChange('entityId', e.target.value)}
                  placeholder="e.g., urn:example:app"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ACS URL *
                </label>
                <input
                  type="url"
                  value={form.acsUrl}
                  onChange={(e) => handleInputChange('acsUrl', e.target.value)}
                  placeholder="https://yourapp.com/saml/acs"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Redirect URI *
                </label>
                <input
                  type="url"
                  value={form.redirectUri}
                  onChange={(e) => handleInputChange('redirectUri', e.target.value)}
                  placeholder="https://yourapp.com/callback"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Post Logout Redirect URI
                </label>
                <input
                  type="url"
                  value={form.postLogoutRedirectUri}
                  onChange={(e) => handleInputChange('postLogoutRedirectUri', e.target.value)}
                  placeholder="https://yourapp.com/logout"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Scopes
                </label>
                <input
                  type="text"
                  value={form.scopes}
                  onChange={(e) => handleInputChange('scopes', e.target.value)}
                  placeholder="openid,profile,email"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Grant Types
                </label>
                <input
                  type="text"
                  value={form.grantTypes}
                  onChange={(e) => handleInputChange('grantTypes', e.target.value)}
                  placeholder="authorization_code,refresh_token"
                  className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-[#27272a] border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400'}`}
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Creating...' : 'Create Application'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Success */}
      {step === 3 && (
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl mb-4">✓</div>
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            Application Created Successfully!
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {form.applicationName} has been provisioned to {form.identityProvider}.
          </p>
          {result && (
            <div className={`mt-6 p-4 rounded-lg text-left text-xs font-mono ${isDarkMode ? 'bg-[#27272a] text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <div>Status: {result.status}</div>
              <div>Message: {result.message}</div>
            </div>
          )}
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Redirecting to dashboard...
          </p>
        </div>
      )}
    </div>
  );
};
