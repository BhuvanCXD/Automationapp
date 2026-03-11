import React, { useEffect, useState } from 'react';
import { Terminal, Copy, Download, X } from 'lucide-react';

interface TerminalLogProps {
  isOpen?: boolean;
  onClose?: () => void;
  logs?: string[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ isOpen = true, onClose, logs = [] }) => {
  const [displayLogs, setDisplayLogs] = useState<string[]>([]);

  useEffect(() => {
    setDisplayLogs(logs.length > 0 ? logs : [
      '> Initializing secure connection...',
      '> Validating credentials...',
      '[SUCCESS] Authentication passed',
      '> Loading application configuration...',
      '> Establishing relay connection...',
      '[SUCCESS] Relay online',
      '> Syncing metadata...',
      '> Configuration deployed successfully',
      '> All systems operational'
    ]);
  }, [logs]);

  const copyLogs = () => {
    navigator.clipboard.writeText(displayLogs.join('\n'));
  };

  const downloadLogs = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(displayLogs.join('\n')));
    element.setAttribute('download', `logs-${new Date().toISOString()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-1/2 h-96 bg-slate-950 border-t border-l border-white/5 flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-cyan-400" />
          <span className="font-black text-white uppercase tracking-widest text-sm">Terminal Output</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={copyLogs}
            className="text-slate-500 hover:text-white p-2 rounded transition-colors"
            title="Copy logs"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={downloadLogs}
            className="text-slate-500 hover:text-white p-2 rounded transition-colors"
            title="Download logs"
          >
            <Download size={16} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-white p-2 rounded transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm custom-scrollbar space-y-1">
        {displayLogs.map((log, idx) => (
          <div key={idx} className={`transition-colors ${
            log.includes('[SUCCESS]') ? 'text-emerald-400' :
            log.includes('[ERROR]') ? 'text-red-400' :
            log.includes('[WARNING]') ? 'text-yellow-400' :
            'text-slate-300'
          }`}>
            {log}
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
};
