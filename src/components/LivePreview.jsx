import React from 'react';
import { Terminal, Eye } from 'lucide-react';

const LivePreview = ({ currentAgent, currentOutput }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 mb-8">
      <div className="flex items-center mb-4">
        <Eye className="w-6 h-6 text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Live Preview</h2>
      </div>
      {currentAgent ? (
        <div>
          <p className="text-gray-400 mb-2">Currently working on: <span className="font-medium text-blue-300">{currentAgent.name}</span></p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-gray-200 max-h-60 overflow-y-auto">
            {currentOutput ? (
              <pre>{currentOutput}</pre>
            ) : (
              <p className="text-gray-500">Waiting for output...</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Pipeline not running or no agent active.</p>
      )}
    </div>
  );
};

export default LivePreview;
