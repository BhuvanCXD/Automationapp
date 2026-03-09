import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Blue Glow at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-blue-700/50 via-blue-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};