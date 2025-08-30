import React, { useEffect } from 'react';
import { X, Copy, Download, CheckCircle } from 'lucide-react';

const OutputModal = ({ isOpen, onClose, agent, output }) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Copy output to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      // Show success feedback (could be enhanced with toast notification)
      const copyBtn = document.getElementById('copy-btn');
      if (copyBtn) {
        copyBtn.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
        setTimeout(() => {
          copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Download output as text file
  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent?.name?.toLowerCase().replace(/\s+/g, '-')}-output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format output with markdown-like styling
  const formatOutput = (text) => {
    if (!text) return '';

    // Split by code blocks first
    const parts = text.split(/```(\w+)?\n([\s\S]*?)```/g);
    const formatted = [];

    for (let i = 0; i < parts.length; i += 3) {
      // Regular text
      if (parts[i]) {
        const regularText = parts[i]
          // Bold text
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
          // Headers
          .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-blue-400 mt-4 mb-2">$1</h3>')
          .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-blue-300 mt-6 mb-3">$1</h2>')
          .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-blue-200 mt-6 mb-4">$1</h1>')
          // Lists
          .replace(/^- (.*$)/gm, '<div class="flex items-start space-x-2 my-1"><span class="text-blue-400 mt-1">•</span><span>$1</span></div>')
          // Line breaks
          .replace(/\n/g, '<br>');

        formatted.push(
          <div 
            key={`text-${i}`} 
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: regularText }}
          />
        );
      }

      // Code blocks
      if (parts[i + 1] !== undefined && parts[i + 2]) {
        const language = parts[i + 1] || 'text';
        const code = parts[i + 2];
        
        formatted.push(
          <div key={`code-${i}`} className="my-4">
            <div className="bg-gray-800 rounded-t-lg px-4 py-2 border-b border-gray-700">
              <span className="text-sm text-gray-400 font-mono">{language}</span>
            </div>
            <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-100 font-mono whitespace-pre">
                {code}
              </code>
            </pre>
          </div>
        );
      }
    }

    return formatted;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${agent?.bgColor || 'bg-blue-500'}`}>
              {agent?.icon && React.createElement(agent.icon, { className: "w-5 h-5 text-white" })}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {agent?.name} Output
              </h2>
              <p className="text-sm text-gray-400">
                {agent?.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Action Buttons */}
            <button
              id="copy-btn"
              onClick={copyToClipboard}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-gray-300" />
            </button>
            
            <button
              onClick={downloadOutput}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Download output"
            >
              <Download className="w-4 h-4 text-gray-300" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {output ? (
            <div className="space-y-4">
              {formatOutput(output)}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                {agent?.icon && React.createElement(agent.icon, { className: "w-8 h-8 text-gray-400" })}
              </div>
              <p>No output available yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Generated by {agent?.name}</span>
            <span>{output ? `${output.length} characters` : '0 characters'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputModal;
