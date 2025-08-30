import React from 'react';
import { Eye, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const AgentCard = ({ 
  agent, 
  status, 
  output, 
  isActive, 
  onViewOutput,
  index,
  totalAgents 
}) => {
  // Get status styles and icons
  const getStatusConfig = () => {
    switch (status) {
      case 'working':
        return {
          borderColor: 'border-blue-500 shadow-glow',
          bgColor: 'bg-gray-800',
          statusIcon: Loader,
          statusColor: 'text-blue-400',
          statusText: 'Working...',
          pulse: true
        };
      case 'completed':
        return {
          borderColor: 'border-green-500 shadow-glow-green',
          bgColor: 'bg-gray-800',
          statusIcon: CheckCircle,
          statusColor: 'text-green-400',
          statusText: 'Completed',
          pulse: false
        };
      case 'error':
        return {
          borderColor: 'border-red-500',
          bgColor: 'bg-gray-800',
          statusIcon: AlertCircle,
          statusColor: 'text-red-400',
          statusText: 'Error',
          pulse: false
        };
      default:
        return {
          borderColor: 'border-gray-600',
          bgColor: 'bg-gray-800/50',
          statusIcon: Clock,
          statusColor: 'text-gray-400',
          statusText: 'Waiting',
          pulse: false
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.statusIcon;

  // Truncate output for preview
  const getOutputPreview = () => {
    if (!output) return 'No output yet';
    if (output.length <= 120) return output;
    return output.substring(0, 120) + '...';
  };

  return (
    <div className="relative">
      {/* Connection Line to Next Agent */}
      {index < totalAgents - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-8 w-16 h-0.5 agent-connection-line transform -translate-y-1/2 z-10">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Agent Card */}
      <div className={`
        relative p-6 rounded-xl border-2 transition-all duration-300 card-shadow
        ${statusConfig.borderColor} ${statusConfig.bgColor}
        ${statusConfig.pulse ? 'animate-pulse-glow' : ''}
        ${isActive ? 'transform scale-105' : ''}
        hover:transform hover:scale-102 hover:shadow-lg
      `}>
        {/* Agent Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${agent.bgColor}`}>
              <agent.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-400">
                {agent.role}
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${statusConfig.statusColor} ${
              status === 'working' ? 'animate-spin' : ''
            }`} />
            <span className={`text-sm font-medium ${statusConfig.statusColor}`}>
              {statusConfig.statusText}
            </span>
          </div>
        </div>

        {/* Agent Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {agent.description}
        </p>

        {/* Output Preview */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4 min-h-[80px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Output Preview
            </span>
            {output && (
              <span className="text-xs text-gray-500">
                {output.length} chars
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-300 leading-relaxed">
            {status === 'working' ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">Generating output...</span>
              </div>
            ) : (
              <p className="text-gray-400">
                {getOutputPreview()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              status === 'completed' ? 'bg-green-400' : 
              status === 'working' ? 'bg-blue-400' : 
              status === 'error' ? 'bg-red-400' : 'bg-gray-500'
            }`} />
            <span className="text-xs text-gray-400">
              Step {index + 1} of {totalAgents}
            </span>
          </div>
          
          {output && status === 'completed' && (
            <button
              onClick={() => onViewOutput(agent, output)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 
                         text-white text-sm rounded-lg transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Output</span>
            </button>
          )}
        </div>

        {/* Working Animation Overlay */}
        {status === 'working' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl">
            <div className="h-full bg-white/20 rounded-t-xl animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
