import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2, AlertCircle, ListTree, Fingerprint, Plus, Trash2, ShieldCheck, ChevronUp, ChevronDown, GripVertical, Layout, ArrowLeft } from 'lucide-react';

interface MappingPair {
  id: string;
  idpAttribute: string;
  spAttribute: string;
}

interface SAMLConfigurationProps {
  onBack: () => void;
  onContinue: (data: any) => void;
}

const COMMON_IDP_ATTRIBUTES = [
  "email",
  "firstName",
  "lastName",
  "displayName",
  "username",
  "userId",
  "groups",
  "userPrincipalName",
  "objectId",
  "department",
  "title",
  "memberOf"
];

const COMMON_SP_ATTRIBUTES = [
  "email",
  "firstName",
  "lastName",
  "username",
  "displayName",
  "groups",
  "externalId",
  "roles",
  "uid"
];

export const SAMLConfiguration: React.FC<SAMLConfigurationProps> = ({ onBack, onContinue }) => {
  const [importMode, setImportMode] = useState(false);
  const [metadataXml, setMetadataXml] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Core Fields
  const [appName, setAppName] = useState('');
  const [entityId, setEntityId] = useState('');
  const [acsUrl, setAcsUrl] = useState('');
  const [certificate, setCertificate] = useState('');
  const [nameIdFormat, setNameIdFormat] = useState('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress');
  
  // Structured Attribute Mapping
  const [mappings, setMappings] = useState<MappingPair[]>([
    { id: '1', idpAttribute: 'email', spAttribute: 'email' },
    { id: '2', idpAttribute: 'firstName', spAttribute: 'firstName' },
    { id: '3', idpAttribute: 'lastName', spAttribute: 'lastName' }
  ]);

  const addMapping = () => {
    setMappings([...mappings, { id: Date.now().toString(), idpAttribute: '', spAttribute: '' }]);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const updateMapping = (id: string, field: 'idpAttribute' | 'spAttribute', value: string) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const moveMapping = (index: number, direction: 'up' | 'down') => {
    const newMappings = [...mappings];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newMappings.length) {
      [newMappings[index], newMappings[targetIndex]] = [newMappings[targetIndex], newMappings[index]];
      setMappings(newMappings);
    }
  };

  const handleImport = () => {
    if (!metadataXml.trim()) return;
    setImportStatus('idle');
    
    try {
      if (metadataXml.includes('EntityDescriptor')) {
        setEntityId('urn:idp:parsed-' + Math.floor(Math.random() * 9999));
        setCertificate('-----BEGIN CERTIFICATE-----\nAUTO_PARSED_DATA_MOCK\n-----END CERTIFICATE-----');
        setImportStatus('success');
        setTimeout(() => {
          setImportMode(false);
          setImportStatus('idle');
        }, 1200);
      } else {
        throw new Error("Format Mismatch");
      }
    } catch (e) {
      setImportStatus('error');
    }
  };

  const handleContinue = () => {
    if (!appName || !entityId || !acsUrl) {
      alert('Please fill in all required fields');
      return;
    }
    onContinue({
      type: 'SAML 2.0',
      name: appName,
      entityId,
      acsUrl,
      certificate,
      nameIdFormat,
      mappings
    });
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Selection
      </button>

      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SAML 2.0 Configuration</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Configure Security Assertion Markup Language protocol</p>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-10 space-y-8">
          {/* Import Option */}
          {!importMode ? (
            <button 
              onClick={() => setImportMode(true)}
              className="w-full p-8 border-2 border-dashed border-slate-700 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex flex-col items-center gap-4 text-slate-400 hover:text-white group"
            >
              <Upload size={32} className="group-hover:text-cyan-400 transition-colors" />
              <div className="text-center">
                <p className="font-bold text-base uppercase tracking-wide">Import SAML Metadata</p>
                <p className="text-xs text-slate-500 mt-2">Paste XML metadata to auto-populate fields</p>
              </div>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Metadata XML Input</h3>
                <button 
                  onClick={() => setImportMode(false)}
                  className="text-xs text-slate-400 hover:text-white font-bold uppercase"
                >
                  Cancel
                </button>
              </div>
              <textarea 
                value={metadataXml}
                onChange={(e) => setMetadataXml(e.target.value)}
                placeholder="Paste SAML Metadata XML here..."
                className="w-full h-48 bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <div className="flex gap-4">
                <button 
                  onClick={handleImport}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-2xl transition-all uppercase tracking-widest text-sm"
                >
                  Parse Metadata
                </button>
              </div>
              {importStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle2 className="text-emerald-400" size={20} />
                  <span className="text-emerald-400 font-bold text-sm uppercase tracking-wide">Metadata imported successfully</span>
                </div>
              )}
              {importStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertCircle className="text-red-400" size={20} />
                  <span className="text-red-400 font-bold text-sm uppercase tracking-wide">Invalid metadata format</span>
                </div>
              )}
            </div>
          )}

          {/* Manual Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Layout size={18} className="text-cyan-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Entity Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Application Name *</label>
                <input 
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g., Cloud Gateway"
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Name ID Format</label>
                <select 
                  value={nameIdFormat}
                  onChange={(e) => setNameIdFormat(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                >
                  <option>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</option>
                  <option>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</option>
                  <option>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Entity ID *</label>
                <input 
                  type="text"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  placeholder="urn:idp:example"
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">ACS URL *</label>
                <input 
                  type="text"
                  value={acsUrl}
                  onChange={(e) => setAcsUrl(e.target.value)}
                  placeholder="https://app.example.com/saml/acs"
                  className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">X.509 Certificate</label>
              <textarea 
                value={certificate}
                onChange={(e) => setCertificate(e.target.value)}
                placeholder="-----BEGIN CERTIFICATE-----"
                className="w-full bg-slate-950/60 border border-white/5 rounded-2xl px-6 py-3 text-white text-sm font-mono h-24 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Attribute Mapping */}
          <div className="space-y-6 border-t border-white/5 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint size={18} className="text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Attribute Mapping</h3>
              </div>
              <button 
                onClick={addMapping}
                className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-wide"
              >
                <Plus size={14} />
                Add Mapping
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {mappings.map((mapping, index) => (
                <div key={mapping.id} className="flex items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 group transition-all">
                  <GripVertical size={16} className="text-slate-700 group-hover:text-slate-500 cursor-grab" />
                  
                  <select 
                    value={mapping.idpAttribute}
                    onChange={(e) => updateMapping(mapping.id, 'idpAttribute', e.target.value)}
                    className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                  >
                    <option value="">IDP Attribute</option>
                    {COMMON_IDP_ATTRIBUTES.map(attr => <option key={attr}>{attr}</option>)}
                  </select>

                  <div className="text-slate-500 font-bold">→</div>

                  <select 
                    value={mapping.spAttribute}
                    onChange={(e) => updateMapping(mapping.id, 'spAttribute', e.target.value)}
                    className="flex-1 bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-bold"
                  >
                    <option value="">SP Attribute</option>
                    {COMMON_SP_ATTRIBUTES.map(attr => <option key={attr}>{attr}</option>)}
                  </select>

                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button 
                        onClick={() => moveMapping(index, 'up')}
                        className="text-slate-600 hover:text-white p-1 rounded transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                    )}
                    {index < mappings.length - 1 && (
                      <button 
                        onClick={() => moveMapping(index, 'down')}
                        className="text-slate-600 hover:text-white p-1 rounded transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => removeMapping(mapping.id)}
                    className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          <button 
            onClick={onBack}
            className="flex-1 bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest"
          >
            Back
          </button>
          <button 
            onClick={handleContinue}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl transition-all shadow-2xl shadow-cyan-600/30 uppercase tracking-widest flex items-center justify-center gap-3 group"
          >
            Continue Setup
            <ChevronUp size={18} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
};
